'use strict';

var Server = require('../index').Server;

var server = new Server({
    port: 8000
});

server.on('connection', function registerListeners (conn) {

    var id = conn.id;

    /* returned inStream is an emitter */
    var inStream = conn.inStream;

    /* you can emit to the outStream and data will be piped off to the client */
    var outStream = conn.outStream;

    /*
     * listen on a per client basis
     * in this case, we listen for the 'addOne' event from the client,
     * and we can wrangle it, then send it back with an 'addResult' event
     */
    inStream.on('addOne', function (data) {
        server.emitTo(outStream, 'addResult', data += 1);
    });

    /* emit to one client */
    server.emitTo(outStream, 'ready', id);
});

/* or emit to everyone! */
setInterval(function () {
    server.emit('serverTime', new Date());
}, 5000);
