'use strict';

angular.module('mindwaveApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/wizard', {
        templateUrl: 'app/wizard/wizard.html',
        controller: 'WizardCtrl as wizardCtrl'
      });
  });
