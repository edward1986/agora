'use strict';

var Server = require('../index').Server;
var Client = require('../index').Client;

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


/* create some clients */
var client = new Client();
var client2 = new Client();

/*
 * once we get the ready event from the server,
 * we're good to go! we can now start emitting
 * and the server will hear the events!
 */
client.on('ready', function () {
    client.emit('addOne', 1);
});

client2.on('ready', function () {
    client2.emit('addOne', 888);
});

/*
 * once you've built your server API, you can
 * listen to events. Here we've set up
 * an addResult event.
 */
client.on('addResult', function (data) {
    console.log('[client1] got ["addResult"] data from server -> ' + data);

    setTimeout(function () {
        client.emit('addOne', data);
    }, 5000);
});

client2.on('addResult', function (data) {
    console.log('[client2] got ["addResult"] data from server -> ' + data);

    setTimeout(function () {
        client2.emit('addOne', data += 5);
    }, 5000);
});

client.on('serverTime', function (date) {
    console.log('[client1] got ["serverTime"] data from server -> ' + date);
});

client2.on('serverTime', function (date) {
    console.log('[client2] got ["serverTime"] data from server -> ' + date);
});


client.connect('ws://localhost:8000');
client2.connect('ws://localhost:8000');
