'use strict';

var websocket    = require('websocket-stream');
var EmitIO       = require('emit.io');
var JSONStream   = require('JSONStream');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Client () {

    EventEmitter.call(this);

    this.emitIO = new EmitIO();
    this.parser = JSONStream.parse([true]);
    this.stringify = JSONStream.stringify();
    this.wstream = null;
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function (address) {
    this.address = address;
    this.wstream = websocket(this.address);
    this.inStream = this.wstream.pipe(this.parser);
    this.outStream = this.emitIO(this);

    this.emitIO(this.parser, this);
    this.outStream.pipe(this.stringify).pipe(this.wstream);
};



module.exports = Client;
