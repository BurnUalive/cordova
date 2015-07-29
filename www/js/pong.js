/**
 * Created by Shivam Mathur on 25-04-2015.
 */
    function pong_game(){
var WIDTH = 700, HEIGHT = 600, pi = Math.PI;
var UpArrow = 38, DownArrow = 40;
var Spacebar = 32;
var canvas, ctx, keystate;
var player, ai, ball;
var serve = 1;
var win = 0;
var lose = 0;

keystate = {};

player = {
    x : null,
    y : null,
    width : 20,
    height : 100,
    update : function(){
        if(keystate[UpArrow]){
            if(this.y>0)
                this.y -= 7;
        }
        if(keystate[DownArrow]){
            if(this.y+this.height<HEIGHT)
                this.y += 7;
        }

    },
    draw : function(){ ctx.fillRect(this.x,this.y,this.width,this.height)}
};
ai = {
    x : null,
    y : null,
    width : 20,
    height : 100,
    update : function(){
        if(serve!=1) {
            var dest = ball.y - (this.height - ball.side) * 0.5;
            var aiy =this.y + (dest - this.y) * 0.12;
            if(this.y+this.height>HEIGHT)
                aiy = HEIGHT - this.height;
            if(this.y<0)
                aiy = 0;
            this.y = aiy;
        }
    },
    draw : function(){ ctx.fillRect(this.x,this.y,this.width,this.height)}
};
ball = {
    x : null,
    y : null,
    vel: null,
    speed :10,
    side : 20,
    update : function(){
        if(serve ==1){
            reset();
            if(keystate[Spacebar]) {
                serve = 0;

                ball.vel = {
                    x: ball.speed,
                    y: 0
                }

            }
        }
        else{
            this.x += this.vel.x;
            this.y += this.vel.y;
            if(this.y < 0||this.y+this.side>HEIGHT){
                var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y + this.side);
                this.y += 2*offset;
                this.vel.y *= -1;
            }
            var collision = function(ax,ay,aw,ah,bx,by,bw,bh){
                return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
            };
            var paddle = this.vel.x < 0 ? player : ai;
            if(collision(paddle.x,paddle.y,paddle.width,paddle.height,this.x,this.y,this.side,this.side))
            {
                //normalized y value
                this.x = paddle === player ? player.x + player.width : ai.x - ai.width;
                var n = (this.y + this.side - paddle.y)/(paddle.height + this.side);
                //Reflection angle
                var phi = 0.25 * pi * ( 2 * n - 1);
                var smash = Math.abs(phi) > 0.2*pi ? 1.5: 1 ;
                this.vel.x = smash*(paddle === player? 1 : -1)* this.speed*Math.cos(phi);
                this.vel.y = smash*this.speed*Math.sin(phi);
            }
            if(this.x+this.side < 0 || this.x > WIDTH){
                if(this.x+this.side < 0){
                    lose = lose + 1;
                }
                if(this.x > WIDTH){
                    win = win + 1;
                }
                ai.x = WIDTH - player.width -ai.width;
                ai.y = (HEIGHT - player.height)*0.5;
                score();
                reset();
            }
        }
    },
    draw : function(){ ctx.fillRect(this.x,this.y,this.side,this.side)}
};
function main()
{
    canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    document.addEventListener('keydown',function(evt){
        keystate[evt.keyCode] = 'true';
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
}

function init()
{
    player.x = player.width;
    player.y = (HEIGHT - player.height)/2;

    ai.x = WIDTH - player.width -ai.width;
    ai.y = (HEIGHT - player.height)*0.5;

    ball.x = player.x + player.width;
    ball.y = player.y+player.height*0.5 - ball.side*0.5;
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
    ctx.fillStyle = "rgba(255,255,255,1";
    player.draw();
    ai.draw();
    ball.draw();
    var w = 2;
    var x = (WIDTH -w)*0.5;
    var y = 0;
    var step = HEIGHT/25;
    while(y<HEIGHT)
    {
        ctx.fillRect(x,y+step*0.25,w,step*0.5);
        y += step;
    }
    ctx.restore();
}
function reset(){
    serve = 1;
    ball.x = player.x + player.width;
    ball.y = player.y+player.height*0.5 - ball.side*0.5;
    ball.vel = {
        x : 0,
        y : 0
    };
}
function score(){
    var w = document.getElementById('win_count');
    var l = document.getElementById('lose_count');
     w.innerHTML = win;
     l.innerHTML = lose;
}


main();
}