'use strict';

angular.module('mindwaveApp')
  .controller('WizardCtrl', function (socket) {
    var self = this;

    self.message = 'Hello';
    self.step = 0;

    self.color = "#45ccce";
    self.blink = false;

    self.status = 0;
    self.connectStatus = false;

    self.next = function(){
      if (self.step == 3) self.step = 0;
      else self.step++;
    };

    self.toggleConnection = function() {
      var msg = self.connectStatus ? 'startMindwave' : 'stopMindwave';
      socket.emit(msg, "Changing status!");

    };

    self.changeColor = function(){
      self.color = '#d06162';
      //: '#45ccce';
    };




    self.startListening = function(){
      //socket.emit('startMindwave', "startinnnng!");
      console.log("Im on !");
    };

    self.stopListening = function(){
      //socket.emit('stopMindwave', "stopiiing!");
      console.log("Im off !");
    };

    socket.on('data', function(data){
      if (data.poorSignalLevel || data.poorSignalLevel === 0) self.status = (200 - data.poorSignalLevel)/2;
    });

  });
