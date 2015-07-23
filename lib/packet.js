/**
 * Module dependencies.
 */

var uuid = require('node-uuid');

/**
 * Module exports.
 */

exports.InvokeRequest = InvokeRequest;
exports.InvokeResponse = InvokeResponse;
exports.UnknowMethodError = UnknowMethodError;
exports.InitializeError = InitializeError;

/**
 * InvokeRequest constructor
 *
 * @constructor
 */

function InvokeRequest(method, params) {
  this.id = uuid.v4();
  this.type = 'invoke.request';
  this.method = method;
  this.params = params || {};
}

/**
 * Serialize Handler
 * @api privite
 */

InvokeRequest.prototype.toString = function() {
  return JSON.stringify(this);
};

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
 * InitializeError constructor
 *
 * @constructor
 */

function InitializeError(err) {
  this.type = 'COMMON';
  this.code = 'INITIALIZE_ERROR';
  this.verbose = null;
  this.message = err;
}

/**
 * Serialize Handler
 * @api privite
 */

InitializeError.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * UnknowMethodError constructor
 *
 * @constructor
 */

function UnknowMethodError(err) {
  this.type = 'FATAL';
  this.code = 'UNKOWN_METHOD';
  this.verbose = null;
  this.message = err;
}

/**
 * Serialize Handler
 * @api privite
 */

UnknowMethodError.prototype.toString = function() {
  return JSON.stringify(this);
};