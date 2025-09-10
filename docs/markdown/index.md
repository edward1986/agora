## SmallTalk [![Build Status](https://magnum.travis-ci.com/alexander-daniel/agora.svg?token=5GnFxJg7qeJWRzj1HsZo&branch=master)](https://magnum.travis-ci.com/alexander-daniel/agora)
Dead simple websocket communication module.

Stream JSON data easily between server and clients with events. You can broadcast to all clients, or just one.

Runs in node and in the browser with browserify!

It's basically a simple wrapper built around the awesome module [emit.io](https://github.com/bpostlethwaite/emit.io).

### Documentation

- ###### [Getting Started](getting-started.html)
- ###### [Browser-Time](browser-time.html)

##### [API Docs](api.html)

### Install
```bash
npm install agora
```

#### Server example
```javascript
var Server = require('agora').Server;

var server = new Server({
    port: 8000
});

server.on('connection', function (conn) {

    var id = conn.id;

    /* returned inStream is an emitter */
    var inStream = conn.inStream;

    /* you can emit to the outStream and data will
     * be piped off to the client */
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
}, 1000);

```

#### Client example
```javascript
var Client = require('agora').Client;
var client = new Client();

/*
 * once we get the ready event from the server,
 * we're good to go! we can now start emitting
 * and the server will hear the events!
 */
client.on('ready', function (id) {
    client.id = id;
    client.emit('addOne', 1);
});

/*
 * once you've built your server API, you can
 * listen to events. Here we've set up
 * an addResult event.
 */
client.on('addResult', function (data) {
    var div = document.getElementById('#someDiv');
    div.innerHTML = data;

    setTimeout(function () {
        client.emit('addOne', data);
    }, 5000);
});

client.on('serverTime', function (date) {
    console.log(date);
});

/* connect the client! */
client.connect('ws://localhost:8000');

```
