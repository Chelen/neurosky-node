'use strict';

angular.module('mindwaveApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'chart.js',
  'ngRoute',
  'toggle-switch',
  'angular-svg-round-progress',
  'timer',
  'ui.bootstrap-slider'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  })
  .factory('socket', function (socketFactory) {
    return socketFactory();
  });
