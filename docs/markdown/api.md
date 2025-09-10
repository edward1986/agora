### API Documentation
```javascript
var SmallTalk = require('agora');
```

#### var server = new SmallTalk.Server(opts)
returns a new instance of a `SmallTalk.Server`.

##### `opts.port`
specify the port number `int`


#### Server Class

##### Server.emitIO
reference to the underlying `emit.io` instance.

##### Server.wsServer
reference to the underlying `ws.Server` instance.

##### Server.inStreams
a `hash` of client agora inStreams.

##### Server.outStreams
a `hash` of client agora outStreams.


##### Event `'connection'`

```javascript
server.on('connection', function (connection) {
    // do stuff with the connection
});
```

###### Whenever a new client websocket connection is made to the server, a `connection` event is fired.
The handler is called with a `connection` object, which consists of the following:

##### connection.id
A random `string`

##### connection.inStream
`EventEmitter` on which you can listen to events coming down through the clients' websocket stream.

```javascript
var inStream = connection.inStream

inStream.on('someClientEvent', function (data) {
    // do something with client data here!
})
```

##### connection.outStream
`EventEmitter` on which you can emit to, and send events and data back to a client websocket stream.

```javascript
server.emitTo(inStream, 'someEvent', {'some': 'data'});
```

##### connection.parser
reference to the underlying `JSONStream` parsing stream.

##### connection.stringify
reference to the underlying `JSONStream` stringifying stream.



#### var client = new SmallTalk.Client()
returns a new instance of a `SmallTalk.Client`.

#### Client Class

##### Client.emitIO
reference to the underlying `emit.io` instance.

##### Client.wstream
reference to the underlying `websocket-stream` instance. Only available after calling `client.connect()`

##### Client.inStream
`EventEmitter` through which JSON-parsed events can be listened to coming down through the websocket stream.

```javascript
client.on('someServerEvent', function (data) {
    // do something with `data` from the server
});
```

##### Client.outStream
`EventEmitter` to which you can emit events back down to the server. Emitted data will be piped into the websocket stream.

```javascript
client.emit('someData', {foo: 'bar'});
```

### license
MIT
