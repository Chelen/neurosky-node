/**
 * Main application routes
 */

'use strict';

var neurosky = require('node-neurosky');

module.exports = function(app) {

    var io = require('socket.io')(app);
    var connected = false;
    var started = false;
    var profile = {};
    var profiles = {
      Neurosky : {name : 'Neurosky'}
    };


    var client = neurosky.createClient({
        appName:'NodeNeuroSky',
        appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
    });

    client.on('data',function(data){
        console.log(data);
        if (connected) {
          if (profile.getAttention && data.eSense) {
            var customAtt = profile.getAttention(data.eSense.attention, profile.getR(data.eegPower), getProfileR(true), getProfileR(false));
            console.log(customAtt);
            data.eSense.customAttention = customAtt;
          }
          io.emit('data', data);
        }
    });


    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('startMindwave', function(msg){
          if (!started) client.connect();
          connected = true;
          started = true;
        });

        socket.on('stopMindwave', function(msg){
          //client.close();
          //client.disconnect();
          // TODO : FIND A WAY TO REALLY DISCONNECT
          connected = false;
        });

      socket.on('profile', function(msg){
          console.log(msg);
          profile = msg;
          profiles[profile.name] = profile;
          //profile.pond = profile.pond == 0 ? 0 : 100/profile.pond;
          profile.getR = function(eeg){
            if (profile.defaultR){
              return (Math.log(eeg.lowAlpha) + Math.log(eeg.highAlpha)) / (Math.log(eeg.lowBeta) + Math.log(eeg.highBeta));
            } else {
              return (Math.log(eeg.lowAlpha) / Math.log(eeg.highBeta));
            }
          };

          profile.getAttention = function (att, r, r1, r2 ){
            var p = profile.pond == 0 ? 0 : 100/profile.pond;
            var aux = Math.round(p * att + (1 - p) * (((r - r1) / (r2 - r1)) * (85 - 55) + 55));
            return aux > 97 ? 100 : aux < 3 ? 0 : aux;
          }
        });

      socket.on('noProfile', function(msg){
        profile = {};
      });
      socket.on('getProfiles', function(msg){
        io.emit('profiles', profiles);
      });
    });

  function getProfileR(isR1) {
    if (isR1){
      return profile.defaultR ? profile.neutral.r : profile.neutral.cR;
    } else {
      return profile.defaultR ? profile.attention.r : profile.attention.cR;

    }

  }


};
