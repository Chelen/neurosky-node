/**
 * Main application routes
 */

'use strict';

var neurosky = require('node-neurosky');

module.exports = function(app) {

    var io = require('socket.io')(app);


    var client = neurosky.createClient({
        appName:'NodeNeuroSky',
        appKey:'0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
    });

    client.on('data',function(data){
        console.log(data);
        io.emit('data', data);
    });


    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('startMindwave', function(msg){
            client.connect();
        });

        socket.on('stopMindwave', function(msg){
          client.disconnect();
        });
    });


};
