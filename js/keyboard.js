
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

keys = {};

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