## Browser Time

Alright! So we've managed to run everything in the terminal up to now. The great thing about many node.js modules is that they can also run in browser-land with a neat tool called [browserify](http://browserify.com). agora is no different! All of the streaming-evented goodness is easy to use in the browser as well!

At the end of this exercise, we'll have a webpage that accepts input from the user, and returns something useful that the client can add to the DOM!

Without further ado, let's start buildin'!

## Server setup

Alright, so this time around, we're going to also need a staticServer, to handle requests for static content like .html pages, .css stylesheets, images, etc.

I personally love [ecstatic](https://www.npmjs.com/package/ecstatic). It's simple, and easy-to-use.

Let's add `ecstatic` as a dependency to our project. Do a:
```bash
npm install --save ecstatic
```

Great! Now we can start writing our server script.

```javascript
var http = require('http');
var ecstatic = require('ecstatic');

var staticOptions = { root: __dirname + '/static' };
var staticServer = http.createServer(ecstatic(staticOptions));

staticServer.listen(8080, function () {
    console.log('static server listening on :8080');
});
```

And that'll do it for our static-server! Let's go through this so we can see what's happening.
We require in `http` and `ecstatic`, set our `/static` directory as the one to serve to the public, and then create a new `http` Server.

Now we can listen on any port, except the one that the websocket server will listen on. Let's go with `8080`.

Now, let's move on and start building out the Agora server.

```javascript
var Server = require('../../index').Server;
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

setInterval(function () {
    server.emit('serverTime', new Date());
}, 1000);
```

We're pretty much doing the same thing as the first exercise, except we've added a 'serverTime' event. The agora server will just emit the 'serverTime' event to all clients with the current server time! We'll pick that up on the client-side.


## Client Setup

#### client.js
```javascript
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
```

Alright, so here we're initializing our agora client the same way as before, but we're going to create a few DOM elements (divs and the like), so we have a place to put our data! You can obviously extend this to use any of React, Ampersand etc.

So here we have one div that we can put our 'serverTime' in, and one for our 'addResult' data.

That's it! Once the connection is made, all of the events will be fired automatically.

**Note: DO NOT actually use `innerHTML`. I'm just using it here for brevity.**

#### static/index.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Agora | Browser-Time</title>
</head>

<body>
    <script src="bundle.js"></script>
</body>


</html>
```

Awesome. The astute ones among you will wonder what the `bundle.js` is doing there. We've only got `client.js` and `server.js`! No problem, this is where [browserify](http://browserify.com) hops into the arena and does its magic.

First, let's install it:
```bash
npm install browserify
```

Like usual, that will install browserify into your node_modules folder, keeping it isolated.
While the isolation is desired, you'll notice that if you try to run `browserify` from your command-line, it won't work. To keep things really node-y, we're going to whip up a quick npm run script to handle the 'Browserifying'.

To do so, open up your `package.json` once again, and modify the `scripts` portion so it looks like the following:
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build-js": "browserify client.js > static/bundle.js -v"
}
```

So to run that command, all you have to do is:
```bash
npm run build-js
```

What does it do? It takes your `client.js` src and pipes it through Browserify, outputting a browser-ready bundle which we pipe into `static/bundle.js`. Easy right? Now we've got our `bundle.js` that is being used by our `index.html`. We're ready to cheggitout!


## Let's do this!

From your terminal, fire up the server:

```bash
node server.js
```

Now head to your browser and visit `http://localhost:8080`.

The static server will serve up the HTML files and any other static assets (we only have the HTML file). Once the client has received `bundle.js`, it will run it, and all the magic will happen in your browser!

Next guide will probably be integrating with some framework like Ampersand or React!
