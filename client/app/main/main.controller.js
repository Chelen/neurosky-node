'use strict';

angular.module('mindwaveApp')
  .controller('MainCtrl', function ($http, socket) {
      var self = this;

      self.awesomeThings = [];


    $http.get('/api/things').success(function(awesomeThings) {
      self.awesomeThings = awesomeThings;
    });

  });
