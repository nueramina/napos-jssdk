'use strict';

var Config = require('./config.js');
var Server = require('./server.js');

angular.module('SimulatorApp', ['ngMaterial'])
  .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('simulator-dark', 'default')
      .dark();
  })
  .controller('AppCtrl', ['$scope', '$mdDialog', '$sce', '$mdMedia', function($scope, $mdDialog, $sce, $mdMedia) {
    $scope.appUrl = $sce.trustAsResourceUrl(Config.get().url);

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