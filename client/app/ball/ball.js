'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/ball', {
        templateUrl: 'app/ball/ball.html',
        controller: 'BallCtrl as ballCtrl'
      });
  });
