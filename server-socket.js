module.exports = class MusicSocket {
    constructor(port) {
        this.port = port;
        this.wsModule = require('ws');
        this.wss = new this.wsModule.WebSocketServer({ port: this.port });
        this.yt_search = require('./yt-search.js');
    }
    search(keyword) {
        yt_search.findVideo(keyword);
    }
    listen() {
        this.wss.on('connection', function connection(socket) {
          socket.on('error', console.error);
          socket.on('message', function message(data) {
            const key_value = String(data).split(':');
            switch (key_value[0]) {
                case 'search':
                    search(key_value[1]);
                    break;
                case 'download':
                    break;
                case 'playlist':
                    break;
                default:
                    console.log("unrecognizable msg type: %s", key_value[0]);
                    break;
            }
          });
        });
    }
}
