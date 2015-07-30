'use strict';

/**
 * Module dependencies.
 */

var find = require('lodash.find');
var Emitter = require('component-emitter');
var packet = require('./packet.js');

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
  var message = event.data;

  switch (message.type) {
    case 'connection.request':
      if (find(this.connections, 'clientWindow', event.source)) { return; }

      var newConnection = new NsConnection(this, event.source);
      this.connections.push(newConnection);
      this.emit('connection', newConnection);

      break;
    case 'invoke.request':
      find(this.connections, 'clientWindow', event.source).emit('message', message);
      break;
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
    var handler = this.ns.handlers[message.method];
    var connection = this;

    if (!handler) {
      this.send(
        new packet.InvokeResponse(message.id, null, new packet.UnknowMethodError('method ' + message.method + ' is not found')));

      return;
    }

    var resContext = {
      source: this.clientWindow,
      connection: connection,
      bindAppId: function(appId) { connection.appId = appId; },
      res: function(result) { connection.send(new packet.InvokeResponse(message.id, result)); },
      err: function(result) { connection.send(new packet.InvokeResponse(message.id, null, result)); }
    };

    handler.call(resContext, message.params);
  }
};

/**
 * Module exports.
 */

module.exports = new NsServer();
