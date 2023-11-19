module.exports = class MusicSocket {
    constructor(port) {
        this.port = port;
        this.wsModule = require('ws');
        this.wss = new this.wsModule.WebSocketServer({ port: this.port });
    }
    listen() {
        this.wss.on('connection', function connection(socket) {
          socket.on('error', console.error);

          socket.on('message', function message(data) {
            console.log('received: %s', data);
          });
        });
    }
}
