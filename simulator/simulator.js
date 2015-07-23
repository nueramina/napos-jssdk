'use strict';

var ns = require('../lib/server.js');
var localStorage = global.localStorage;

localStorage.simulator_conf =
  localStorage.simulator_conf ||
  JSON.stringify({ url: '/demo.html', token: '123456' });

var Config = {
  get: function() {
    return JSON.parse(localStorage.simulator_conf);
  },
  set: function(n) {
    localStorage.simulator_conf = JSON.stringify(n);
  }
};

ns.on('connection', function(connection) {
  console.log('new connection');
});

ns.registerHandler('signature.generate', function() {
  setTimeout(function() {
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
    this.res(Config.get().restaurant);
  }.bind(this), 10);
});

angular.module('SimulatorApp', ['ngMaterial'])
  .controller('AppCtrl', ['$scope', '$mdDialog', '$sce', function($scope, $mdDialog, $sce) {
    $scope.appUrl = Config.get().url;

    $scope.openCtrlDialog = function(ev) {
      $mdDialog.show({
        controller: 'CtrlDialogCtrl',
        templateUrl: 'ctrl-dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
      })
      .then(function(conf) {
        Config.set(conf);
        $scope.appUrl = $sce.trustAsResourceUrl(Config.get().url);
      });
    };
  }])
  .controller('CtrlDialogCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {
    $scope.conf = Config.get();

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.confirm = function(conf) {
      $mdDialog.hide(conf);
    };
  }]);