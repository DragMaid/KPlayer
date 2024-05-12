const express = require('express');
const http = require('http');
const path = require('path');
const reload = require('reload');
const publicDir = path.join(__dirname, '..', 'public');
const jlog = require('./server-logger.js')
const socket = require('./server-socket.js');
const listdata = path.join(__dirname, '..', 'storage', 'playerlist.json');
const logdata = path.join(__dirname, '..', 'logs', jlog.get_logfile());

const app = new express();
app.set('port', process.env.PORT || 3000);
app.use('/', express.static(publicDir));
app.get('/storage', (req, res) => { res.sendFile(listdata); });
app.get('/log', (req, res) => { res.sendFile(logdata); });
socket.listen();

var server = http.createServer(app)
reload(app).then(function(reloadReturned) {
    server.listen(app.get('port'), function() {
        jlog.log('INFO', 'Web server listening on port ' + app.get('port'))
    })
}).catch(function(err) {
    jlog.log('ERROR', 'Reload could not start, could not start server/sample app\n' + err)
})
