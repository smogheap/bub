BUB = {
	canvas: null,
	width: 1080,
	height: 1080,
	json: {},
	thing: {},
	scene: null,
	mask: {
		ork: "image/mask/ork.png",
		orkup: "image/mask/orkup.png",
		orkdown: "image/mask/orkdown.png",
		bubble: { src: "image/mask/bubble.png", zoom: 2}
	},
	maskout: false,
	acceptinput: false
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

function idle() {
//	BUB.thing.ork.$["ork"]
}


function tick(scene, time) {
//	BUB.thing.bubble.$.bub8bit.rotate++;
/*
	BUB.thing.ork.x+=4;
	if(BUB.thing.ork.x > BUB.width) {
		BUB.thing.ork.x = 0;
	}
*/


	//draw bg?
//	BUB.thing.wall.draw(BUB.thing.wall);


	//idle animation
	BUB.thing.ork.$["body"]._offset = BUB.thing.ork.$["body"]._offset || {};
	BUB.thing.ork.$["pupil1"]._offset = BUB.thing.ork.$["pupil1"]._offset || {};
	BUB.thing.ork.$["pupil2"]._offset = BUB.thing.ork.$["pupil2"]._offset || {};

	BUB.thing.ork.$["body"]._offset.x = (Math.cos(time / 300) * 14);
	BUB.thing.ork.$["body"]._offset.y = (Math.cos(time / 150) * 1);

	BUB.thing.ork.$["snout"]._rotate = (Math.sin(time / 300) * -2);
	BUB.thing.ork.$["mouth"]._rotate = (Math.cos(time / 300) * 2);

	BUB.thing.ork.$["leg1"]._rotate = (Math.cos(time / 300) * 5);
	BUB.thing.ork.$["foot1"]._rotate = (Math.cos(time / 300) * -5);
	BUB.thing.ork.$["leg2"]._rotate = (Math.cos(time / 300) * 5);
	BUB.thing.ork.$["foot2"]._rotate = (Math.cos(time / 300) * -5);

	BUB.thing.ork.$["hair1"]._rotate = (Math.sin(time / 300) * 3);
	BUB.thing.ork.$["hair2"]._rotate = (Math.sin(time / 300) * 6);

/*
	BUB.thing.ork.$["pupil1"]._offset.x = (Math.cos(time / 200) * 10);
	BUB.thing.ork.$["pupil1"]._offset.y = (Math.cos(time / 300) * 10);
	BUB.thing.ork.$["pupil2"]._offset.x = (Math.cos(time / 500) * 10);
	BUB.thing.ork.$["pupil2"]._offset.y = (Math.cos(time / 400) * 10);
*/

	//wave the flag
	BUB.thing.flag.$["shade"]._offset = BUB.thing.flag.$["shade"]._offset || {};
	BUB.thing.flag.$["1"]._rotate = -1 + (Math.cos(time / 200) * 4); //3
	BUB.thing.flag.$["2"]._rotate = 2 + (Math.sin(time / 200) * 7);  //5
	BUB.thing.flag.$["3"]._rotate = 0 - (Math.cos(time / 200) * 12);  //8
	BUB.thing.flag.$["shade"]._offset.x = 15 + (Math.cos(time / 200) * 20);
	BUB.thing.flag.$["shade"]._alpha = 1 + Math.sin(time / -200);
}

function transitionEnd() {
	// examine state, set up next scene
	if(BUB.maskout) {
		BUB.scene.pause();
	}
	BUB.acceptinput = true;
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

	BUB.thing.ork.x = 128 + (119 * 1);
	BUB.thing.ork.y = 178 + (122 * 7);
	BUB.thing.flag.x = 128 + (119 * 6);
	BUB.thing.flag.y = 178 + (122 * 7);

	BUB.thing.wall.x = 0;
	BUB.thing.wall.y = 0;
	BUB.scene.addOBJ(BUB.thing.wall, "wall");
	var walls = [];
	var i;
	for(i = 0; i < 10; i++) {
		walls.push({x: 9 + (i * 119), y: 56 + (9 * 122)});
	}
	for(i = 8; i > 0; i--) {
		walls.push({x: 9, y: 56 + (i * 122)});
		walls.push({x: 9 + (9 * 119), y: 56 + (i * 122)});
	}
	for(i = 0; i < 10; i++) {
		walls.push({x: 9 + (i * 119), y: 56});
	}
/*
	for(i = 0; i < 8; i++) {
		for(j = 8; j > 0; j--) {
			walls.push({x: 128 + (i * 119), y: 56 + (j * 122)});
		}
	}
*/
	BUB.thing.wall.setInstances(walls);

	BUB.scene.addOBJ(BUB.thing.bg, "bg");
	BUB.thing.bg.y = -1;
	BUB.thing.bg.x = BUB.width / 2;


//	BUB.thing.ork.setTags(["straight", "straightb", "pupil", "pupilb"]);
//	BUB.thing.flag.setTags("8bit");



//	BUB.thing.ork.flip(true, false);
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
					BUB.mask[key] = new penduinTRANSITION(transitionEnd, mask, 4);
				} else if(BUB.mask[key].src && BUB.mask[key].zoom) {
					BUB.mask[key] = new penduinTRANSITION(transitionEnd, mask,
														  BUB.mask[key].zoom);
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
