'use strict';

angular.module('mindwaveApp')
  .controller('MainCtrl', function ($http, socket) {
      var self = this;

      self.awesomeThings = [];

      self.eegLabels =["Delta", "Theta", "Low Alpha", "High Alpha",
        "Low Beta", "High Beta", "Low Gamma", "High Gamma"];

      self.eegValues = [
        [65, 59, 90, 81, 56, 55, 40, 60]
      ];

    $http.get('/api/things').success(function(awesomeThings) {
      self.awesomeThings = awesomeThings;
    });

      self.status = 0;


    self.startListening = function(){
      socket.emit('startMindwave', "startinnnng!");
    };

    self.stopListening = function(){
      socket.emit('stopMindwave', "stopiiing!");
    };

    self.count = 0;

      socket.on('data', function(data){
        if (data.poorSignalLevel || data.poorSignalLevel === 0) self.status = (200 - data.poorSignalLevel)/2;
        if (data.eegPower){
          self.eegValues = [];
            self.eegValues = [
              [data.eegPower["delta"], data.eegPower["theta"], data.eegPower["lowAlpha"],
                data.eegPower["highAlpha"], data.eegPower["lowBeta"], data.eegPower["highBeta"],
                data.eegPower["lowGamma"], data.eegPower["highGamma"]]
            ];
          }
      });



  });
