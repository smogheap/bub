BUB = {
	canvas: null,
	width: 1920,
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

function tick(scene) {
	BUB.thing.bubble.$.bub8bit.rotate++;
	BUB.thing.ork.x+=4;
	if(BUB.thing.ork.x > BUB.width) {
		BUB.thing.ork.x = 0;
	}
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
								 tick, 60, true);
	BUB.scene.showFPS(true);
	BUB.scene.addOBJ(BUB.thing.ork);
	BUB.scene.addOBJ(BUB.thing.bubble);
	BUB.scene.setBG("silver");
	BUB.thing.ork.x = 300;
	BUB.thing.ork.y = 300;
	BUB.thing.bubble.x = 400;
	BUB.thing.bubble.y = 400;

	BUB.thing.ork.setTags("8bit");
	BUB.thing.bubble.setTags("8bit");

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
