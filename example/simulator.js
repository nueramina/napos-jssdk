var crypto = require('crypto');
var _ = require('lodash');
var debug = require('debug')('simulator');
var fixture = {};
var $confirmBtn = $('#confirm');
var $embedIFrame = $('#embed');

$(document).ready(function() {
  $('select').material_select();

  $confirmBtn.click(confirm.bind(null, true));
  window.addEventListener('message', onMessage, false);
  confirm();
});

function confirm(isReload) {
  fixture.token = $('#token').val();
  fixture.appId = $('#appId').val();
  fixture.embedUrl = $('#embedUrl').val();

  fixture.runtime = $('#runtime').val();
  fixture.profile = JSON.parse($('#profile').val());
  fixture.allRestaurants = JSON.parse($('#allRestaurants').val());
  fixture.stats = JSON.parse($('#stats').val());
  fixture.currentRestaurant = _.findWhere(fixture.allRestaurants, { oid: $('#currentRestaurantId').val() }) || null;

  debug('fixture', fixture);

  isReload && (document.getElementById('embed').src = fixture.embedUrl);
}

function send(message) {
  document.getElementById('embed').contentWindow.postMessage(message, '*');
}

function onMessage(event) {
  var invokeResponsePacket = event.data;
  var result = {};

  switch (invokeResponsePacket.method) {
    case 'open.signature.generate':
      var checkArr;
      var shasum = crypto.createHash('sha1');

      result.nonce = randomString(8);
      result.timestamp = (new Date()).valueOf().toString();

      checkArr = [fixture.token, result.timestamp, result.nonce].sort();
      checkStr = checkArr.join('');

      shasum.update(checkStr);
      result.signature = shasum.digest('hex');

      send(new InvokeResponse(invokeResponsePacket.id, result));
      break;

    case 'open.signature.verify':
      var params = invokeResponsePacket.params;
      var checkArr, signature;
      var shasum = crypto.createHash('sha1');

      checkArr = [fixture.token, params.timestamp, params.nonce].sort();
      checkStr = checkArr.join('');

      shasum.update(checkStr);
      signature = shasum.digest('hex');

      if (signature === params.signature) {
        send(new InvokeResponse(invokeResponsePacket.id, null));
      } else {
        send(new InvokeResponse(invokeResponsePacket.id, null, {
          type: 'COMMON',
          code: 'SIGNATURE_NOT_MATCH',
          verbose: '',
          message: 'signature not match'
        }));
      }
      break;

    case 'open.runtime.get':
      send(new InvokeResponse(invokeResponsePacket.id, fixture.runtime));
      break;

    case 'open.profile.get':
      send(new InvokeResponse(invokeResponsePacket.id, fixture.profile));
      break;

    case 'open.restaurant.getAll':
      send(new InvokeResponse(invokeResponsePacket.id, fixture.allRestaurants));
      break;

    case 'open.restaurant.getCurrent':
      send(new InvokeResponse(invokeResponsePacket.id, fixture.currentRestaurant));
      break;

    case 'open.stats.get':
      send(new InvokeResponse(invokeResponsePacket.id, fixture.stats));
      break;

    case 'open.time.get':
      send(new InvokeResponse(invokeResponsePacket.id, (new Date()).valueOf()));
      break;

    default:
      // do nothing
      break;
  }

  debug('invoke received', invokeResponsePacket.method, invokeResponsePacket.params);
}

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

function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
