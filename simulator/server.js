'use strict';

var ns = require('../lib/server.js');
var Config = require('./config.js');

ns.on('connection', function(connection) {
  console.log('new connection');
});

ns.registerHandler('$.signature.generate', function(params) {
  setTimeout(function() {
    this.bindAppId(params.appId);
    this.res(Config.get().token);
  }.bind(this), 10);
});

ns.registerHandler('profile.get', function() {
  setTimeout(function() {
    this.res(Config.get().profile);
  }.bind(this), 10);
});

ns.registerHandler('restaurant.get', function() {
  setTimeout(function() {
    var r = Config.get().restaurant;
    r.phones = r.phones.split(',');
    this.res(r);
  }.bind(this), 10);
});

ns.registerHandler('restaurant.getAll', function() {
  setTimeout(function() {
    var r = Config.get().allRestaurants.split(',');
    this.res(r);
  }.bind(this), 10);
});

ns.registerHandler('view.goForward', function(params) {
  this.res(window.location.href = params.url);
  this.res(true);
});

ns.registerHandler('view.goBack', function(params) {
  window.history.back();
  this.res(true);
});

ns.registerHandler('view.getTitle', function(params) {
  this.res(window.document.title);
});

ns.registerHandler('view.setTitle', function(params) {
  window.document.title = params.title;
  this.res(true);
});
