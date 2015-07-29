angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('AjaxTest', function($scope,$http) {
      $scope.err='';
      $scope.call = function () {
          $scope.articles = [];

        $http({
          method: 'GET',
          url: 'https://handbook-entry.herokuapp.com/articles?main_category=Academics'
        }).success(function (data,status) {
          $scope.articles = data;
          console.log(data);
            console.log(status);
        }).error(function(err,status){
          $scope.err="error";
          console.log(err);
        });
      }
    })
    .controller('Pong',function($scope){
      var WIDTH = 700, HEIGHT = 600, pi = Math.PI;
      var UpArrow = 38, DownArrow = 40,LeftArrow = 37,RightArrow = 39;
      var Spacebar = 32;
      var canvas, ctx, keystate;
      var player, ai, ball;
      var serve = 1;
      var win = 0;
      var lose = 0;
      var mouseX;
      keystate = {};

      player = {
        x : null,
        y : null,
        width : 100,
        height : 20,
        update : function(){
          if(this.x!=(mouseX-this.width/2)){
            if((mouseX-this.width/2)>this.x  && this.x +this.width<WIDTH){
              this.x += 7;
            }
            else if((mouseX-this.width/2)<this.x && this.x>0){
              this.x -=7;
            }
          }
          if(keystate[LeftArrow]){
            if(this.x>0)
              this.x -= 7;
          }
          if(keystate[RightArrow]){
            if(this.x+this.width<WIDTH)
              this.x += 7;
          }

        },
        draw : function(){ ctx.fillRect(this.x,this.y,this.width,this.height)}
      };
      ai = {
        x : null,
        y : null,
        width : 100,
        height : 20,
        update : function(){
          if(serve!=1) {
            var dest = ball.x - (this.width - ball.side) * 0.5;
            var aix =this.x + (dest - this.x) * 0.12;
            if(this.x+this.width>WIDTH)
              aix = WIDTH - this.width;
            if(this.x<0)
              aix = 0;
            this.x = aix;
          }
        },
        draw : function(){ ctx.fillRect(this.x,this.y,this.width,this.height)}
      };
      ball = {
        x : null,
        y : null,
        vel: null,
        speed :-10,
        side : 20,
        update : function(){
          if(serve ==1){

            reset();
            if(keystate[Spacebar]) {
              serve = 0;

              ball.vel = {
                x: 0,
                y: ball.speed
              }

            }
          }
          else{
            console.log('stuff');
            this.x += this.vel.x;
            this.y += this.vel.y;
            if(this.x < 0||this.x+this.side>WIDTH){
              var offset = this.vel.x < 0 ? 0 - this.x : WIDTH - (this.x + this.side);
              this.x += 2*offset;
              this.vel.x *= -1;
            }
            var collision = function(ax,ay,aw,ah,bx,by,bw,bh){
              return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
            };
            var paddle = this.vel.y > 0 ? player : ai;
            if(collision(paddle.x,paddle.y,paddle.width,paddle.height,this.x,this.y,this.side,this.side))
            {

              //normalized y value
              this.y = paddle === player ? player.y - player.height : ai.height;
              var n = (this.x + this.side - paddle.x)/(paddle.width + this.side);
              //Reflection angle
              var phi = -0.25 * pi * ( 2 * n - 1);
              var smash = Math.abs(phi) > 0.2*pi ? 1.5: 1 ;
              this.vel.y = smash*(paddle === player? 1 : -1)* this.speed*Math.cos(phi);
              this.vel.x = smash*this.speed*Math.sin(phi);
            }
            if(this.y < 0 || this.y +this.side> HEIGHT){
              if(this.y+this.side > HEIGHT){
                lose = lose + 1;
              }
              if(this.y < 0){
                win = win + 1;
              }
              ai.y = ai.height;
              ai.x = (WIDTH - ai.width)*0.5;
              score();
              console.log('stuff2');
              reset();
            }

          }
        },
        draw : function(){ ctx.fillRect(this.x,this.y,this.side,this.side)}
      };
      $scope.main = function()
      {

        canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        ctx = canvas.getContext('2d');
        document.getElementById('container').appendChild(canvas);
        document.addEventListener('keydown',function(evt){
          keystate[evt.keyCode] = 'true';
        });
        document.addEventListener('mousemove',function(e){
          mouseX = e.pageX;
          console.log(mouseX);
        });
        document.addEventListener('keyup',function(evt){
          delete keystate[evt.keyCode];
        });

        init();

        var loop = function(){
          update();
          draw();
          window.requestAnimationFrame(loop,canvas);
        };
        window.requestAnimationFrame(loop,canvas);
      };

      function init()
      {

        player.y = HEIGHT -  player.height*2;
        player.x = (WIDTH - player.width)/2;

        ai.y = ai.height;
        ai.x = (WIDTH - ai.width)*0.5;

        ball.y = player.y - player.height;
        ball.x = player.x+player.width*0.5 - ball.side*0.5;
        ball.vel = {
          x : 0,
          y : 0
        };
        /*ball.x = (WIDTH - ball.side)*0.5;
         ball.y = (HEIGHT - ball.side)*0.5;
         ball.vel = {
         x : ball.speed,
         y : 0
         };*/
        score();
      }

      function update()
      {


        player.update();
        ai.update();
        ball.update();
      }

      function draw()
      {
        ctx.fillRect(0,0,WIDTH,HEIGHT);
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,1)";
        player.draw();
        ai.draw();
        ball.draw();
        var w = 2;
        var y = (HEIGHT -w)*0.5;
        var x = 0;
        var step = WIDTH/25;
        while(x<WIDTH)
        {
          ctx.fillRect(x+step*0.25,y,step*0.5,w);
          x += step;
        }
        ctx.restore();
      }
      function reset(){
        serve = 1;
        document.getElementById('serve').style.display = 'block';
        ball.y = player.y - player.height;
        ball.x = player.x+player.width*0.5 - ball.side*0.5;
        ball.vel = {
          x : 0,
          y : 0
        };
      }
      function score(){
        var w = document.getElementById('win_count');
        var l = document.getElementById('lose_count');
        //  w.innerHTML = win;
        // l.innerHTML = lose;
      }
      $scope.serve = function(){
        serve = 0;
       // document.getElementById('serve').style.display = 'none';
        ball.vel = {
          x: 0,
          y: ball.speed
        }
      };

    })
    .controller('camera', function($scope, Camera) {

      $scope.getPhoto = function() {
        Camera.getPicture().then(function(imageURI) {
          console.log(imageURI);
        }, function(err) {
          console.err(err);
        });
      }});