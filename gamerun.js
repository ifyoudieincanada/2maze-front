var canvas = document.getElementById("canvas");
var effect = document.getElementById("effect");

canvas.tabIndex = 0;
canvas.focus();
var ctx = canvas.getContext("2d");
var cte = effect.getContext("2d");

var playerPic = new Image();
playerPic.src = 'images/player-white.png'

var player2Pic = new Image();
player2Pic.src = 'images/player-green.png'

var pathTile = new Image();
pathTile.src = 'images/path.png'

var wallTile = new Image();
wallTile.src = 'images/wall.png'

var finTile = new Image();
finTile.src = 'images/fin.png'

var tile =
[
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','$','$','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','$','$','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.','.','#','#','#','.','#','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.'],
['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.','.','.','.','#','.','.','.','.']
];

var player = {x: 1, y: 1};
var player2 = {x: (tile.length - 2), y: (tile.length - 2)};
var offx = 0;
var offy = 0;
var gb;
var gblock = false;

var server = new TwoSocket("ws://localhost:8080");

document.addEventListener("game_created", function(e) {
	alert("Awating connection.");
});

document.addEventListener("game_ready", function(e) {
	gb = new Gameboard();
	var display = document.querySelector('#time');
	gb.startTimer(display);
  if (!gblock) {
    gb = new Gameboard();
  }
});

document.addEventListener('disconnect', function(e) {
    console.log(e.detail.message);
    gb.stop();
});

var menu   = document.getElementById('menu');
var easy   = document.getElementById('easyc');
var medium = document.getElementById('mediumc');
var hard   = document.getElementById('hardc');

easy.addEventListener('click', function() {
  server.send("game.mode", { mode: 0 });
  menu.style.display = 'none';
  canvas.focus();
});

medium.addEventListener('click', function() {
  server.send("game.mode", { mode: 1 });
  menu.style.display = 'none';
  canvas.focus();
});

hard.addEventListener('click', function() {
  server.send("game.mode", { mode: 2 });
  menu.style.display = 'none';
  canvas.focus();
});

function Gameboard()
{
  console.log('creating gameboard');
  gblock = true;
	var gb = this;
	var s = setInterval(function() {

		ctx.fillStyle = "#0067db";
		ctx.fillRect(0,0,canvas.width,canvas.height);

    var lower_y = player.y - 5 < 0 ? 0 : player.y - 5;
    var upper_y = player.y + 5 > tile.length ? tile.length - 1 : player.y + 5;
    var lower_x = player.x - 5 < 0 ? 0 : player.x - 5;
    var upper_x = player.x + 5 > tile[0].length ? tile[0].length - 1 : player.x + 5;

		for(i = lower_y; i < upper_y; i++)
		{
			for(j = lower_x; j < upper_x; j++)
			{
				if(tile[i][j] == '.') {
					ctx.drawImage(pathTile, (((canvas.width/2) - player.x*128 + j*128)- 64), ((canvas.height/2) - player.y*128 + i*128 - 64), 128, 128);
				}
				if(tile[i][j] == '#') {
					ctx.drawImage(wallTile, (((canvas.width/2) - player.x*128 + j*128)- 64), ((canvas.height/2) - player.y*128 + i*128 - 64), 128, 128);
				}
				if(tile[i][j] == '$') {
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


	function moveLeft(player) {
		if((player.x > 0) && (tile[player.y][player.x - 1] != '#'))
		{
			player.x--;
			server.send("game.coordinates", player);
			gameOver();
		}
	}

	function moveRight(player) {
		if((player.x < (tile.length - 1)) && (tile[player.y][player.x + 1] != '#'))
		{
			player.x++;
			server.send("game.coordinates", player);
			gameOver();
		}
	}

	function moveDown(player) {
		if((player.y > 0) && (tile[player.y - 1][player.x] != '#'))
		{
			player.y--
			server.send("game.coordinates", player);
			gameOver();
		}
	}

	function moveUp(player) {
		if((player.y < (tile.length - 1)) && (tile[player.y + 1][player.x] != '#'))
		{
			player.y++
			server.send("game.coordinates", player);
			gameOver();
		}
	}

	function gameOver() {
		if((tile[player.y][player.x] == '$') && (tile[player2.y][player2.x] == '$')) {
			console.log("game over.");
			server.send("game.stop", {});
		}
		console.log(player.x + " " + player.y + " " + player2.x + " " + player2.y);
	}

	document.addEventListener('coordinates', function(e) {
		//console.log(e.detail.message);
		player2.x = e.detail.message.x;
		player2.y = e.detail.message.y;
		gameOver();
	});

	canvas.addEventListener("keydown", function(e){

		//player

		if(e.keyCode == 37) {
			moveLeft(player);
		}
		if(e.keyCode == 39) {
			moveRight(player);
		}
		if(e.keyCode == 38) {
			moveDown(player);
		}
		if(e.keyCode == 40) {
			moveUp(player);
		}


	});

	this.stop = function() {
    gblock = false;
		clearInterval(s);
	}

	this.startTimer = function(display) {
	    var timer = 60, minutes, seconds;
	    setInterval(function () {
	        minutes = parseInt(timer / 60, 10);
	        seconds = parseInt(timer % 60, 10);

	        minutes = minutes < 10 ? "0" + minutes : minutes;
	        seconds = seconds < 10 ? "0" + seconds : seconds;
	        console.log(minutes);
	        console.log(seconds);
	        display.textContent = minutes + ":" + seconds;

	        if (--timer < 0) {
	            timer = 60;
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

