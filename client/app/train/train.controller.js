'use strict';

angular.module('mindwaveApp')
  .controller('TrainCtrl', function (socket) {

    var self = this;

    self.profile = {};
    self.session = 'neutral';
    self.step = 0;


    self.clear = function(){
      self.highAlphaValues = [];
      self.lowAlphaValues = [];
      self.highBetaValues = [];
      self.lowBetaValues = [];
      self.attention = [];
      self.logHAlpha = [];
      self.logLAlpha = [];
      self.logHBeta = [];
      self.logLBeta = [];
      self.totalLogA = [];
      self.totalLogB = [];
      self.totalR = [];
      self.customR = [];
      self.recording = false;
      self.recordingCount = 0;
    };

    self.att = 0;
    self.customAtt = 0;


    socket.on('data', function(data) {
      if (self.recording && self.recordingCount < 15 && data.eegPower) {
        self.highAlphaValues.push(data.eegPower["highAlpha"]);
        self.lowAlphaValues.push(data.eegPower["lowAlpha"]);
        self.highBetaValues.push(data.eegPower["highBeta"]);
        self.lowBetaValues.push(data.eegPower["lowBeta"]);
        self.attention.push(data.eSense.attention);
        self.recordingCount ++;
        if (self.recordingCount === 15 ) {
          self.recording = false;
          self.recordingCount = 0;
          self.normalize();
          setProfileData();
          self.clear();
          self.setStep(self.step+1);
        }
      }

      if (self.step == 3 && data.eSense){
        self.att = data.eSense.attention;
        self.customAtt = data.eSense.customAttention;

      }


    });

    self.setStep = function(s){
      self.step = s;
      if (self.step == 1) self.session = 'neutral';
      if (self.step == 2) self.session = 'attention';

    };

    self.start = function(){
      self.recording = true;
    };

    function setProfileData() {
      self.profile[self.session] = {
        r  : self.rAvg,
        cR : self.cRAvg
      };

    }

    self.saveProfile = function(){
      socket.emit('profile', self.profile);
    };


    self.normalize = function(){
      self.highAlphaValues.map( function(v) {
          self.logHAlpha.push(Math.log(v));
      });
      self.lowAlphaValues.map( function(v) {
        self.logLAlpha.push(Math.log(v));
      });
      self.highBetaValues.map( function(v) {
        self.logHBeta.push(Math.log(v));
      });
      self.lowBetaValues.map( function(v) {
        self.logLBeta.push(Math.log(v));
      });

      self.logHAlpha.map(function (num, idx) {
        self.totalLogA.push(num + self.logLAlpha[idx]);
      });

      self.logHBeta.map(function (num, idx) {
        self.totalLogB.push(num + self.logLBeta[idx]);
      });

      self.totalLogA.map(function (num, idx) {
        self.totalR.push(num / self.totalLogB[idx]);
      });

      self.logHBeta.map(function (num, idx) {
        self.customR.push(num / self.logLAlpha[idx]);
      });

      self.cRAvg = self.totalR.reduce(function(sum, a,i,ar) { sum += a;  return i==ar.length-1?(ar.length==0?0:sum/ar.length):sum},0);
      self.rAvg = self.customR.reduce(function(sum, a,i,ar) { sum += a;  return i==ar.length-1?(ar.length==0?0:sum/ar.length):sum},0);

    };

    self.clear();

  });
