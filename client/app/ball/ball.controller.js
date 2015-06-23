'use strict';

angular.module('mindwaveApp')
  .controller('BallCtrl', function () {


    var self = this;

    self.intensity = 0;
    var started = false;



    self.createCanvas = function(){

      /**
       * Initialize the Game and starts it.
       */
      self.game = new Game();
        if(self.game.init())
          self.game.start();


    };


    /**
     * Define an object to hold all our images for the game so images
     * are only ever created once. This type of object is known as a
     * singleton.
     */
    var imageRepository = new function() {
      // Define images
      this.ground_bg = new Image();
      this.sky_bg = new Image();
      this.spaceship = new Image();
      this.star = new Image();

      // Ensure all images have loaded before starting the game
      var numImages = 4;
      var numLoaded = 0;
      function imageLoaded() {
        numLoaded++;
        if (numLoaded === numImages) {
          self.bootstrap();
        }
      }
      this.ground_bg.onload = function() {
        imageLoaded();
      };
      this.spaceship.onload = function() {
        imageLoaded();
      };
      this.sky_bg.onload = function() {
        imageLoaded();
      };

      this.star.onload = function() {
        imageLoaded();
      };


      // Set images src
      this.ground_bg.src = "assets/images/ground_bg2.png";
      this.sky_bg.src = "assets/images/sky_bg2.png";
      this.spaceship.src = "assets/images/ball.png";
      this.star.src = "assets/images/star.png";
    };

    /**
     * Creates the Drawable object which will be the base class for
     * all drawable objects in the game. Sets up default variables
     * that all child objects will inherit, as well as the default
     * functions.
     */
    function Drawable() {
      this.init = function(x, y) {
        // Default variables
        this.x = x;
        this.y = y;
      };
      this.speed = 0;
      this.canvasWidth = 0;
      this.canvasHeight = 0;
      // Define abstract function to be implemented in child objects
      this.draw = function() {
      };
    }


    /**
     * Creates the Background object which will become a child of
     * the Drawable object. The background is drawn on the "background"
     * canvas and creates the illusion of moving by panning the image.
     */
    function Background() {
      this.speed = 1; // Redefine speed of the background for panning
      this.drawGround = true;
      // Implement abstract function
      this.draw = function() {
        // Pan background
        this.y += self.intensity;
        if (this.drawGround) this.context.drawImage(imageRepository.ground_bg, this.x, this.y);
        else this.context.drawImage(imageRepository.sky_bg, this.x, this.y);
        // Draw another image at the top edge of the first image
        this.context.drawImage(imageRepository.sky_bg, this.x, this.y - self.bgCanvas.height);
        // If the image scrolled off the screen, reset
        //console.log('image : ' + this.y + ' -  canvas : ' + self.bgCanvas.height);
        if (this.y >= self.bgCanvas.height) {
          this.drawGround = false;
          this.y = 0;
        }
      };
    }
    // Set Background to inherit properties from Drawable
    Background.prototype = new Drawable();



    /**
     * Creates the Game object which will hold all objects and data for
     * the game.
     */
    function Game() {
      /*
       * Gets canvas information and context and sets up all game
       * objects.
       * Returns true if the canvas is supported and false if it
       * is not. This is to stop the animation script from constantly
       * running on older browsers.
       */
      this.init = function() {
        // Get the canvas element
        self.bgCanvas = document.getElementById('bg');
        self.shipCanvas = document.getElementById('game');

        // Test to see if canvas is supported
        if (self.bgCanvas.getContext) {
          this.bgContext = self.bgCanvas.getContext('2d');
          this.shipContext = self.shipCanvas.getContext('2d');

          // Initialize objects to contain their context and canvas
          // information
          Background.prototype.context = this.bgContext;
          Background.prototype.canvasWidth = self.bgCanvas.width;
          Background.prototype.canvasHeight = self.bgCanvas.height;
          Ship.prototype.context = this.shipContext;
          Ship.prototype.canvasWidth = self.shipCanvas.width;
          Ship.prototype.canvasHeight = self.shipCanvas.height;
          // Initialize the background object
          this.background = new Background();
          this.background.init(0,0); // Set draw point to 0,0

          this.ship = new Ship();

          self.ship = this.ship;
          // Set the ship to start near the bottom middle of the canvas
          var shipStartX = self.shipCanvas.width/2 - imageRepository.spaceship.width/2;
          var shipStartY = self.shipCanvas.height/2 + imageRepository.spaceship.height;
          self.posY = shipStartY;
          this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width,
            imageRepository.spaceship.height);

          //self.shipCanvas.getContext('2d').drawImage(imageRepository.spaceship, shipStartX, shipStartY);
          startParticles();

          return true;
        } else {
          return false;
        }
      };
      // Start the animation loop
      this.start = function() {
        resizeCanvas();
        animate();
        started = true;

      };
    }

    window.addEventListener("resize", function() {
      resizeCanvas();
    });


    /**
     * The animation loop. Calls the requestAnimationFrame shim to
     * optimize the game loop and draws all game objects. This
     * function must be a gobal function and cannot be within an
     * object.
     */
    function animate() {
      requestAnimFrame( animate );
      self.game.background.draw();
      self.game.ship.move();
      self.particleShow();

    }
    /**
     * requestAnim shim layer by Paul Irish
     * Finds the first API that works to optimize the animation loop,
     * otherwise defaults to setTimeout().
     */
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
          window.setTimeout(callback, 1000 / 60);
        };
    })();


    function Ship() {
      this.speed = 3;
      this.draw = function () {
        this.context.drawImage(imageRepository.spaceship, this.x, self.posY);
      };
      this.move = function ()

      {
        // Determine if the action is move action
        if (KEY_STATUS.left || KEY_STATUS.right ||
          KEY_STATUS.down || KEY_STATUS.up) {
          // The ship moved, so erase it's current image so it can
          // be redrawn in it's new location
          this.context.clearRect(0, 0, self.bgCanvas.width, self.bgCanvas.height);
          // Update x and y according to the direction to move and
          // redraw the ship. Change the else if's to if statements
          // to have diagonal movement.
          if (KEY_STATUS.up) {
            self.posY -= this.speed;
            if (self.posY < 15) self.posY = 15;
          } else if (KEY_STATUS.down) {
            self.posY += this.speed;
            if (self.posY >= this.canvasHeight - 115)
              self.posY = this.canvasHeight - 115;
          }

        }
        // Finish by redrawing the ship
        this.draw();
      };
    }
    Ship.prototype = new Drawable();



    function resizeCanvas() {
      setTimeout(function() {
        var width = document.getElementById("game-pn").offsetWidth;
        var height = document.getElementById("game-pn").offsetHeight;
        self.bgCanvas.width = width;
        self.bgCanvas.height = height;
        self.bgCanvas.style.width = width + "px";
        self.bgCanvas.style.height = height + "px";
        self.shipCanvas.width = width;
        self.shipCanvas.height = height;
        self.shipCanvas.style.width = width + "px";
        self.shipCanvas.style.height = height + "px";

        self.particleCanvas.width = width;
        self.particleCanvas.height = height;
        self.particleCanvas.style.width = width + "px";
        self.particleCanvas.style.height = height + "px";

        if(started) self.ship.x = self.shipCanvas.width/2 - imageRepository.spaceship.width/2;
        else self.bootstrap();

      }, 0);


      }



    self.bootstrap = function(){
      resizeCanvas();

      self.bgCanvas = document.getElementById('bg');
      self.shipCanvas = document.getElementById('game');
      self.particleCanvas = document.getElementById('particles');

      var srtx = self.shipCanvas.width/2 - imageRepository.spaceship.width/2;
      var srty = self.shipCanvas.height/2 + imageRepository.spaceship.height;



      self.bgCanvas.getContext('2d').drawImage(imageRepository.ground_bg, 0, 0);
      self.shipCanvas.getContext('2d').drawImage(imageRepository.spaceship, srtx, srty);

      };




    // The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
    var KEY_CODES = {
      38: 'up',
      40: 'down'
    };
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
    var KEY_STATUS = {};
    for (var code in KEY_CODES) {
      KEY_STATUS[ KEY_CODES[ code ]] = false;
    }
    /**
     * Sets up the document to listen to onkeydown events (fired when
     * any key on the keyboard is pressed down). When a key is pressed,
     * it sets the appropriate direction to true to let us know which
     * key it was.
     */
    document.onkeydown = function(e) {
      // Firefox and opera use charCode instead of keyCode to
      // return which key was pressed.
      var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
      if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
      }
    };
    /**
     * Sets up the document to listen to ownkeyup events (fired when
     * any key on the keyboard is released). When a key is released,
     * it sets teh appropriate direction to false to let us know which
     * key it was.
     */
    document.onkeyup = function(e) {
      var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
      if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
      }
    };





    /*
     Example 5: Generating a load of random particles (with gravity)
     */
    var startParticles = function() {


      // Initialise an empty canvas and place it on the page
      var particleCtx = self.particleCanvas.getContext("2d");


      // Inital starting position
      var posX = 20,
        posY = self.particleCanvas.height / 2;

      // No longer setting velocites as they will be random
      // Set up object to contain particles and set some default values
      var particles = {},
        particleIndex = 0,
        settings = {
          density: 20,
          particleSize: 5,
          startingX: self.particleCanvas.width / 2,
          startingY: self.posY,
          gravity: 0.4
        };

      // Set up a function to create multiple particles
      function Particle() {
        // Establish starting positions and velocities
        this.x = settings.startingX-16;
        this.y = self.posY+100;

        // Determine original X-axis speed based on setting limitation
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() ;

        // Add new particle to the index
        // Object used as it's simpler to manage that an array
        particleIndex ++;
        particles[particleIndex] = this;
        this.id = particleIndex;
        this.life = 0;
        this.maxLife = 100;
      }

      // Some prototype methods for the particle's "draw" function
      Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;

        // Adjust for gravity
        this.vy += settings.gravity;

        // Age the particle
        this.life++;

        // If Particle is old, it goes in the chamber for renewal
        if (this.life >= this.maxLife) {
          delete particles[this.id];
        }

        particleCtx.drawImage(imageRepository.star, this.x,this.y);
        // Create the shapes
        //particleCtx.clearRect(settings.leftWall, settings.groundLevel, self.particleCanvas.width, self.particleCanvas.height);
        //particleCtx.beginPath();
        //particleCtx.fillStyle="#ffffff";
        //// Draws a circle of radius 20 at the coordinates 100,100 on the canvas
        //particleCtx.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true);
        //particleCtx.closePath();
        //particleCtx.fill();

      };

      self.particleShow = function() {
        //particleCtx.fillStyle = "rgba(10,10,10,0.8)";
        particleCtx.clearRect(0, 0, self.particleCanvas.width, self.particleCanvas.height);

        // Draw the particles
        for (var i = 0; i < 18; i++) {
          if (Math.random() > 0.97) {
            // Introducing a random chance of creating a particle
            // corresponding to an chance of 1 per second,
            // per "density" value
            new Particle();
          }
        }

        for (var i in particles) {
          particles[i].draw();
        }
      };

    }


  });
