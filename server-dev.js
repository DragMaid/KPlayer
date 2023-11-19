const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const publicDir = path.join(__dirname, 'public');
const musicSocket = require('./server-socket.js');
    
const MusicSocket = new musicSocket(8080);
const app = new express();
app.set('port', process.env.PORT || 3000);
app.use('/', express.static(publicDir));
MusicSocket.listen();

var server = http.createServer(app)
reload(app).then(function(reloadReturned) {
    server.listen(app.get('port'), function() {
        console.log('Web server listening on port ' + app.get('port'))
    })
}).catch(function(err) {
    console.error('Reload could not start, could not start server/sample app', err)
})
