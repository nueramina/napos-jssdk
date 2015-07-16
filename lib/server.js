'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var Emitter = require('component-emitter');

/**
 * Napos JSSDK Server Constructor
 */

function NsServer() {
  this.handlers = {};
  this.connections = [];

  global.addEventListener('message', this.onMessage.bind(this), false);
}

/**
 * Mix in `Emitter`.
 */

Emitter(NsServer.prototype);

/**
 * [onMessage description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */

NsServer.prototype.onMessage = function(event) {
  console.log('event', event);
  var message = event.data;

  if (message === 'new connection') {
    for (var i = 0; i < this.connections.length; i++) {
      if (this.connections[i].clientWindow === event.source) { return; }
    }
    var connection = new NsConnection(this, event.source);

    this.connections.push(connection);
    this.emit('connection', connection);
  } else {
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].emit('message', message);
    }
  }
};

/**
 * [registerHandler description]
 * @param  {[type]} method  [description]
 * @param  {[type]} handler
 * handler sig
 * function(resolve, reject) {}
 *
 * @return {[type]}         [description]
 */
NsServer.prototype.registerHandler = function(method, handler) {
  this.handlers[method] = handler;
};

function NsConnection(ns, clientWindow) {
  this.ns = ns;
  this.clientWindow = clientWindow;
  this.handlers = {};
  this.on('message', this.onMessage.bind(this));
}

/**
 * Mix in `Emitter`.
 */

Emitter(NsConnection.prototype);

NsConnection.prototype.send = function(message) {
  this.clientWindow.postMessage(message, '*');
};

NsConnection.prototype.onMessage = function(message) {
  if (message.type === 'invoke.request') {
    var handler = this.handlers[message.method];
    var connection = this;

    if (!handler) {
      this.send(new InvokeResponse(message.id, null, {
        type: 'FATAL',
        code: 'UNKOWN_METHOD',
        verbose: null,
        message: '无法找到该方法'
      }));
      return;
    }

    var resContext = {
      res: function(result) { connection.send(new InvokeResponse(message.id, result)); },
      err: function(result) { connection.send(new InvokeResponse(message.id, null, result)); }
    };

    handler.call(resContext, message.params);
  }
};

NsConnection.prototype.registerHandler = function(method, handler) {
  this.handlers[method] = handler;
};

/**
 * Module exports.
 */

module.exports = new NsServer();

/**
 * InvokeResponse constructor
 *
 * @constructor
 */

function InvokeResponse(id, result, error) {
  this.id = id;
  this.type = 'invoke.response';
  this.result = result;
  this.error = error || null;
}

/**
 * Serialize Handler
 * @api privite
 */

InvokeResponse.prototype.toString = function() {
  return JSON.stringify(this);
};