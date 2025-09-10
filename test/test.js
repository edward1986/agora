'use strict';

var test = require('tape');
var SmallTalk = require('../index');
var Server = SmallTalk.Server;
var Client = SmallTalk.Client;

test('agora', function (t) {

    t.plan(3);

    var server = new Server({ port: 8000 });
    var client = new Client();
    var clientId;

    server.on('connection', function registerListeners (conn) {

        var id = conn.id;
        clientId = id;
        var inStream = conn.inStream;
        var outStream = conn.outStream;

        inStream.on('addOne', function (data) {
            t.isEqual(data, 8, 'got expected data from client');
            server.emitTo(outStream, 'addResult', data += 1);
        });

        server.emitTo(outStream, 'ready', id);
    });

    client.on('ready', function (id) {

        t.isEqual(id, clientId, 'can recieve event properly from the server');

        client.emit('addOne', 8);
    });

    client.on('addResult', function (data) {

        t.isEqual(data, 9, 'got expected data from server');

        /* close up shop so tests can end */
        server.wsServer.close();
        t.end();
    });

    client.connect('ws://localhost:8000');

});
