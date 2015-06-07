'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl as mainCtrl'
      });
  });