'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/barrel', {
        templateUrl: 'app/barrel/barrel.html',
        controller: 'BarrelCtrl as barrelCtrl'
      });
  });
