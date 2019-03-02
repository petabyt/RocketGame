var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");

var game = {
	zoom: 10,
	px: 50,
	py: 700,
	pyvel: 0,
};

var current = {
	rocketWeight:0
}

var key = [
	false, // Up Arrow
	false // Down Arrow
];

// Load Images
var img = {
	pod:document.getElementById('pod'),
	chute:document.getElementById('chute'),
	fuelbox:document.getElementById('fuelbox'),
	booster:document.getElementById('booster'),
	seperator:document.getElementById('decoupler'),
	flame1:document.getElementById('flame1'),
};

// Main Loop
setInterval(function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	c.clearRect(0, 0, canvas.width, canvas.height);

	game.zoom = document.getElementById('zoom').value;

	drawRocket([
		img.chute,
		img.pod,
		img.fuelbox,
		img.fuelbox,
		img.fuelbox,
		img.fuelbox,
		img.fuelbox,
		img.booster
		],
	game.px, game.py,{
		accelerating:key[0]
	});

	// Thrust
	if (key[0]) {
		game.pyvel -= 0.01;
	}

	// Gravity
	game.py += game.pyvel;
	game.pyvel += 0.004 + current.rocketWeight/15000;

	// Ground Detection
	if (game.py > 740 && game.pyvel > 0) {
		game.pyvel = 0;
	}

	c.fillStyle = "green";
	c.fillRect(0, 810, window.innerWidth + 10, window.innerHeight + 10);
	c.fillStyle = "grey";
	c.fillRect(25, 800, 100, 10);

},1);

function drawRocket(parts, x, y, data) {
	var yDown = y;
	parts = parts.reverse();
	var weight = 0;

	if (data.accelerating) {
		drawPart(img.flame1, x, yDown + 60);
	}

	for (var i = 0; i < parts.length; i++) {
		drawPart(parts[i], x, yDown);
		var extra = 0;

		if (parts[i].id == "booster") {
			extra = 120 - parts[i].getAttribute("cHeight");
		} else if (parts[i].id == "chute") {
			extra = 120 - parts[i].getAttribute("cHeight");
		}

		weight += Number(parts[i].getAttribute("weight"));

		yDown -= parts[i].getAttribute("cHeight") - game.zoom + extra;
	}

	current.rocketWeight = weight;
}

function drawPart(id, x, y) {
	c.drawImage(id, x, y, id.width - game.zoom, id.height - game.zoom);
}

document.body.onkeydown = function(event) {
	if (event.key == "ArrowUp") {
		key[0] = true;
	} else if (event.key == "ArrowDown") {
		key[1] = true;
	}
}

document.body.onkeyup = function() {
	for (var i = 0; i < key.length; i++) {
		key[i] = false;
	}
}
