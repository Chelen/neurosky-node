'use strict';

angular.module('mindwaveApp')
  .controller('MainCtrl', function ($http, neuroSocket) {
      var self = this;

      self.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      self.awesomeThings = awesomeThings;
    });

      self.status = 0;


    self.startListening = function(){
      console.log("Start listening called!");
      console.log(neuroSocket);
      neuroSocket.emit('startMindwave', "startinnnng!");


    };

      neuroSocket.on('data', function(data){
        self.status = (200 - data.poorSignalLevel)/2;
      });





  });
