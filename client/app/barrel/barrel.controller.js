'use strict';

angular.module('mindwaveApp')
  .controller('BarrelCtrl', function ($scope) {

    var self = this;

    self.intensity = 0;


    self.createCanvas = function(){

      var img  = new Image();
      img.src = "assets/images/barrel.png";

      img.onload = function(){
        self.obj = createParticles(img, 100, 100);
        var parent = document.getElementById('barrel-container');
        parent.appendChild(self.obj);

      };

      self.init();

      self.startTimer();

    };


    function createParticles(imgObj,left,top){

      var elem = document.createElement("div");
      var particles = new Array();
      for(var n = 0; n < 13; n++) {
        for(var i = 0; i < 18; i++) {
          var imgX = n * 20;
          var imgY = i * 20;
          particles.push({
            x: imgX,
            y: imgY,
            imgX: imgX,
            imgY: imgY,
            vx: 0,
            vy: 0,
            isRolling: false,
            isLocked: true
          });
        }
      }

      // console.log(particles);
      //elem.id = $this.id;
      elem.style.width = 250+"px";
      elem.style.height = 250+"px";
      elem.style.position = "absolute";
      elem.style.left = "50%";
      elem.style.marginLeft = "-125px";
      elem.style.top  = top+"px";

      var canvas;
      var context;
      for(var n = 0; n < particles.length; n++) {

        var particle = particles[n];

        canvas = document.createElement("canvas");
        canvas.width = 50;
        canvas.height = 50;
        canvas.style.left = particle.x+"px";
        canvas.style.top = particle.y+"px";
        canvas.style.position = 'absolute';
        context = canvas.getContext("2d");


        context.drawImage(imgObj, particle.imgX, particle.imgY, 20, 20, 0, 0, 20, 20);

        elem.appendChild(canvas);

      }

      return elem;

    }


    self.explode = function(){


      var childrenNum = self.obj.children;

      for(var i = 0; i < childrenNum.length; i++) {

        var item = childrenNum[i];
        var randX = getRandom(  300 , -300 );
        var randY = getRandom(  300 , -300 );


        var tmax = TweenMax.to(item, 1.0, {
          left:randX,
          top:randY,
          autoAlpha:0,
          ease:Power0.easeInOut

        });

      }

      self.intensity = 0;
      self.stopTimer();


    };

    function getRandom(max, min){
      return Math.floor(Math.random() * (1 + max - min) + min);
    }

    $scope.$on('$routeChangeStart', function(route) {
      //TODO clear interval on navidation
      console.log('navigation changed !');
      clearInterval(self.timerID);
    });



    self.reset = function(){




      self.obj.empty().remove();
      var parent = document.getElementById('barrel-container');
      parent.children("div").remove();


      self.createCanvas();

    };



    var canvas;
    var stage;
    var width = 650;
    var height = 400;
    var particles = [];
    var max = 60;
    var mouseX=0;
    var mouseY=0;

    var speed=8;
    var size=20;

//The class we will use to store particles. It includes x and y
//coordinates, horizontal and vertical speed, and how long it's
//been "alive" for.
    function Particle(x, y, xs, ys) {
      this.x=x;
      this.y=y;
      this.xs=xs;
      this.ys=ys;
      this.life=0;
    }

    function resizeCanvas() {
      setTimeout(function() {
        width = document.getElementById("game-pn").offsetWidth;
        height = document.getElementById("game-pn").offsetHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        mouseX=canvas.width/2;
        mouseY=canvas.height*0.8;
        stage.globalCompositeOperation="lighter"
      }, 0);
    }

    self.init = function init() {

      //Reference to the HTML element
      canvas=document.getElementById("game");

      resizeCanvas();

      //See if the browser supports canvas
      if (canvas.getContext) {

        //Get the canvas context to draw onto
        stage = canvas.getContext("2d");

        //Makes the colors add onto each other, producing
        //that nice white in the middle of the fire
        stage.globalCompositeOperation="xor";

        //Update the mouse position
        //canvas.addEventListener("mousemove", getMousePos);

        window.addEventListener("resize", function() {
          resizeCanvas();
          stage.globalCompositeOperation="lighter";
          mouseX=canvas.width/2;
          mouseY=canvas.height*0.8;
        });

        //Update the particles every frame
        self.timerID=setInterval(update,40);

      } else {
        alert("Canvas not supported.");
      }
    };

    self.startTimer = function (){
      $scope.$broadcast('timer-start');
      //$scope.timerRunning = true;
    };

    self.stopTimer = function (){
      $scope.$broadcast('timer-stop');
      //$scope.timerRunning = false;
    };

    $scope.$on('timer-stopped', function (event, data){
      console.log('Timer Stopped - data = ', data);
    });

    function getMousePos (evt) {
      var rect = canvas.getBoundingClientRect();
      var root = document.documentElement;

      // return mouse position relative to the canvas
      mouseX = evt.clientX - rect.left - root.scrollLeft;
      mouseY = evt.clientY - rect.top - root.scrollTop;
    }

    function update() {

      speed = self.intensity * 0.065;


      //Adds ten new particles every frame
      for (var i=0; i<self.intensity*0.15; i++) {

        //Adds a particle at the mouse position, with random horizontal and vertical speeds
        var p = new Particle(getRandom(mouseX+80,mouseX-80), mouseY, (Math.random()*2*speed-speed)/2, 0-Math.random()*2*speed);
        particles.push(p);
      }

      //Clear the stage so we can draw the new frame
      stage.clearRect(0, 0, width, height);

      //Cycle through all the particles to draw them
      for (i=0; i<particles.length; i++) {

        //Set the file colour to an RGBA value where it starts off red-orange, but progressively gets more grey and transparent the longer the particle has been alive for
        stage.fillStyle = "rgba("+(260-(particles[i].life*2))+","+((particles[i].life*2)+50)+","+(particles[i].life*2)+","+(((max-particles[i].life)/max)*0.4)+")";

        stage.beginPath();
        //Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
        stage.arc(particles[i].x,particles[i].y,(max-particles[i].life)/max*(size/2)+(size/2),0,2*Math.PI);
        stage.fill();

        //Move the particle based on its horizontal and vertical speeds
        particles[i].x+=particles[i].xs;
        particles[i].y+=particles[i].ys;

        particles[i].life++;
        //If the particle has lived longer than we are allowing, remove it from the array.
        if (particles[i].life >= max) {
          particles.splice(i, 1);
          i--;
        }
      }
    }




  });
