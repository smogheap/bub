BUB = {
	canvas: null,
	width: 1920,
	height: 1080,
	json: {},
	thing: {},
	scene: null
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
	BUB.thing.bubble.obj._$.bub8bit.rotate++;
	BUB.thing.ork.x+=4;
	if(BUB.thing.ork.x > BUB.width) {
		BUB.thing.ork.x = 0;
	}
}
function start() {
	console.log("start");
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
	var cbs = [
	];
	Object.keys(BUB.json).every(function(key) {
		cbs.push(function(cb) {
			BUB.thing[key] = new penduinOBJ(BUB.json[key], cb);
			return true;
		});
		return true;
	});
	combineCallbacks(cbs, null, start);
});

var mask = document.createElement("img");
mask.src = "icon16.png";
var out = true;
window.addEventListener("click", function() {
	BUB.scene.resume();
	BUB.scene.transition(new penduinTRANSITION(function() {
		if(!out) {
			BUB.scene.pause();
		}
	}, mask, 4, out));
//	}, null, null, out));
	out = !out;
});
