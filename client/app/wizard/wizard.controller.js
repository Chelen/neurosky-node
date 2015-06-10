'use strict';

angular.module('mindwaveApp')
  .controller('WizardCtrl', function (socket) {
    var self = this;

    self.message = 'Hello';
    self.step = 0;

    self.status = 0;

    self.next = function(){
      if (self.step == 3) self.step = 0;
      else self.step++;
    };


    self.startListening = function(){
      socket.emit('startMindwave', "startinnnng!");
    };

    self.stopListening = function(){
      socket.emit('stopMindwave', "stopiiing!");
    };

    socket.on('data', function(data){
      if (data.poorSignalLevel || data.poorSignalLevel === 0) self.status = (200 - data.poorSignalLevel)/2;
    });

  });
