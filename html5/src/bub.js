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

	prop: ["wall", "left", "right", "ladder", "door", "crate", "bubble", "key"],
	level: null,
	inv: {
		key: 0,
		bub: 0
	},
	grow: {
		eye1: false,
		eye2: false
	},
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
QUICK = {
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

function screenX(x) {
	return (119 * x) + 122;
}
function screenY(y) {
	return (y * 122) + 188;
}

function inventory() {
	var slots = 2;
	var bub = BUB.inv.bub;
	var key = BUB.inv.key;
	BUB.thing.ork.setTags(["pupil1", "pupil2"]);
	BUB.grow.eye1 = BUB.grow.eye2 = false;
	while(slots && bub) {
		if(slots > 1) {
			BUB.thing.ork.removeTags("pupil2");
			BUB.thing.ork.addTags("bubble2");
			BUB.grow.eye2 = true;
		} else {
			BUB.thing.ork.removeTags("pupil1");
			BUB.thing.ork.addTags("bubble1");
			BUB.grow.eye1 = true;
		}
		slots--;
		bub--;
	}
	while(slots && key) {
		if(slots > 1) {
			BUB.thing.ork.removeTags("pupil2");
			BUB.thing.ork.addTags("key2");
			BUB.grow.eye2 = true;
		} else {
			BUB.thing.ork.removeTags("pupil1");
			BUB.thing.ork.addTags("key1");
			BUB.grow.eye1 = true;
		}
		slots--;
		key--;
	}
}

function isempty(x, y) {
	if(x < 0 || x > 7 || y < 0 || y > 7) {
		return false;
	}
	return (0 <= ["_", "4"].indexOf(BUB.level[y][x]));
}
function emptyout(x, y, item) {
	item = item || "_";
	if(BUB.thing[QUICK[BUB.level[y][x]]] &&
	   BUB.thing[QUICK[BUB.level[y][x]]].instances) {
		BUB.thing[QUICK[BUB.level[y][x]]].removeInstances({
			x: screenX(x),
			y: screenY(y)
		});
	}
	BUB.level[y] = [
		BUB.level[y].substring(0, x),
		item,
		BUB.level[y].substring(x + 1)
	].join("");
}

function animate(time) {
	// flag
	wave(BUB.thing.flag, time);

	// ork inventory
	if(BUB.grow.eye1) {
		if(BUB.thing.ork.$.eye1.scale < 1.6) {
			BUB.thing.ork.$.eye1.scale += 0.1;
		}
	} else if(BUB.thing.ork.$.eye1.scale > 0.6) {
		BUB.thing.ork.$.eye1.scale -= 0.1;
	}
	if(BUB.grow.eye2) {
		if(BUB.thing.ork.$.eye2.scale < 1.6) {
			BUB.thing.ork.$.eye2.scale += 0.1;
		}
	} else if(BUB.thing.ork.$.eye2.scale > 0.6) {
		BUB.thing.ork.$.eye2.scale -= 0.1;
	}
	// ork
	if(BUB.anim === "walk") {
		walk(BUB.thing.ork, time - BUB.animstart - 300);
		if(BUB.action === "right") {
			BUB.thing.ork.x += 8;
			if(BUB.thing.ork.x > screenX(BUB.pos.x + 1)) {
				BUB.actiondone = true;
				BUB.pos.x++;
				BUB.thing.ork.x = screenX(BUB.pos.x)
			}
		} else if(BUB.action === "left") {
			BUB.thing.ork.x -= 8;
			if(BUB.thing.ork.x < screenX(BUB.pos.x - 1)) {
				BUB.actiondone = true;
				BUB.pos.x--;
				BUB.thing.ork.x = screenX(BUB.pos.x)
			}
		}
	} else if(BUB.anim === "climbup") {
		climbup(BUB.thing.ork, time - BUB.animstart);
		BUB.thing.ork.y -= 8;
		if(BUB.thing.ork.y < screenY(BUB.pos.y - 1)) {
			BUB.actiondone = true;
			BUB.pos.y--;
			BUB.thing.ork.y = screenY(BUB.pos.y);
		}
	} else if(BUB.anim === "climbdown") {
		climbdown(BUB.thing.ork, time - BUB.animstart);
		BUB.thing.ork.y += 8;
		if(BUB.thing.ork.y > screenY(BUB.pos.y + 1)) {
			BUB.actiondone = true;
			BUB.pos.y++;
			BUB.thing.ork.y = screenY(BUB.pos.y);
		}
	} else if(BUB.anim === "slurpbub") {
		BUB.thing.ork.addTags("bubble");
		slurp(BUB.thing.ork, time - BUB.animstart);
		if(time - BUB.animstart > 450) {
			BUB.actiondone = true;
			BUB.action = null;
			BUB.thing.ork.removeTags("bubble");
			BUB.inv.bub++;
			inventory();
		}
	} else if(BUB.anim === "slurpkey") {
		BUB.thing.ork.addTags("key");
		slurp(BUB.thing.ork, time - BUB.animstart);
		if(time - BUB.animstart > 450) {
			BUB.actiondone = true;
			BUB.action = null;
			BUB.thing.ork.removeTags("key");
			BUB.inv.key++;
			inventory();
		}
	} else if(BUB.anim === "spitbub") {
		spit(BUB.thing.ork, time - BUB.animstart);
		BUB.thing.ork.addTags("bubble");
		if(time - BUB.animstart > 250) {
			BUB.thing.bubble.addInstances({
				x: screenX(BUB.pos.x),
				y: screenY(BUB.pos.y)
			});
			emptyout(BUB.pos.x, BUB.pos.y, "o");
			BUB.actiondone = true;
			BUB.action = null;
			BUB.thing.ork.removeTags("bubble");
			BUB.pos.y--;
			BUB.thing.ork.y = screenY(BUB.pos.y);
			BUB.thing.ork.$.body._offset.y = 0;
		}
	} else if(BUB.anim === "spitkey") {
		spit(BUB.thing.ork, time - BUB.animstart);
		BUB.thing.ork.addTags("key");
		if(time - BUB.animstart > 250) {
			BUB.thing.key.addInstances({
				x: screenX(BUB.pos.x),
				y: screenY(BUB.pos.y)
			});
			emptyout(BUB.pos.x, BUB.pos.y, "-");
			BUB.actiondone = true;
			BUB.action = null;
			BUB.thing.ork.removeTags("key");
			BUB.pos.y--;
			BUB.thing.ork.y = screenY(BUB.pos.y);
			BUB.thing.ork.$.body._offset.y = 0;
		}
	} else if(BUB.anim === "bonk") {
		bonk(BUB.thing.ork, time - BUB.animstart);
		if(time - BUB.animstart > 400) {
			BUB.actiondone = true;
		}
	} else {
		idle(BUB.thing.ork, time);
	}
}

function spititem() {
	if(isempty(BUB.pos.x, BUB.pos.y) && isempty(BUB.pos.x, BUB.pos.y - 1)) {
		if(BUB.inv.bub) {
			BUB.inv.bub--;
			inventory();
			BUB.anim = BUB.action = "spitbub";
		} else if(BUB.inv.key) {
			BUB.inv.key--;
			inventory();
			BUB.anim = BUB.action = "spitkey";
		}
	}
}

function handleinput(time) {
	if(!BUB.action || BUB.actiondone) {
		BUB.actiondone = false;
		if(!BUB.action) {
			BUB.animstart = time;
		}
		if(BUB.input.left) {
			BUB.thing.ork.flip(true, false);
			BUB.thing.ork.$.key.flipx = true;
			if(BUB.pos.x === 0) {
				BUB.anim = BUB.action = "bonk";
				BUB.animstart = time;
			} else {
				console.log(BUB.level[BUB.pos.y][BUB.pos.x - 1]);
				switch(BUB.level[BUB.pos.y][BUB.pos.x - 1]) {
				case "o":
					if(BUB.inv.bub + BUB.inv.key < 2) {
						BUB.thing.bubble.removeInstances({
							x: screenX(BUB.pos.x - 1),
							y: screenY(BUB.pos.y)
						});
						emptyout(BUB.pos.x - 1, BUB.pos.y);
						BUB.anim = BUB.action = "slurpbub";
					} else {
						BUB.anim = BUB.action = "bonk";
					}
					BUB.animstart = time;
					break;
				case "-":
					if(BUB.inv.bub + BUB.inv.key < 2) {
						BUB.thing.key.removeInstances({
							x: screenX(BUB.pos.x - 1),
							y: screenY(BUB.pos.y)
						});
						emptyout(BUB.pos.x - 1, BUB.pos.y);
						BUB.anim = BUB.action = "slurpkey";
					} else {
						BUB.anim = BUB.action = "bonk";
					}
					BUB.animstart = time;
					break;
				case "_":
				case "H":
				case "O":
				case "4":
				case "l":
					BUB.anim = "walk";
					BUB.action = "left";
					break;
				default:
					BUB.anim = BUB.action = "bonk";
					BUB.animstart = time;
					break;
				}
			}
		} else if(BUB.input.right) {
			BUB.thing.ork.flip(false, false);
			BUB.thing.ork.$.key.flipx = false;
			if(BUB.pos.x === 7) {
				BUB.anim = BUB.action = "bonk";
				BUB.animstart = time;
			} else {
				console.log(BUB.level[BUB.pos.y][BUB.pos.x - 1]);
				switch(BUB.level[BUB.pos.y][BUB.pos.x + 1]) {
				case "o":
					if(BUB.inv.bub + BUB.inv.key < 2) {
						BUB.thing.bubble.removeInstances({
							x: screenX(BUB.pos.x + 1),
							y: screenY(BUB.pos.y)
						});
						emptyout(BUB.pos.x + 1, BUB.pos.y);
						BUB.anim = BUB.action = "slurpbub";
					} else {
						BUB.anim = BUB.action = "bonk";
					}
					BUB.animstart = time;
					break;
				case "-":
					if(BUB.inv.bub + BUB.inv.key < 2) {
						BUB.thing.key.removeInstances({
							x: screenX(BUB.pos.x + 1),
							y: screenY(BUB.pos.y)
						});
						emptyout(BUB.pos.x + 1, BUB.pos.y);
						BUB.anim = BUB.action = "slurpkey";
					} else {
						BUB.anim = BUB.action = "bonk";
					}
					BUB.animstart = time;
					break;
				case "_":
				case "H":
				case "O":
				case "4":
				case "r":
					BUB.anim = "walk";
					BUB.action = "right";
					break;
				default:
					BUB.anim = BUB.action = "bonk";
					BUB.animstart = time;
					break;
				}
			}
		} else if(BUB.input.down) {
			if(BUB.pos.y === 7) {
				spititem();
			} else {
				switch(BUB.level[BUB.pos.y + 1][BUB.pos.x]) {
				case "H":
				case "_":
					BUB.anim = BUB.action = "climbdown";
					break;
				default:
					spititem();
					break;
				}
			}
		} else if(BUB.input.up) {
			BUB.anim = "climbup";
			BUB.action = "climbup";
		} else if(BUB.input.menu) {
			BUB.animstart = time;
//			BUB.anim = BUB.action = "slurpbub";
//			BUB.anim = BUB.action = "slurpkey";
//			BUB.anim = BUB.action = "spitbub";
//			BUB.anim = BUB.action = "spitkey";
			BUB.anim = BUB.action = "bonk";
//			BUB.action = "restart";
		} else {
			BUB.action = null;
			BUB.anim = null;
		}
	}
}

function tick(scene, time) {
	handleinput(time);
	animate(time);

	if(BUB.action === "restart") {
		if(!BUB.input.restart) {
			BUB.thing.restart.$.red._rotate = 0;
			BUB.thing.restart.$.white._rotate = 0;
			BUB.thing.restart.setTags([]);
			BUB.input.restart = false;
			BUB.action = null;
			// TODO: restart
		} else if(BUB.thing.restart.getTags().indexOf("red") >= 0) {
			BUB.thing.restart.$.red._rotate-=4;
			if(BUB.thing.restart.$.red._rotate < -180) {
				BUB.thing.restart.$.red._rotate = 0;
				BUB.thing.restart.$.white._rotate = 0;
				BUB.thing.restart.setTags([]);
				BUB.input.restart = false;
				BUB.action = null;
				// TODO: restart
			}
		} else if(BUB.thing.restart.getTags().indexOf("white") >= 0) {
			BUB.thing.restart.$.white._rotate-=4;
			if(BUB.thing.restart.$.white._rotate < -180) {
				BUB.thing.restart.$.white._rotate = 0;
				BUB.thing.restart.setTags(["red", "active"]);
			}
		} else {
			BUB.thing.restart.$.red._rotate = 0;
			BUB.thing.restart.$.white._rotate = 0;
			BUB.thing.restart.setTags(["white", "active"]);
		}
	}
}

function transitionEnd() {
	// examine state, set up next scene
	if(BUB.maskout) {
		BUB.scene.pause();
	}
	BUB.acceptinput = true;
}

function loadlevel(data) {
	var prop = {};
	var i;
	var c;

	BUB.prop.every(function(key) {
		prop[key] = [];
		return true;
	});

	// top border
	for(i = 0; i < 10; i++) {
		prop.wall.push({ x: screenX(i - 1), y: screenY(-1) });
	}

	BUB.level = [];
	// level data
	data.split("0").every(function(line, y) {
		BUB.level.push(line.replace("O", "_"));

		// left border
		prop.wall.push({ x: screenX(-1), y: screenY(y) });

		for(i = 0; i < line.length; i++) {
			c = line[i];
			switch(c) {
			case "O":
				BUB.pos.x = i;
				BUB.pos.y = y;
				break;
			case "4":
				BUB.flag.x = i;
				BUB.flag.y = y;
				break;
			default:
				if(QUICK[c] && prop[QUICK[c]]) {
					prop[QUICK[c]].push({
						x: screenX(i),
						y: screenY(y)
					});
				}
				break;
			}
		}

		// right border
		prop.wall.push({ x: screenX(8), y: screenY(y) });

		return true;
	});

	// bottom border
	for(i = 0; i < 10; i++) {
		prop.wall.push({ x: screenX(i - 1), y: screenY(8) });
	}

	Object.keys(prop).every(function(key) {
		BUB.thing[key].setInstances(prop[key].reverse());
		return true;
	});
}

function start() {
	console.log("start");
	BUB.acceptinput = true;
	BUB.scene = new penduinSCENE(BUB.canvas, BUB.width, BUB.height,
								 tick, 60);
	BUB.scene.showFPS(true);
	BUB.scene.addOBJ(BUB.thing.ork, "ork");
	BUB.scene.addOBJ(BUB.thing.flag, "flag");
	BUB.scene.setBG("silver");

	BUB.thing.ork.$["body"]._offset = BUB.thing.ork.$["body"]._offset || {};
	BUB.thing.ork.$["leg1"]._offset = BUB.thing.ork.$["leg1"]._offset || {};
	BUB.thing.ork.$["leg2"]._offset = BUB.thing.ork.$["leg2"]._offset || {};
	BUB.thing.ork.$["pupil1"]._offset = BUB.thing.ork.$["pupil1"]._offset || {};
	BUB.thing.ork.$["pupil2"]._offset = BUB.thing.ork.$["pupil2"]._offset || {};
	BUB.thing.ork.$["bubble"]._offset = BUB.thing.ork.$["bubble"]._offset || {};
	BUB.thing.ork.$["key"]._offset = BUB.thing.ork.$["key"]._offset || {};
	BUB.thing.ork.setTags(["pupil1", "pupil2"]);

	BUB.thing.flag.$["shade"]._offset = BUB.thing.flag.$["shade"]._offset || {};


	BUB.scene.addBG(BUB.thing.bg, "bg");
	BUB.thing.bg.y = 0;
	BUB.thing.bg.x = BUB.width / 2;

	BUB.scene.addOBJ(BUB.thing.restart, "restart");
	BUB.thing.restart.x = BUB.width / 2;
	BUB.thing.restart.y = BUB.height / 2;
	BUB.thing.restart.$.white._rotate = 0;
	BUB.thing.restart.$.red._rotate = 0;

	BUB.prop.every(function(block) {
		BUB.thing[block].x = 0;
		BUB.thing[block].y = 0;
		BUB.scene.addBG(BUB.thing[block], "bg" + block);
		return true;
	});

	loadlevel([
		"________",
		"_rc_____",
		"EEE_____",
		"_______4",
		"_____-EE",
		"oo_O_EEE",
		"EEEEEEEE",
		"EEEEEEEE"
	].join("0"));
/*
	loadlevel([
		"_____-_X",
		"_rH__-_X",
		"EEE_HEEE",
		"____H_X4",
		"-o__H_EE",
		"o-_OHEEE",
		"EHEEEEEE",
		"EHXX-EEE"
	].join("0"));
*/
//	loadlevel("Hc______0Hc______0HoEE____0H_c___4_0H_c__EEE0HEE__EEE0HEE__EEE0HOo__EEE");
//	loadlevel("");
//	loadlevel("_______40_EEEH__H0____H__H0__c_Hc_H0__oOHo_H0___EE___0_c______0EEcEE___");
//	loadlevel("________0_EEEEEE_0_E____E_0_E__c_E_0_EO_o4E_0_EEEEEE_0___EE___0__EEEE__");
//	loadlevel("");

	BUB.thing.ork.x = screenX(BUB.pos.x);
	BUB.thing.ork.y = screenY(BUB.pos.y);
	BUB.thing.flag.x = screenX(BUB.flag.x);
	BUB.thing.flag.y = screenY(BUB.flag.y) - 1;  // be behind ork

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

	BUB.scene.setVignette();
	//BUB.scene.setGhost(0.75);
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
//		BUB.input.restart = down;
		BUB.input.menu = down;
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