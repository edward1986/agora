'use strict';

var Client = require('../../index').Client;
var client = new Client();

var serverTimeDiv = document.createElement('div');
var dataDiv = document.createElement('div');
document.body.appendChild(serverTimeDiv);
document.body.appendChild(dataDiv);

client.on('ready', function () {
    dataDiv.innerHTML = 'got ready from the server!';
    client.emit('addOne', 1);
});


client.on('addResult', function (data) {
    dataDiv.innerHTML = 'got "addResult" event from server : ' + data;

    setTimeout(function () {
        client.emit('addOne', data);
    }, 5000);
});

client.on('serverTime', function (date) {
    serverTimeDiv.innerHTML = 'server time: ' + date;
});

client.connect('ws://localhost:8000');
