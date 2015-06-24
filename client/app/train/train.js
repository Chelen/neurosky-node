'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/train', {
        templateUrl: 'app/train/train.html',
        controller: 'TrainCtrl as trainCtrl'
      });
  });
