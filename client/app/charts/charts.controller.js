'use strict';

angular.module('mindwaveApp')
  .controller('ChartsCtrl', function (socket) {

    var self = this;

    self.message = 'Hello';

    self.eegLabels =["Delta", "Theta", "Low Alpha", "High Alpha",
      "Low Beta", "High Beta", "Low Gamma", "High Gamma"];

    self.eegValues = [[65, 59, 90, 81, 56, 55, 40, 60]];

    self.blink = false;

    self.attention  = [[0,0,0,0,0,0,0,0]];
    self.meditation = [[0,0,0,0,0,0,0,0]];

    self.lineChartLabels = ["","","","","","","",""];

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

      if (data.eSense) {
        self.attention[0].shift();
        self.meditation[0].shift();
        self.attention[0].push(data.eSense.attention);
        self.meditation[0].push(data.eSense.meditation);
      }

      self.blink = !!data.blinkStrength;
    });



  });
