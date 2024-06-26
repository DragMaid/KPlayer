const ws_module = require('ws');
const server = new ws_module.WebSocketServer({ port: 8080 });
const search_range = 12;
const yt_search = require('./yt-search.js');
const mpv_control = require('./mpv-controller-api.js');
const json_process = require('./json-process.js');
const jlog = require('./server-logger.js');
var current_index = -1;
var current_playlist = null;
var current_video_thumbnail = null;

mpv_control.init(
    function() { request_reload('play'); },
    function() { request_reload('pause'); },
    function() { request_reload('pause'); },
);

function processVideo(data) {
    return [data.thumbnail, data.title, data.author.name, data.url];
}

function send(socket, type, content) {
    socket.send(JSON.stringify([type, content]));
}

function search_return(socket, data) {
    var search_result = yt_search.find_video(data[0], search_range);
    search_result.then((res) => {
        res.forEach((vinfo) => {
            send(socket, 'create', processVideo(vinfo));
        })
    });
}

function request_reload(type) {
    var msg;
    switch (type) {
        case 'queque': msg = 'update_queque'; break;
        case 'playlist': msg = 'update_playlist'; break;
        case 'play': msg = 'play'; break;
        case 'pause': msg = 'pause'; break;
        default: break;
    }
    server.clients.forEach(client => client.send(JSON.stringify([msg])));
}

function open_return(socket, content) {
    current_video_thumbnail = content[0];
    server.clients.forEach(
        client => send(client, "update_video", content));
    mpv_control.open(content[3], function() {}, function(stdout) {
    })
}

function add_playlist_return(playlist, video) {
    json_process.add_dict_json_item(
        playlist, video,
        () => { request_reload('playlist') }
    )
}

function add_queque_return(data) {
    json_process.add_json_item(
        data, "queque", 
        () => { request_reload('queque') }
    );
}

function mpv_change_volume(volume) {
    mpv_control.change_volume(volume);
}

function download_return() {
}

function play_playlist_via_index(socket) {
    json_process.get_playlist_item_url(current_playlist, current_index, function(URL) {
        mpv_control.open(
            URL,
            function() {
                json_process.get_playlist_item(current_playlist, function(obj) {
                    if (current_index < obj.length-1) {
                        server.clients.forEach(
                            client => {
                                send(client, "update_video", [obj[current_index].thumbnail]);
                            }
                        );
                    }
                })
            },
            function() {
                json_process.get_playlist_item(current_playlist, function(obj) {
                    if (current_index < obj.length-1) {
                        current_index = current_index + 1;
                        current_video_thumbnail = obj[current_index].thumbnail;
                        server.clients.forEach(
                            client => {
                                send(client, "update_video", [obj[current_index].thumbnail]);
                            });
                        playlist_return(socket, null, true);
                    }
                });
            }
        );
    });
}

function playlist_return(socket, url, continued) {
    if (!continued) {
        json_process.find_playlist_index(current_playlist, url, function(index) {
            if (index != current_index) {
                current_index = index;
                play_playlist_via_index(socket);
            }
        });
    } else {
        play_playlist_via_index(socket);
    }
}


function play_queque_via_index(socket) {
    json_process.get_item_url('queque', current_index, function(URL) {
        mpv_control.open(
            URL,
            function() {
                json_process.get_item('queque', function(obj) {
                    server.clients.forEach(
                        client => send(client, "update_video", [obj[current_index].thumbnail]));
                })
            },
            function() {
            json_process.get_item('queque', function(obj) {
                if (current_index < obj.length-1) {
                    current_index = current_index + 1;
                    current_video_thumbnail = obj[current_index].thumbnail;
                    queque_return(socket, null, true);
                }
            });
        });
    });
}

function queque_return(socket, url, continued) {
    if (!continued) {
        json_process.find_item_index('queque', url, function(index) {
            if (index != current_index) {
                current_index = index;
                play_queque_via_index(socket);
            }
        });
    } else {
        play_queque_via_index(socket);
    }
}

function playlist_select_return(playlist) {
    current_playlist = playlist;
}

function delete_playlist_return(playlist) {
    json_process.delete_playlist(playlist);
}

function delete_queque_video_return(url) {
    json_process.delete_queque_video(url);
}

function delete_playlist_video_return(playlist, url) {
    json_process.delete_playlist_video(playlist, url);
}

function unknown_return(type) {
    jlog.log("WARNING", "Unrecognizable msg type: %s" + type);
}

function error_event(socket) {
    socket.on('error', jlog.log);
}

function message_event(socket) {
    socket.on('message', function message(data) {
        const processed_data = JSON.parse(data);
        const key_value = processed_data[0];
        const content_value = processed_data[1];
        var q = 0;
        switch (key_value) {
            case 'search':
                search_return(socket, content_value);
                break;
            case 'open':
                open_return(socket, content_value);
                break;
            case 'add_playlist':
                add_playlist_return(content_value[0], content_value[1]);
                break;
            case 'add_queque':
                add_queque_return(content_value);
                break;
            case 'download':
                download_return();
                break;
            case 'delete_playlist':
                delete_playlist_return(content_value[0]);
                break;
            case 'delete_queque_video':
                delete_queque_video_return(content_value[0]);
                break;
            case 'delete_playlist_video':
                delete_playlist_video_return(current_playlist, content_value[0]);
            case 'playlist_select':
                playlist_select_return(content_value[0]);
                break;
            case 'change_volume':
                mpv_change_volume(content_value[0]);
                server.clients.forEach(client => send(client, 'update_volume', content_value[0]));
                break;
            case 'playlist':
                playlist_return(socket, content_value[0], false);
                break;
            case 'queque':
                queque_return(socket, content_value[0], false);
                break;
            case 'play':
                mpv_control.play();
                request_reload('play');
                break;
            case 'pause':
                mpv_control.pause();
                request_reload('pause');
                break;
            default:
                unknown_return(key_value);
                break;
        }
    });
}

function fetch_current_video(socket) {
    if (current_video_thumbnail != null) {
        send(socket, 'update_video', [current_video_thumbnail]);
    }

    if (mpv_control.get_status()) {
        request_reload('play');
    } else { request_reload('pause'); }
}

function listen() {
    server.on('connection', function connection(socket) {
        jlog.log("INFO", "A new device has connected to server");
        error_event(socket);
        message_event(socket);
        fetch_current_video(socket);
    });
}

module.exports = {
    listen: listen,
}
