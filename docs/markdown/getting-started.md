## Getting Started

The purpose of this getting-started guide is to demonstrate how to set-up two way messaging between one server and several clients. What data you choose to send back and forth is up to you! This guide assumes you've got some basic JavaScript and node.js chops. Nothing advanced, but you've gotta know what a callback is.

## Introduction

Socket.io is really cool. My only issue with it is that there is a lot of magic going on under the hood. When I was starting out about a year ago, I was able to build some awesome little prototypes with Socket.io super quickly. I appreciated that. However, as I continued learning, I wanted something a bit more modular, something I truly understood. agora is an attempt at creating a simple framework to quickly build real-time apps.

## Setting up your Environment

You'll first need to make sure that [node](https://nodejs.org/) is installed!

All done, great! Let's create a project folder. I'll create mine in my home directory like so:
```bash
cd ~/ && mkdir websocket-app
```
Great! All I've done there is move to my home directory (`cd ~/`), and created a folder (`mkdir {desiredFolderName}`).

Now, move into that directory:
```bash
cd websocket-app
```

Great! We're ready to start creating our app.

## Setting up your `package.json`

The `package.json` file we'll be creating is a nice manifest that describes our App. We don't need to do much here for now except to create one. To do that, run the following:

```bash
npm init
```

That will run a CLI tool for creating a new module. You don't really need to provide any values yet!

Done with `npm init`? Great!

List the files in your project directory to see that `package.json` was generated:

```bash
ls -la
```

For our project, we'll have one module we want to use a dependency, agora! Let's install that in our project now.

To do so, do the following:
```bash
npm install agora --save
```

This will download and install the `agora` module to a newly-created folder called `node_modules`. This only installs the module locally in your project, so you can rest easy knowing that you're not installing some random version accross your system. The `--save` flag we've provided to the install command saves the `agora` module and version number in your `package.json`, so that you include the dependency in your app's manifest!

Don't believe me? Run the following:
```bash
cat package.json
```

## Creating the server

Let's create a file called `server.js` in our project directory, and start building it!

We'll start by require'ing the Server constructor and creating a instance of our agora server.

```javascript
var Server = require('agora').Server;
var server = new Server({
    port: 8000
});
```

All we've done here is required the Server module from our `node_modules` folder, and instantiated an instance of a agora server, which will listen on port `8080`.

Next, we're going to set up the function that will fire each time a 'connection' event is fired. (When a new client connects in the browser):
```javascript
server.on('connection', function (connection) {
    console.log('got connection!');
    // Do things with 'websocket' here.
});
```

So we haven't yet done anything with the incoming connections except log that we've gotten one. That's fine for now, as I want to illustrate everything step-by-step. Let's move onto setting up our Client and we'll come back to this later.


## Creating the client

Let's create a file called `client.js` in our project directory. We'll be doing more or less the same thing as the Server, expect we'll use the Client Constructor instead of the Server.

```javascript
var Client = require('agora').Client;
var client = new Client();

client.connect('ws://localhost:8000');
```

Our instance of Client has a `connect()` method, which takes one argument, the websocket address of the server you want to connect to. In our case, we've set up the server to listen on port `8000`, so we'll want to connect there.

## First run

Great! So by now you should have 3 files in your project directory, `package.json`, `server.js` and `client.js`. You will also have a `node_modules` folder.

Now, in one terminal, fire up the server with a:
```bash
node server.js
```

And in another terminal window, fire up the client:
```bash
node client.js
```

You should see the server spit out something like this:
```bash
node server.js
got connection!
```

Yes! We've got a websocket connection from the client. Cool! Now we can start shuttling information back and forth!

## Back to the Server

Open up `server.js` again, we're going to add a little bit more to the handler function!

Your `server.js` file should now look like:

```javascript
server.on('connection', function (connection) {

    var id = conn.id;
    var inStream = connection.inStream;
    var outStream = connection.outStream;

    inStream.on('addOne', function (data) {
        server.emitTo(outStream, 'addedOne', data += 1);
    });

    server.emitTo(outStream, 'ready', id);
});
```

### Wait, what's going on here?

When a connection is made, the callback is fired with the `connection` object as its argument. The `connection` object has three main properties:

- `connection.id` a random string of letters and numbers
- `connection.inStream` is an EventEmitter that we can listen to for events fired by the client
- `connection.outStream` is a Stream we can emit events and data to!

So here, all we're doing is adding a handler for when the client sends a 'addOne' event with some data. Once we get that event we just add one to the data, and emit it back to the connection's `outStream`!

After we've set-up the listener, we're going to send a 'ready' event to the client, with the connection id!

Let's head back over to the Client-side and make something happen!

## Back to the Client

Last we saw, all we were doing on our client was connecting to the server. Now that we've got some listeners set up, let's have some fun!

We know that the server is going to send us a 'ready' event. Let's create a listener for that baddy. Add the following to your `client.js` script, just above the `client.connect()` line.

```javascript
client.on('ready', function () {
    client.emit('addOne', 1);
});

client.on('addedOne', function (data) {
    console.log('got "addedOne" event from the server with data: ' + data);
});
```

#### So what's happening here?
We've set up two listeners. When the client gets the `ready` event from the server, it will then emit an 'addOne' event back to the server, with the integer `1` as the data payload. As you recall, in our server we take those events, add one to them, then emit a `addedOne` event back to the client. That's where our second listener comes in!

When we get that `addedOne` event, let's just log it and see if we got back some data from the server!

## Let's run it again!

Open up two terminal windows again, and run the following in each:

```bash
node server.js
```

```bash
node client.js
```

from the terminal you ran the client in, you should see the following:
```bash
node client.js
got "addedOne" event from the server with data: 2
```

Success! We've got a working two-way websocket communication!

Let's head over to the next section and bring this into the browser! Yeehaw!
