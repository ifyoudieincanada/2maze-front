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
  tile = e.detail.message.maze;
  if (!gblock) {
    gb = new Gameboard();
  }
});

document.addEventListener('disconnect', function(e) {
    console.log(e.detail.message);
    gb.stop();
});

server.send("game.mode", {mode:0});

function Gameboard()
{
  console.log('creating gameboard');
  gblock = true;
	var gb = this;
	var s = setInterval(function() {

		ctx.fillStyle = "#0067db";
		ctx.fillRect(0,0,canvas.width,canvas.height);

    console.log(tile.length*tile[0].length)

		for(i = 0; i < tile.length; i++)
		{
			for(j = 0; j < tile[i].length; j++)
			{
        console.log('building board');
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
		ctx.drawImage(player2Pic, ((canvas.width/2) + player2.x*128 - (player.x*128) - 64), ((canvas.height/2) + player2.y*128 - (player.y*128) - 64), 128, 128);

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


		/*player 2

		if(e.keyCode == 65) {
			moveLeft(player2);
		}
		if(e.keyCode == 68) {
			moveRight(player2);
		}
		if(e.keyCode == 87) {
			moveDown(player2);
		}
		if(e.keyCode == 83) {
			moveUp(player2);
		}
		*/


	});

	this.stop = function() {
    gblock = false;
		clearInterval(s);
	}
}

//left = 37, right = 39, up = 38, down = 40

