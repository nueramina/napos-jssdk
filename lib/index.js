'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var Emitter = require('component-emitter');
var Rpc = require('./rpc.js');

/**
 * Module exports.
 */

module.exports = new Napos();

/**
 * Napos JSSDK Constructor
 */

function Napos() {
  this.initialized = false;
  this.authenticated = true;

  this.rpc = new Rpc();
  this.rpc.connect();
}

/**
 * Mix in `Emitter`.
 */

Emitter(Napos.prototype);

Napos.prototype.generateSignature = function(appId, cb) {
  if (!this.authenticated) {
    cb(new Error('unauthenticated'));
    return;
  }

  this.rpc.invoke('open.signature.generate', { appId: appId }, cb);
};

Napos.prototype.initialize = function(opts, cb) {
  opts = opts || {};

  if (window.top === window) {
    cb(new Error('runtime error'));
    return;
  }

  if (this.initialized) {
    cb(new Error('already initialized'));
    return;
  }

  if ( opts.appId === undefined ||
    opts.nonce === undefined ||
    opts.timestamp === undefined ||
    opts.signature === undefined ) {

    cb(new Error('init opts not correct'));
    return;
  }

  this.appId = opts.appId;
  this.nonce = opts.nonce;
  this.timestamp = opts.timestamp;
  this.signature = opts.signature;

  this.open(cb);
};

Napos.prototype.open = function(cb) {
  var self = this;

  this.rpc.invoke('open.signature.verify', {
    appId: this.appId,
    nonce: this.nonce,
    timestamp: this.timestamp,
    signature: this.signature
  }, function(err) {
    if (err) {
      cb(err);
      return;
    }

    self.initialized = true;
    self.authenticated = true;
    cb();
  });
};
