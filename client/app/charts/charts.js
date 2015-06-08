'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/charts', {
        templateUrl: 'app/charts/charts.html',
        controller: 'ChartsCtrl as chartCtrl'
      });
  });
