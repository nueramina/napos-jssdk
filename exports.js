'use strict';

if (global.napos !== undefined) {
  return;
}

var lib = require('./lib');

global.napos = lib;