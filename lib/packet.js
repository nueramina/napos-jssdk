/**
 * Module dependencies.
 */

var uuid = require('node-uuid');

/**
 * Module exports.
 */

exports.InvokeRequest = InvokeRequest;
exports.Message = Message;
exports.ConnectionError = ConnectionError;
exports.RuntimeError = RuntimeError;

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
 * Set response of the invoke
 * @api public
 */

InvokeRequest.prototype.onResponse = function(result) {
  this.response = new InvokeResponse(this.id, result);
};

/**
 * InvokeResponse constructor
 *
 * @constructor
 */

function InvokeResponse(id, result) {
  this.id = id;
  this.type = 'invoke.response';
  this.result = result;
}

/**
 * Serialize Handler
 * @api privite
 */

InvokeResponse.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * Message constructor
 *
 * @constructor
 */

function Message(pipe, name, data) {
  this.id = uuid.v4();
  this.type = 'message';
  this.pipe = pipe;
  this.name = name;
  this.data = data;
}

/**
 * Serialize Handler
 * @api privite
 */

Message.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * ConnectionError constructor
 *
 * @constructor
 */

function ConnectionError(id, err) {
  this.id = id;
  this.type = 'invoke.response';
  this.error = {
    type: 'COMMON',
    code: 'CONNECTION_ERROR',
    verbose: err,
    message: '网络异常。'
  };
  this.result = null;
}

/**
 * Serialize Handler
 * @api privite
 */

ConnectionError.prototype.toString = function() {
  return JSON.stringify(this);
};

/**
 * RuntimeError constructor
 *
 * @constructor
 */

function RuntimeError(id, err) {
  this.id = id;
  this.type = 'invoke.response';
  this.error = {
    type: 'COMMON',
    code: 'RUNTIME_ERROR',
    verbose: err,
    message: '执行环境异常。'
  };
  this.result = null;
}

/**
 * Serialize Handler
 * @api privite
 */

RuntimeError.prototype.toString = function() {
  return JSON.stringify(this);
};