'use strict';

var Client = require('../index').Client;


/* create a client */
var client = new Client();

/*
 * once we get the ready event from the server,
 * we're good to go! we can now start emitting
 * and the server will hear the events!
 */
client.on('ready', function () {
    client.emit('addOne', 1);
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

client.on('serverTime', function (event, date) {
    console.log('[client1] got ["serverTime"] data from server -> ' + date);
});



client.connect('ws://localhost:8000');
