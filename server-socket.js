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
    mpv_control.open(url[0]);
}

async function add_playlist_return(data) {
    await json_process.add_playlist_item(data);
}

function download_return() {}

function playlist_return() {}

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
                //open_return(socket, content_value);
                break;
            case 'add_playlist':
                add_playlist_return(content_value);
                break;
            case 'download':
                download_return();
                break;
            case 'playlist':
                playlist_return();
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
