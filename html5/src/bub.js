BUB = {
	canvas: null,
	width: 1080,
	height: 1080,
	json: {},
	thing: {},
	scene: null,
	mask: {
		ork: { src: "image/mask/scribbleork.png", zoom: 8, rot: 6 },
		ork2: { src: "image/mask/scribbleork2.png", zoom: 8, rot: 6 },
		ork3: { src: "image/mask/scribbleork3.png", zoom: 8, rot: 6 },
		ork3: { src: "image/mask/scribbleork4.png", zoom: 8, rot: 6 }
//		key: { src: "image/mask/scribblekey.png", zoom: 8, rot: -3 }
/*
		ork: "image/mask/ork.png",
		orkup: "image/mask/orkup.png",
		orkdown: "image/mask/orkdown.png",
		bubble: { src: "image/mask/bubble.png", zoom: 2}
*/
	},
	maskout: false,
	acceptinput: false,

	level: null,
	pos: {
		x: 0,
		y: 7
	},
	flag: {
		x: 7,
		y: 7
	},
	anim: null,
	animstart: null,
	input: {
		up: false,
		down: false,
		left: false,
		right: false,
		restart: false,
		menu: false
	},
	action: null,
	actiondone: null
};
function LOAD(json) {
	var data = json;
	var name = data.name || "anonymous";
	BUB.json[name] = data;
}
if(!console) {
	console = {
		log: function() {},
		error: function() {}
	}
}

//idle animation
function idle(ork, time) {
	var cos300 = Math.cos(time / 300);
	var cos150 = Math.cos(time / 150);
	var sin300 = Math.sin(time / 300);

	ork.$["body"]._offset.x =  cos300 * 14;
	ork.$["body"]._offset.y = cos150;
	ork.$["body"]._rotate = 0;
	ork.$["snout"]._rotate = sin300 * -2;
	ork.$["mouth"]._rotate = cos300 * 2;

	ork.$["leg1"]._rotate = cos300 * 5;
	ork.$["foot1"]._rotate = cos300 * -5;
	ork.$["leg2"]._rotate = cos300 * 5;
	ork.$["foot2"]._rotate = cos300 * -5;

	ork.$["hair1"]._rotate = sin300 * 3;
	ork.$["hair2"]._rotate = sin300 * 6;

	ork.$["pupil1"]._offset.x = 0;
	ork.$["pupil1"]._offset.y = 0;
	ork.$["pupil2"]._offset.x = 0;
	ork.$["pupil2"]._offset.y = 0;
}

//walk animation
function walk(ork, time) {
	ork.$["body"]._offset.y = -25 - (Math.sin(time / 50) * 15);
	ork.$["body"]._offset.x = 0;
	ork.$["body"]._rotate = (Math.sin(time / 100) * 3);
	ork.$["snout"]._rotate = (Math.cos(time / 100) * -3);
	ork.$["mouth"]._rotate = (Math.sin(time / 100) * -3);

	ork.$["leg1"]._rotate = Math.sin(time / 100) * 50;
	ork.$["foot1"]._rotate = Math.cos(time / 100) * 30;
	ork.$["leg2"]._rotate = Math.sin(time / 100) * -50;
	ork.$["foot2"]._rotate = Math.cos(time / 100) * -30;

	ork.$["hair1"]._rotate = (Math.cos(time / 50) * -6);
	ork.$["hair2"]._rotate = (Math.cos(time / 50) * -9);

	ork.$["pupil1"]._offset.x = 5;
	ork.$["pupil1"]._offset.y = -5;
	ork.$["pupil2"]._offset.x = 5;
	ork.$["pupil2"]._offset.y = 10;
}

//wave the flag
function wave(flag, time) {
	var cos200 = Math.cos(time / 200);
	var sin200 = Math.sin(time / 200);

	flag.$["1"]._rotate = -1 + (cos200 * 4);
	flag.$["2"]._rotate = 2 + (sin200 * 7);
	flag.$["3"]._rotate = 0 - (cos200 * 12);
	flag.$["shade"]._offset.x = 15 + (cos200 * 20);
	flag.$["shade"]._alpha = 1 + (sin200 * -1);
}

function animate(time) {
	// flag
	wave(BUB.thing.flag, time);

	// ork
	if(BUB.anim === "walk") {
		walk(BUB.thing.ork, time - BUB.animstart - 300);
		if(BUB.action === "right") {
			BUB.thing.ork.x += 8;
			if(BUB.thing.ork.x > (128 + (119 * (BUB.pos.x + 1)))) {
				BUB.actiondone = true;
				BUB.pos.x++;
				BUB.thing.ork.x = 128 + (119 * BUB.pos.x)
			}
		} else if(BUB.action === "left") {
			BUB.thing.ork.x -= 8;
			if(BUB.thing.ork.x < (128 + (119 * (BUB.pos.x - 1)))) {
				BUB.actiondone = true;
				BUB.pos.x--;
				BUB.thing.ork.x = 128 + (119 * BUB.pos.x)
			}
		}
	} else {
		idle(BUB.thing.ork, time);
	}
}

function handleinput(time) {
	if(!BUB.action || BUB.actiondone) {
		BUB.actiondone = false;
		if(!BUB.action) {
			BUB.animstart = time;
		}
		if(BUB.input.left) {
			BUB.anim = "walk";
			BUB.thing.ork.flip(true, false);
			BUB.action = "left";
		} else if(BUB.input.right) {
			BUB.anim = "walk";
			BUB.thing.ork.flip(false, false);
			BUB.action = "right";
		} else if(BUB.input.down) {
		} else if(BUB.input.right) {
		} else {
			BUB.action = null;
			BUB.anim = null;
		}
	}
}

function tick(scene, time) {
	handleinput(time);
	animate(time);
}

function transitionEnd() {
	// examine state, set up next scene
	if(BUB.maskout) {
		BUB.scene.pause();
	}
	BUB.acceptinput = true;
}

function loadlevel(data) {
	var walls = [];
	var bubbles = [];
	var lefts = [];
	var rights = [];
	var i;
	var c;

	var quick = {
		"_": "",
		"E": "wall",
		"H": "ladder",
		"o": "bubble",
		"-": "key",
		"X": "door",
		"4": "flag",
		"l": "left",
		"r": "right",
		"c": "crate",
		"O": "ork",
	};

	// top border
	for(i = 0; i < 10; i++) {
		walls.push({x: 3 + (i * 119), y: 52});
	}

	BUB.level = [];
	// level data
	data.split("0").every(function(line, y) {
		BUB.level.push(line);

		// left border
		walls.push({x: 3, y: 52 + ((y + 1) * 122)});

		for(i = 0; i < line.length; i++) {
			c = line[i];
			if(c === "O") {
				BUB.pos.x = i;
				BUB.pos.y = y;
			} else if(c === "4") {
				BUB.flag.x = i;
				BUB.flag.y = y;
			} else if(c === "E") {
				walls.push({x: 3 + ((i + 1) * 119), y: 52 + ((y + 1) * 122)});
			} else if(c === "o") {
				bubbles.push({x: 3 + ((i + 1) * 119), y: 52 + ((y + 1) * 122)});
			} else if(c === "l") {
				lefts.push({x: 3 + ((i + 1) * 119), y: 52 + ((y + 1) * 122)});
			} else if(c === "r") {
				rights.push({x: 3 + ((i + 1) * 119), y: 52 + ((y + 1) * 122)});
			}
		}

		// right border
		walls.push({x: 3 + (9 * 119), y: 52 + ((y + 1) * 122)});

		return true;
	});

	// bottom border
	for(i = 0; i < 10; i++) {
		walls.push({x: 3 + (i * 119), y: 52 + (9 * 122)});
	}

	walls.reverse();
//	BUB.thing.bg.setInstances(walls, "wall");
	BUB.thing.wall.setInstances(walls);
	bubbles.reverse();
//	BUB.thing.bg.setInstances(bubbles, "bubble");
	BUB.thing.bubble.setInstances(bubbles);
	BUB.thing.left.setInstances(lefts);
	BUB.thing.right.setInstances(rights);
}

function start() {
	console.log("start");
	BUB.acceptinput = true;
	BUB.scene = new penduinSCENE(BUB.canvas, BUB.width, BUB.height,
								 tick, 60);
//	BUB.scene.showFPS(true);
	BUB.scene.addOBJ(BUB.thing.ork, "ork");
	BUB.scene.addOBJ(BUB.thing.flag, "flag");
	BUB.scene.setBG("silver");

	BUB.thing.ork.$["body"]._offset = BUB.thing.ork.$["body"]._offset || {};
	BUB.thing.ork.$["pupil1"]._offset = BUB.thing.ork.$["pupil1"]._offset || {};
	BUB.thing.ork.$["pupil2"]._offset = BUB.thing.ork.$["pupil2"]._offset || {};

	BUB.thing.flag.$["shade"]._offset = BUB.thing.flag.$["shade"]._offset || {};


	BUB.scene.addBG(BUB.thing.bg, "bg");
	BUB.thing.bg.y = 0;
	BUB.thing.bg.x = BUB.width / 2;

	["wall", "bubble", "left", "right"].every(function(block) {
		BUB.thing[block].x = 0;
		BUB.thing[block].y = 0;
		BUB.scene.addBG(BUB.thing[block], "bg" + block);
		return true;
	});

	loadlevel("________0_r______0EEE_____0_______40______EE0oo_O_EEE0EEEEEEEE0EEEEEEEE");

	BUB.thing.ork.x = 128 + (119 * BUB.pos.x);
	BUB.thing.ork.y = 178 + (122 * BUB.pos.y);
	BUB.thing.flag.x = 128 + (119 * BUB.flag.x);
	BUB.thing.flag.y = (178 + (122 * BUB.flag.y)) - 1;

/*
	BUB.thing.ork.$["ork-leg1"].flipx = true;
	BUB.thing.ork.$["ork-leg2"].flipx = true;

	BUB.thing.ork.$["ork-eyeb"].scale = 1.6;
	BUB.thing.ork.removeTags("pupilb");
	BUB.thing.ork.addTags("bubbleb");

	BUB.thing.ork.$["ork-eye"].scale = 1.6;
	BUB.thing.ork.removeTags("pupil");
	BUB.thing.ork.addTags("bubble");
	*/

	BUB.scene.transition(BUB.mask.ork, BUB.maskout);
	BUB.ready = true;
}

function combineCallbacks(cbList, resultsVary, cb) {
	var results = [];
	var res = [];
	var uniq = [];
	while(results.length < cbList.length) {
		results.push(null);
	}

	cbList.every(function(callback, idx) {
		return callback(function(val) {
			res.push(val);
			results[idx] = val;
			if(uniq.indexOf(val) < 0) {
				uniq.push(val);
			}
			if(res.length === cbList.length) {
				if(uniq.length === 1) {
					cb(uniq[0], results);
				} else if(uniq.length > 1) {
					cb(resultsVary, results);
				} else {
					cb(null, results);
				}
			}
		});
	});
}

window.addEventListener("load", function() {
	BUB.canvas = document.querySelector("#display");
	var cbs = [];

	// load transition masks
	Object.keys(BUB.mask).every(function(key) {
		cbs.push(function(cb) {
			var mask = document.createElement("img");
			mask.addEventListener("load", function() {
				if(typeof(BUB.mask[key]) === "string") {
					BUB.mask[key] = new penduinTRANSITION(transitionEnd, mask,
														  4);
				} else if(BUB.mask[key].src && BUB.mask[key].zoom) {
					BUB.mask[key] = new penduinTRANSITION(transitionEnd, mask,
														  BUB.mask[key].zoom,
														  1000,
														  BUB.mask[key].rot);
				}
				cb(true);
			});
			mask.src = BUB.mask[key].src || BUB.mask[key];
			return true;
		});
		return true;
	});

	// load object armatures
	Object.keys(BUB.json).every(function(key) {
		cbs.push(function(cb) {
			BUB.thing[key] = new penduinOBJ(BUB.json[key], cb);
			return true;
		});
		return true;
	});

	combineCallbacks(cbs, null, start);
});

window.addEventListener("click", function() {
	if(!BUB.acceptinput) {
		return;
	}
	BUB.scene.resume();
	BUB.maskout = !BUB.maskout;
	BUB.acceptinput = false;
	var masks = Object.keys(BUB.mask);
	var which = Math.floor(Math.random() * masks.length);
	BUB.scene.transition(BUB.mask[masks[which]], BUB.maskout);
});


function handlekey(event, down) {
	switch(event.keyCode) {
	case 38:  //up
	case 104: //num8
	case 87:  //w
		BUB.input.up = down;
		break;
	case 40:  //down
	case 98:  //num2
	case 83:  //s
		BUB.input.down = down;
		break;
	case 37:  //left
	case 100: //num4
	case 65:  //a
		BUB.input.left = down;
		break;
	case 39:  //right
	case 102: //num6
	case 68:  //d
		BUB.input.right = down;
		break;
	case 32:  //space
		BUB.input.restart = down;
		break;
	case 27:  //esc
		BUB.input.menu = down;
		break;
	default:
		return;
		break;
	}
	event.preventDefault();
};
window.addEventListener("keydown", function(e) {
	handlekey(e, true);
});
window.addEventListener("keyup", function(e) {
	handlekey(e, false);
});