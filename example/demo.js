'use strict';

var crypto = require('crypto');

document.getElementById('initSdk').addEventListener('click', initSdk);
document.getElementById('generateSignature').addEventListener('click', generateSignature);
document.getElementById('getProfile').addEventListener('click', getProfile);
document.getElementById('getAllRestaurants').addEventListener('click', getAllRestaurants);
document.getElementById('getCurrentRestaurant').addEventListener('click', getCurrentRestaurant);
document.getElementById('getStats').addEventListener('click', getStats);
document.getElementById('getRuntime').addEventListener('click', getRuntime);

function initSdk() {
  var checkArr, checkStr, signature;
  var shasum = crypto.createHash('sha1');

  var token = 'b43ac';
  var nonce = randomString(8);
  var timestamp = (new Date()).valueOf().toString();

  checkArr = [token, timestamp, nonce].sort();
  checkStr = checkArr.join('');

  shasum.update(checkStr);
  signature = shasum.digest('hex');

  napos.initialize({
    appId: 'napos_stats_mobile',
    nonce: nonce,
    timestamp: timestamp,
    signature: signature
  }, function(err) {
    if (err) {
      console.log('init err', err);
      return;
    }
    console.log('init success');
  });
}

function generateSignature() {
  napos.generateSignature('napos_stats_mobile', function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('signature generate success', result);
  });
}

function getProfile() {
  napos.getProfile(function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('got profile', result);
  });
}

function getAllRestaurants() {
  napos.getAllRestaurants(function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('got all restaurants', result);
  });
}

function getCurrentRestaurant() {
  napos.getCurrentRestaurant(function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('got current restaurants', result);
  });
}

function getStats() {
  napos.getStats('2015-03-21', function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('got stats', result);
  });
}

function getRuntime() {
  napos.getRuntime(function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('got runtime', result);
  });
}

function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}