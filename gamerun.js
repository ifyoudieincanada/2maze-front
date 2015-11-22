var canvas = document.getElementById("canvas");
var effect = document.getElementById("effect");
canvas.tabIndex = 0;
canvas.focus();
var ctx = canvas.getContext("2d");
var cte = effect.getContext("2d");

var tile = 
[
['.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.'],
['.','#','#','#','.','#','.','.'],
['.','#','$','.','.','.','.','.'],
['.','#','.','.','.','.','.','.'],
['.','.','.','.','.','.','.','.'],
['.','.','.','#','.','.','.','.'],
['.','.','.','#','.','.','.','.']
];

player = {x: 0, y: 0};
player2 = {x: (tile.length - 1), y: (tile.length - 1)};
offx = 0;
offy = 0;
dirx = 0;
diry = 0;
dirpx = 0;
dirpy = 0;

function drawGhost(x, y) {
	var alpha = 1;
	var s = setInterval(function(){
		cte.clearRect(x*64,y*64,64,64);
		cte.fillStyle = "rgba(255,0,0,"+alpha+")";
		cte.fillRect(x*64, y*64, 64, 64);
		alpha-=0.025;
		if(alpha <= 0) {
			clearInterval(s);
		}
	}, 10);
}

var s = setInterval(function() {
	
				
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	for(i = 0; i < tile.length; i++)
	{
		for(j = 0; j < tile[i].length; j++)
		{
			if(tile[i][j] == '.') {
				ctx.strokeStyle = "#000000";
			}
			if(tile[i][j] == '#') {
				ctx.strokeStyle = "#0000ff";
			}
			if(tile[i][j] == '$')
				ctx.strokeStyle = "#ffff00";

			ctx.strokeRect(j*64, i*64, 64, 64);
		}
	}


	//player movement code
	if(tile[player.y][player.x + dirx] != '#')
	{
		offx += dirx * 4;
		if(offx % 64 === 0) {
			player.x += offx / 64;
			offx = 0;
		}
		else if(dirx === 0) {
			offx += dirpx * 4;
		}
	}
	
	if(tile[player.y + diry][player.x] != '#')
	{
		offy += diry * 4;
		if(offy % 64 === 0) {
			player.y += offy / 64;
			offy = 0;
		}
		else if(diry === 0) {
			offy += dirpy * 4;
		}
	}
	

	ctx.fillStyle = "#ffffff";
	ctx.fillRect(player.x*64 + offx, player.y*64 + offy, 64, 64);
	
	ctx.fillRect(player2.x*64, player2.y*64, 64, 64);
}, 10);


//Cool game design idea: since we can't interpolate the movements of the other player, have them leave a fading trail and align them to the coordinates

function moveLeft(player) {
	if((player.x > 0) && (tile[player.y][player.x - 1] != '#'))
	{
		drawGhost(player.x, player.y);
		player.x--;
	}
}

function moveRight(player) {
	if((player.x < (tile.length - 1)) && (tile[player.y][player.x + 1] != '#'))
	{
		drawGhost(player.x, player.y);
		player.x++;
	}
}

function moveDown(player) {
	if((player.y > 0) && (tile[player.y - 1][player.x] != '#'))
	{
		drawGhost(player.x, player.y);
		player.y--;
	}
}

function moveUp(player) {
	if((player.y < (tile.length - 1)) && (tile[player.y + 1][player.x] != '#'))
	{
		drawGhost(player.x, player.y);
		player.y++;
	}
}

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
	
	
	//player 2

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

});

canvas.addEventListener("keyup", function(e){
	console.log("YOU");
	if(dirx !== 0) {
		if(e.keyCode == 37) {
			dirpx = dirx;
			dirx = 0;
		}
		if(e.keyCode == 39) {
			dirpx = dirx;
			dirx = 0;
		}	
	}
	if(diry !== 0) {
		if(e.keyCode == 38) {
			dirpy = diry;
			diry = 0;
		}
		if(e.keyCode == 40) {
			dirpy = diry;
			diry = 0;
		}
	}
});

//left = 37, right = 39, up = 38, down = 40

