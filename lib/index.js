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
  this.authenticated = false;

  this.rpc = new Rpc();
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

Napos.prototype.getRuntime = function(cb) {
  this.rpc.invoke('open.runtime.get', {}, cb);
};

Napos.prototype.setTitle = function(title, cb) {
  this.rpc.invoke('open.title.set', { title: title }, cb);
};

Napos.prototype.getProfile = function(cb) {
  if (!this.authenticated) {
    cb(new Error('unauthenticated'));
    return;
  }

  this.rpc.invoke('open.profile.get', {}, cb);
};

Napos.prototype.getAllRestaurants = function(cb) {
  if (!this.authenticated) {
    cb(new Error('unauthenticated'));
    return;
  }

  this.rpc.invoke('open.restaurant.getAll', {}, cb);
};

Napos.prototype.getCurrentRestaurant = function(cb) {
  if (!this.authenticated) {
    cb(new Error('unauthenticated'));
    return;
  }

  this.rpc.invoke('open.restaurant.getCurrent', {}, cb);
};

Napos.prototype.getStats = function(date, cb) {
  if (!this.authenticated) {
    cb(new Error('unauthenticated'));
    return;
  }

  this.rpc.invoke('open.stats.get', {
    date: date
  }, cb);
};
