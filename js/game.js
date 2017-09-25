"use strict";

function main() {
	if (!options.isGameOver) {
		if (!options.pause) requestAnimationFrame(main);
		fps.now = Date.now();
		fps.elapsed = fps.now - fps.then;

		if (fps.elapsed >= fps.interval) {
			fps.then = fps.now - (fps.elapsed % fps.interval);

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.filter = 'opacity(' + options.unitsOpacity + '%)';

			if (color.valueFlickering) color.change();

			if (color.flickering) {
				color.glowingCoefficient = getRandomInt(33, 65);
				ctx.shadowColor = color.getAlphaString(color.value, color.glowingCoefficient);
				ctx.shadowBlur = Math.floor(color.glowingCoefficient * 0.4);
			} else {
				ctx.shadowColor = "rgba(0, 0, 0, 0)";
			}

			spaceShip.update();

			if (shot.isTrue) shot.make();

			for (var i = 0; i < options.enemiesCount + stCount; i++) {
				if (!enemies[i]) enemies.push(new Alien(getRandomInt(1,4)));
				enemies[i].draw();
			}

			if ((level.points % 30 == 0) & (level.points != 0) & stBool) {
				enemies.push(new AlienEpileptic(getRandomInt(1,4)));
				stCount++;
				// console.log("aaa");
				stBool = false;
			}

			if (level.points % 30 != 0) stBool = true;

			fps.sinceStart = fps.now - fps.startTime;
			fps.current = Math.round(1000 / (fps.sinceStart / ++fps.frameCount) * 100) / 100;
			level.check();
			keyboard();
		}
	} else {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

var stBool = true,
stCount = 0;

function start() {
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight - 10;
	stars.canvas.width  = window.innerWidth;
	stars.canvas.height = window.innerHeight;

	var starsIntensity = 10;
	for (var i = 0; i < stars.canvas.width; i += starsIntensity) {
		for (var j = 0; j < stars.canvas.height; j += starsIntensity) {
			var starsColor = getRandomInt(0,256);
			stars.fillStyle = color.getString([starsColor,starsColor,starsColor]);
			if (getRandomInt(0,2)) stars.fillRect(i + getRandomInt(0,starsIntensity),
			j + getRandomInt(0,starsIntensity), 1, 1);
		}
	}

	//ctx.fillStyle = color.getString(color.value);
	//ctx.webkitImageSmoothingEnabled = false;
	//ctx.mozImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
	document.getElementById("bG").style.display = "none";
	window.score = document.getElementById("score");
	score.style.display = "block";
	//score.style.color = color.getString(color.value);


	fps.interval = 1000 / fps.value;
	fps.then = Date.now();
	fps.startTime = fps.then;
	
    requestAnimationFrame(main);
	setInterval(function() {
		document.getElementById("fps").innerHTML = Math.round(1000 / fps.elapsed) + " fps.";
	}, 100);
}

function gameOver() {
	options.isGameOver = true;
	score.style.display = "none";
	var gOB = document.getElementById("gameover");
	gOB.innerHTML = "Game over!<br>Your score: " + level.points;
	gOB.style.color = color.getString(color.value);
	gOB.style.display = "block";
}

var options = {
	cellSize: Math.round((0.5 * window.innerWidth + window.innerHeight) / 350),
	unitsOpacity: 100,
	moveSpeed: 1,
	pause: false,
	enemiesCount: 3
},

fps = {
	value: 60,
},

level = {
	points: 0,

	check: function() {
		if (this.points == 5) {
			options.enemiesCount = 4 + stCount;
		} else if (this.points == 10) {
			options.moveSpeed = 1.1;
		} else if (this.points == 25) {
			options.moveSpeed = 1.2;
		} else if (this.points == 50) {
			options.enemiesCount = 5 + stCount;
			options.moveSpeed = 1.3;
		} else if (this.points == 75) {
			spaceShip.speed = 4;
			options.moveSpeed = 1.4;
		} else if (this.points == 100) {
			options.enemiesCount = 6 + stCount;
			options.moveSpeed = 1.5;
		} else if (this.points == 125) {
			spaceShip.speed = 5;
			options.moveSpeed = 1.6;
		} else if (this.points == 150) {
			options.moveSpeed = 1.7;
			spaceShip.speed = 6;
		} else if (this.points == 200) {
			options.enemiesCount = 7 + stCount;
		}
	}
},

spaceShip = {
	x: options.cellSize,
	y: Math.round(0.5 * window.innerHeight),
	speed: 3.5,

	update: function() {
		ctx.fillRect(this.x, this.y, options.cellSize * 2, options.cellSize);
		ctx.fillRect(this.x + options.cellSize, this.y + options.cellSize, options.cellSize * 2, options.cellSize);	
		ctx.fillRect(this.x, this.y + options.cellSize * 2, options.cellSize * 2, options.cellSize);
	}
},

color = {
	value: [50, 255, 50],
	flickering: false,
	valueFlickering: false,
	i: 0,

	get: function(tempColor) {
		switch (tempColor) {
			case 0:
				return [255, 0, 0];
			break;
			case 1: 
				return [0, 255, 0];
			break;
			case 2: 
				return [0, 0, 255];
			break;	
			case 3: 
				return [255, 255, 0];
			break;
			case 4: 
				return [255, 0, 255];
			break;
			case 5: 
				return [0, 255, 255];
			break;
			default:
				return [255, 255, 255];
			break;		
		}
	},

	random: function() {
		return this.get(getRandomInt(0,6));
	},

	getString: function(array) {
		return "rgb(" + array[0] + ", " + array[1] + ", " + array[2] + ")";
	},

	getAlphaString: function(array, alpha) {
		return "rgba(" + array[0] + ", " + array[1] + ", " + array[2] + ", ." + alpha + ")";
	},

	change: function(from) {
		if (from) this.i = from;
		this.value = this.get(this.i);
		ctx.fillStyle = this.getString(this.value);
		ctx.shadowColor = this.getAlphaString(this.value, this.glowingCoefficient);
		//img.src = "images/alien1/enemy" + this.i +".png";
		for (var i = 0; i < options.enemiesCount + stCount; i++) {
			// if (enemies[i]) enemies[i].img.src = "images/alien1/enemy" + this.i +".png";
		}
		score.style.color = this.getString(this.value);
		this.i++;
		if (this.i > 5) this.i = 0;
	}
},

shot = {
	isTrue: false,
	coord: 0,

	destroy: function() {
		this.isTrue = false;
		this.coord = 0;
	},

	make: function() {
		this.positionRightNow = this.coordConstX + options.cellSize * 3 + this.coord;
		ctx.fillRect(this.positionRightNow, this.coordConstY + options.cellSize, options.cellSize, options.cellSize);
		this.coord += options.cellSize * 5;
		if (this.positionRightNow > window.innerWidth) {
			this.destroy();
		}
	}
},

canvas = document.getElementById('canvas'),
starsCanvas = document.getElementById('starsCanvas'),
ctx = canvas.getContext('2d'),
stars = starsCanvas.getContext('2d'),

enemies = [];
//img = new Image();

function Enemy() {
	this.colorStyle = 2;
	this.hp = 1;
	this.img = new Image();
	// this.width = img.width;
	// this.height = img.height;
	this.ableCollision = true;
	this.firstDraw = true;

	this.x = window.innerWidth + options.cellSize * 5;
	this.y = options.cellSize * 4 + getRandomInt(0, window.innerHeight - 10 - options.cellSize * 8);

	this.changeImg = function() {
		if (color.i === 0) {
			this.img.src = "images/alien" + getRandomInt(1, 4) + "/enemy5.png";
		} else {
			this.img.src = "images/alien" + getRandomInt(1, 4) + "/enemy" + Number(color.i - 1) +".png";
		}
	}

	this.returnToRespawn = function() {
		this.x = window.innerWidth + options.cellSize * 5;
		this.y = getRandomInt(0, window.innerHeight - 10 - options.cellSize * this.img.height * 3);
		this.enemyType = getRandomInt(1,4);
		this.returnHP();
	}

	this.checkCollision = function(array) {
		if (!this.ableCollision) return false;
		//return ((this.y + options.cellSize * -4 <= array[1]) & (this.y + options.cellSize * 4 >= array[0])) & ((this.x <= array[3]) & (this.x + options.cellSize * 11 >= array[2]))
		
		return ((this.y <= array[1]) &
		(this.y + options.cellSize * this.img.height >= array[0])) &
		((this.x <= array[3]) &
		(this.x + options.cellSize * this.img.width >= array[2]))
	}

	this.update = function() {
		if (this.checkCollision([spaceShip.y,
		spaceShip.y + options.cellSize * 3,
		spaceShip.x,
		spaceShip.x + options.cellSize * 3])) {
			spaceShip.x = options.cellSize;
			this.returnToRespawn();
			level.points += 1;
			score.innerHTML = level.points;	
			gameOver();		
		}

		if (shot.isTrue & this.checkCollision([shot.coordConstY + options.cellSize,
		shot.coordConstY + options.cellSize * 2,
		shot.coordConstX + shot.coord,
		shot.coordConstX + shot.coord + options.cellSize])) {
			shot.destroy();

			if (this.hp > 1) {
				this.hp--
				if (this.hp == 2) this.colorStyle = 4;
				if (this.hp == 1) this.colorStyle = 1;
			} else {
				this.returnToRespawn();
			}

			level.points += 1;
			score.innerHTML = level.points;
			// color.change();
		}

		this.x -= options.moveSpeed * options.cellSize / 4;
		// if (this.x < options.cellSize * -16) this.returnToRespawn(); 
		if (this.x < options.cellSize * -16) gameOver(); 
	};

	this.returnHP = function() {
		switch (this.enemyType) {
			case 1: this.hp = 2; break;
			case 2: this.hp = 3; break;
			case 3: this.hp = 1; break;
		};
		this.colorStyle = 2;
	};	
}

function Alien(type) {
	this.__proto__ = new Enemy();
	this.enemyType = type;

	this.draw = function() {

		if (this.firstDraw) {
			this.firstDraw = !this.firstDraw;
			this.returnHP();
		}

		if (color.i === 0) {
			this.img.src = "images/alien" + this.enemyType + "/enemy5.png";
		} else {
			this.img.src = "images/alien" + this.enemyType + "/enemy" + (this.colorStyle - 1) +".png";
		}

		ctx.drawImage(this.img, this.x, this.y, this.img.width * options.cellSize, this.img.height * options.cellSize);
		this.update();
	};
}

function AlienEpileptic(type) {
	this.__proto__ = new Enemy();
	this.enemyType = type;

	var	stereoIteration = 0,
	t = setInterval(function() {
	    if (stereoIteration++ == 5) stereoIteration = 0;
	    
	}, 50);

	this.draw = function() {
		this.img.src = "images/alien" + this.enemyType + "/enemy" + stereoIteration + ".png";
		
		ctx.drawImage(this.img,
		this.x + getRandomInt(0, options.cellSize),
		this.y + getRandomInt(0, options.cellSize),
		this.img.width * options.cellSize,
		this.img.height * options.cellSize);
		
		this.update();
	};

	this.returnHP = function() {
		this.hp = 2;
	};
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

/*
*	Keyboard functions
*/

document.addEventListener('keydown', function(event) {
switch (event.keyCode) {
	// case 67:
	// 	color.change();
	// break;
	
	case 72:
		if (document.getElementById("help").style.display != "none") {
			document.getElementById("help").style.display = "none";
		} else {
			document.getElementById("help").style.display = "block";
		}
	break;

	case 66:
		if (!options.pause) {
			options.pause = true;
		} else {
			options.pause = false;
			requestAnimationFrame(main);
		}
	break;	
}
});

var keys = {};

document.addEventListener('keydown', function(event) {
switch (event.keyCode) {
	case 87:
	case 38:
		keys.up = true;
	break;

	case 83:
	case 40:
		keys.down = true;
	break;

	case 65:
	case 37:
		keys.left = true;
	break;

	case 68:
	case 39:
		keys.right = true;
	break;

	case 32:
		keys.space = true;
	break;
}
});

document.addEventListener('keyup', function(event) {
switch (event.keyCode) {
	case 87:
	case 38:
		keys.up = false;
	break;

	case 83:
	case 40:
		keys.down = false;
	break;

	case 65:
	case 37:
		keys.left = false;
	break;

	case 68:
	case 39:
		keys.right = false;
	break;

	case 32:
		keys.space = false;
	break;
}
});

function keyboard() {
	if ((spaceShip.y > 0) & (!options.pause) & (keys.up)) spaceShip.y -= spaceShip.speed; // Up
	if ((spaceShip.y + options.cellSize * 3 + 20 < canvas.height) & (!options.pause) & (keys.down)) spaceShip.y += spaceShip.speed; // Down
	if ((spaceShip.x > 0) & (!options.pause) & (keys.left)) spaceShip.x -= spaceShip.speed; // Left
	if ((spaceShip.x + options.cellSize * 3 + 20 < canvas.width) & (!options.pause) & (keys.right)) spaceShip.x += spaceShip.speed; // Right
	if ((!shot.isTrue) & (keys.space)) {
		shot.isTrue = true;
		shot.coordConstX = spaceShip.x;
		shot.coordConstY = spaceShip.y;
	}
}