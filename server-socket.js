const ws_module = require('ws');
const server = new ws_module.WebSocketServer({
    port: 8080
});
const search_range = 3;
const yt_search = require('./yt-search.js');

function processVideo(data) {
    return [data.thumbnail, data.title, data.author.name];
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
            case 'download':
                download_return();
                break;
            case 'playlist':
                playlist_return();
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
