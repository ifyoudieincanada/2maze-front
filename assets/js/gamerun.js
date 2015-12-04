var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var playerPic  = new Image();
var player2Pic = new Image();
var pathTile   = new Image();
var wallTile   = new Image();
var finTile    = new Image();

var tile;

var player = {x: 1, y: 1};
var player2 = {x: 1, y: 1}; // = {x: (tile[0].length - 2), y: (tile.length - 2)};
var offx = 0;
var offy = 0;
var gb;
var gblock = false;
var gtime = 0;
var nplay = 1;

var server = new TwoSocket("ws://werefoxsoftware.com:8080");

var menu   = document.getElementById('menu');
var easy   = document.getElementById('easyc');
var medium = document.getElementById('mediumc');
var hard   = document.getElementById('hardc');

function Gameboard() {
  gblock = true;
  console.log('creating gameboard');

  canvas.focus();
  canvas.tabIndex = 0;

  var gb = this;
  var t;
  var s = setInterval(function() {

    var lower_y = player.y - 5 < 0 ? 0 : player.y - 5;
    var upper_y = player.y + 5 > tile.length ? tile.length - 1 : player.y + 5;
    var lower_x = player.x - 5 < 0 ? 0 : player.x - 5;
    var upper_x = player.x + 5 > tile[0].length ? tile[0].length - 1 : player.x + 5;

    var i;
    var j;

    ctx.fillStyle = "#0067db";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(i = lower_y; i < upper_y; i++)
    {
      for(j = lower_x; j < upper_x; j++)
      {
        if (tile[i][j] === '.') {
          ctx.drawImage(pathTile, (((canvas.width/2) - player.x*128 + j*128)- 64), ((canvas.height/2) - player.y*128 + i*128 - 64), 128, 128);
        }
        if (tile[i][j] === '#') {
          ctx.drawImage(wallTile, (((canvas.width/2) - player.x*128 + j*128)- 64), ((canvas.height/2) - player.y*128 + i*128 - 64), 128, 128);
        }
        if (tile[i][j] === '$') {
          ctx.drawImage(finTile, (((canvas.width/2) - player.x*128 + j*128)- 64), ((canvas.height/2) - player.y*128 + i*128 - 64), 128, 128);
        }
      }
    }

    // Center the player 	64 is for center offset
    ctx.drawImage(playerPic, ((canvas.width/2) - 64), ((canvas.height/2) - 64), 128, 128);

    // Center the player 	Player2 size   Player offset				64 is for center offset
    if((Math.abs(player.x - player2.x) < 11) && (Math.abs(player.y - player2.y) < 11)) {
      ctx.drawImage(player2Pic, ((canvas.width/2) + player2.x*128 - (player.x*128) - 64), ((canvas.height/2) + player2.y*128 - (player.y*128) - 64), 128, 128);
    }

  }, 10);

  function gameOver() {
    if((tile[player.y][player.x] === '$') && (tile[player2.y][player2.x] === '$')) {
      gb.stop();
    }
    console.log(player.x + " " + player.y + " " + player2.x + " " + player2.y);
  }

  function moveLeft(player) {
    if ((player.x > 0) && (tile[player.y][player.x - 1] !== '#'))
    {
      player.x--;
      server.send("game.coordinates", player);
      gameOver();
    }
  }

  function moveRight(player) {
    if ((player.x < (tile.length - 1)) && (tile[player.y][player.x + 1] !== '#'))
    {
      player.x++;
      server.send("game.coordinates", player);
      gameOver();
    }
  }

  function moveDown(player) {
    if((player.y > 0) && (tile[player.y - 1][player.x] !== '#')) {
      player.y--;
        server.send("game.coordinates", player);
      gameOver();
    }
  }

  function moveUp(player) {
    if((player.y < (tile.length - 1)) && (tile[player.y + 1][player.x] !== '#')) {
      player.y++;
        server.send("game.coordinates", player);
      gameOver();
    }
  }

  function coordinatesListener(e) {
    //console.log(e.detail.message);
    player2.x = e.detail.message.x;
    player2.y = e.detail.message.y;
    gameOver();
  }

  function keyListener(e) {
    //player

    if(e.keyCode === 37) {
      moveLeft(player);
    }
    if(e.keyCode === 39) {
      moveRight(player);
    }
    if(e.keyCode === 38) {
      moveDown(player);
    }
    if(e.keyCode === 40) {
      moveUp(player);
    }
  }

  document.addEventListener('coordinates', coordinatesListener);
  canvas.addEventListener("keydown", keyListener);

  this.stop = function() {
    clearInterval(s);
    clearInterval(t);
    player = { x: 1, y: 1 };
    player2 = { x: 1, y: 1 };

    server.clear();
    server.send("game.stop", {});
    menu.style.display = 'block';

    document.removeEventListener('coordinates', coordinatesListener);
    canvas.removeEventListener('keydown', keyListener);
    gblock = false;
  }

  this.startTimer = function(gtime, display) {
    var timer = gtime, minutes, seconds;
    t = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        console.log("Stop command: game over.");
        server.send("game.stop", {});
        gb.stop();
        menu.style.display = 'block';
        return;
      }
    }, 1000);
  }

  /*
  window.onload = function () {
    var fiveMinutes = 60 * 5,
    display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
  };
  */
}

//left = 37, right = 39, up = 38, down = 40

easy.addEventListener('click', function() {
  server.send("game.mode", { mode: 'easy' });
  gtime = 150;
  menu.style.display = 'none';
  canvas.focus();
});

medium.addEventListener('click', function() {
  server.send("game.mode", { mode: 'medium' });
  gtime = 210;
  menu.style.display = 'none';
  canvas.focus();
});

hard.addEventListener('click', function() {
  server.send("game.mode", { mode: 'hard' });
  gtime = 240;
  menu.style.display = 'none';
  canvas.focus();
});

document.addEventListener("game_created", function(e) {
  alert("Awating connection."); // This should be a toast (when we get toasts)
});

document.addEventListener("game_ready", function(e) {
  tile = e.detail.message.maze;
  nplay = Number(e.detail.message.player);

  if (nplay === 2) {
    player.x = tile[0].length - 2;
    player.y = tile.length - 2;
    player2.x = 1;
    player2.y = 1;
  } else {
    player2.x = tile[0].length - 2;
    player2.y = tile.length - 2;
  }

  var display = document.querySelector('#time');
  gb = new Gameboard();
  gb.startTimer(gtime, display);

  if (!gblock) {
    gb = new Gameboard();
  }
});

document.addEventListener('disconnect', function(e) {
  console.log(e.detail.message);
  gb.stop();
});

playerPic.src  = 'assets/img/player-white.png';
player2Pic.src = 'assets/img/player-green.png';
pathTile.src   = 'assets/img/path.png';
wallTile.src   = 'assets/img/wall.png';
finTile.src    = 'assets/img/fin.png';

