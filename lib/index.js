'use strict';

/**
 * Module dependencies.
 */

var Emitter = require('component-emitter');
var Rpc = require('./rpc.js');
var packet = require('./packet.js');
var server = require('./server.js');

/**
 * Module exports.
 */

module.exports = new Napos();

/**
 * Napos JSSDK Constructor
 */

function Napos() {
  this.initializeState = 'uninitialized';

  this.server = server;
  this.rpc = new Rpc();
  this.rpc.connect();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Napos.prototype);

Napos.prototype.initialize = function(cb) {

  if (window.parent === window) {
    cb(new packet.InitializeError('runtime environment not match'));
    return;
  }

  if (this.initializeState === 'initializing') {
    cb(new packet.InitializeError('sdk is initializing'));
    return;
  }

  if (this.initializeState === 'initialized') {
    cb(new packet.InitializeError('sdk is already initialized'));
    return;
  }

  this.open(cb);
};

Napos.prototype.open = function(cb) {
  var self = this;

  this.initializeState = 'initializing'
  this.rpc.invoke('signature.generate', {}, function(err, token) {
    if (err) {
      cb(err);
      return;
    }

    self.initializeState = 'initialized'
    cb(null, token);
  });
};
