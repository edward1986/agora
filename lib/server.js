'use strict';

/**
 * Here we're just importing all of the
 * dependencies to build the webSocketServer.
 *
 * We'll be accepting websocket connections
 * and piping those through a JSON stream, and
 * then we'll listen to events from the client.
 */
var EventEmitter = require('events').EventEmitter;
var WebSocketServer = require('ws').Server;
var websocket = require('websocket-stream');
var JSONStream = require('JSONStream');
var EmitIO = require('emit.io');
var hat = require('hat');
var util = require('util');

function EmitServer (opts) {

    EventEmitter.call(this);

    var self = this;

    /**
     * Create a new instance of EmitIO
     */
    this.emitIO = new EmitIO();

    this.wsServer = new WebSocketServer({
        port: opts.port
    });

    this.inStreams = {};
    this.outStreams = {};

    /**
     * WebSocketServer handler.
     *
     * When a client connects, we are passed the websocket.
     * Turn that websocket into a Stream, pipe it to a JSON parser,
     * then pipe its events at the instance of controller.
     *
     * Pipe events originating from controller back up to the
     * websocket.
     *
     */
    function onConnection (ws) {

        var id = hat(8,16);

        /* create a websocket stream */
        var wstream = websocket(ws);

        /* init JSON streams */
        var parser = JSONStream.parse([true]);
        var stringify = JSONStream.stringify();

        /* create an inStream from parsed client events
         * we're gonna pipe the wstream to the parser in a sec.
         */
        var inStream = self.emitIO(parser);

        /* create an outStream from controller events */
        var outStream = self.emitIO(self);

        /* create a reference of the streams */
        self.inStreams[id] = inStream;
        self.outStreams[id] = outStream;

        /* Pipe the client into the JSON parser */
        wstream.pipe(parser);

        /* stringify and send events from the controller to the client */
        outStream.pipe(stringify).pipe(wstream);

        /* create the connection object to pass through! */
        var connection = {
            id: id,
            inStream: inStream,
            outStream: outStream,
            parser: parser,
            stringify: stringify
        };

        self.emit('connection', connection);
    }

    //this.server.listen(opts.port);
    this.wsServer.on('connection', onConnection);

}

util.inherits(EmitServer, EventEmitter);

module.exports = EmitServer;
