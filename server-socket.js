const ws_module = require('ws');
const server = new ws_module.WebSocketServer({
    port: 8080
});
const search_range = 12;
const yt_search = require('./yt-search.js');
const mpv_control = require('./mpv-controller.js');
const json_process = require('./json-process.js');

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

function open_return(socket, url) {
    var proc = new mpv_control.open(url[0]);
    proc.execCommand(function(stdout) {
        console.log("Process finished!"); 
    });
}

function add_playlist_return(data) {
     json_process.add_json_item(data, "playlist");
}

function add_queque_return(data) {
     json_process.add_json_item(data, "queque");
}

function download_return() {}

function playlist_return() {}

var current_index = 0;
function queque_return(socket, url, con) {
    function temp_play() {
        json_process.get_item_url('playlist', current_index, function(URL) {
            mpv_control.open(URL, function(stdout) {
                json_process.get_item('playlist', function(obj) {
                    if (current_index < obj.length-1) {
                        current_index = current_index + 1;
                        send(socket, 'queque', obj[current_index].thumbnail);
                        queque_return('', true);
                    }
                    console.log("Process finished!"); 
                });
            });
        });
    }
    if (con == false) { json_process.find_item_index('playlist', url, function(index) {
        current_index = index;
        temp_play();
    })} else { temp_play(); }

}

function unknown_return(error) {
    console.log("unrecognizable msg type: %s", error);
}

function error_event(socket) {
    socket.on('error', console.error);
}

function message_event(socket) {
    socket.on('message', function message(data) {
        const processed_data = JSON.parse(data);
        const key_value = processed_data[0];
        const content_value = processed_data[1];
        switch (key_value) {
            case 'search':
                search_return(socket, content_value);
                break;
            case 'open':
                open_return(socket, content_value);
                break;
            case 'add_playlist':
                add_playlist_return(content_value);
                break;
            case 'add_queque':
                add_queque_return(content_value);
                break;
            case 'download':
                download_return();
                break;
            case 'playlist':
                playlist_return();
                break;
            case 'queque':
                queque_return(socket, content_value[0], false);
                break;
            case 'play':
                mpv_control.play();
                break;
            case 'pause':
                mpv_control.pause();
                break;
            default:
                unknown_return(key_value);
                break;
        }
    });
}

function listen() {
    server.on('connection', function connection(socket) {
        error_event(socket);
        message_event(socket);
    });
}

module.exports = {
    listen: listen,
}
