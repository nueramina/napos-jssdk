'use strict';

var localStorage = global.localStorage;

localStorage.simulator_conf =
  localStorage.simulator_conf ||
  JSON.stringify(require('./fixture.js'));

module.exports = {
  get: function() {
    return JSON.parse(localStorage.simulator_conf);
  },
  set: function(n) {
    localStorage.simulator_conf = JSON.stringify(n);
  }
};