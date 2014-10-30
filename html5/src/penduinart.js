if(!console) {
	console = {
		log: function(str) {
		}
	};
}

function penduinOBJ(obj, cb) {
	/* internals */
	this.x = obj.x;
	this.y = obj.y;
	this.obj = obj;
	var tags = [];

	this.loadPart = function loadPart(part, cb) {
		var img;
		var i = 0;
		for(i = 0; i < part.length; i++) {
			if(part[i].image && part[i].name) {
				console.log("loading '" + part[i].name + "' (" + part[i].image + ")");
				obj._$[part[i].name] = part[i];

				if(obj._img[part[i].image] === undefined) {
					obj._img[part[i].image] = null;

					img = document.createElement("img");
					img.src = part[i].image;
					img.style.display = "none";
					obj._img[part[i].image] = img;
					img.addEventListener("load", function() {
						obj._imgLoaded++;
						if(this.loadedAll() && cb) {
							console.log("all done");
							cb();
						}
					}.bind(this), false);
					img.addEventListener("error", function(e) {
						console.error("ERROR: could not load " + e.target.src);
					}.bind(this), false);
					//document.body.appendChild(img);
				}
			}

			this.loadPart([].concat(part[i].above || [],
									part[i].below || []), cb);
		}
	},
	this.loadedAll = function loadedAll() {
		var total = 0;
		for(i in obj._img) {
			total++;
		}
		console.log("loaded " + obj._imgLoaded + " of " + total);
		return total === obj._imgLoaded;
	},

	this.drawPart = function drawPart(ctx, part, scale, displayx, displayy) {
		if((part.tag && tags.indexOf(part.tag) < 0) ||
		   (part.hidetag && tags.indexOf(part.hidetag) >= 0)) {
			// this part's tag or hidetag says to skip drawing.
			return;
		}

		var TO_RADIANS = Math.PI/180;
		var offx = 0;
		var offy = 0;
		ctx.save();

		if(displayx === undefined || displayy === undefined) {
			ctx.translate(this.x * scale, this.y * scale);
		} else {
			ctx.translate(displayx, displayy);
		}
		if(part.offset) {
			ctx.translate(part.offset.x, part.offset.y);
		}
		if(part._offset) {
			ctx.translate(part._offset.x, part._offset.y);
		}

		if(part.alpha !== undefined) {
			ctx.globalAlpha = part.alpha;
		}
		if(part.alpha !== undefined) {
			ctx.globalAlpha = part._alpha;
		}

		ctx.scale(scale || 1, scale || 1);
		if(part.scale) {
			ctx.scale(part.scale, part.scale);
		}
		if(part._scale) {
			ctx.scale(part._scale, part._scale);
		}

		if(part.pivot) {
			offx = -part.pivot.x
			offy = -part.pivot.y
		}

		if(part.rotate) {
			ctx.rotate(part.rotate * TO_RADIANS);
		}
		if(part._rotate) {
			ctx.rotate(part._rotate * TO_RADIANS);
		}

		if(part.below) {
			for(i in part.below) {
				this.drawPart(ctx, part.below[i], 1, offx, offy);
			}
		}

		if(part.image) {
			var img = obj._img[part.image];
			if(part.pivot) {
				ctx.drawImage(img, -part.pivot.x, -part.pivot.y);
			} else {
				console.log("no pivot for " + part.name);
				ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
			}
		}

		if(part.above) {
			for(i in part.above) {
				this.drawPart(ctx, part.above[i], 1, offx, offy);
			}
		}

		ctx.restore();
	};


	/* API */

	// set/replace tags (to show/hide different parts)
	this.setTags = function setTags(newTags) {
		if(typeof(newTags) === "string") {
			tags = [newTags];
		} else {
			tags = [].concat(newTags);
		}
	};

	// get a list of the current tags
	this.getTags = function getTags() {
		return tags;
	};

	// add one or more tags
	this.addTags = function addTags(newTags) {
		if(typeof(newTags) === "string") {
			tags = tags.concat([newTags]);
		} else {
			tags = tags.concat(newTags);
		}
	};

	// remove one or more tags
	this.removeTags = function removeTags(byeTags) {
		if(typeof(byeTags) === "string") {
			tags = tags.filter(function(tag) {
				return tag !== byeTags;
			});
		} else {
			for(i in byeTags) {
				tags = tags.filter(function(tag) {
					return tag !== byeTags[i];
				});
			}
		}
	};

	// clear all tags
	this.clearTags = function clearTags() {
		tags = [];
	};

	// draw the object
	this.draw = function draw(ctx, scale, displayx, displayy) {
		this.drawPart(ctx, obj, scale, displayx, displayy);
	},


	/* initialize */
	obj = obj || {};
	obj._$ = {};
	obj._img = {};
	obj._imgLoaded = 0;
	this.loadPart([obj], cb);
}

function penduinTRANSITION(cb, img, zoom, duration, rotation) {
	if(typeof(img) === "string") {
		console.log("auto-loading " + img);
		var im = document.createElement("img");
		im.addEventListener("load", function(e) {
			console.log("auto-loaded " + e.target.src);
			img = this;
		});
		im.addEventListener("error", function(e) {
			console.error("ERROR: could not load " + e.target.src);
		});
		im.src = img;
		img = null;  // use data url below until loaded
	}
	if(!img) {
		img = document.createElement("img");
		img.src = [
			"data:image/png;base64,",
			"iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAACA0AAA",
			"gNAE5VN+UAAAAB3RJTUUH3godEy0hfgAXhAAAAThJREFUOMul0z1uFEEUBOCvW7",
			"MryxnCLBmy7LXEGUwIAWfggFyBAGKLCxAg1gTIAfhHZIDXo2mSGjRYeGSJkjqZr",
			"qo3r1+94hZaaxUdlljk8w226Espw5RfJsISwR4OscYq1xf4hFNc4qaU0v4YRLyD",
			"p3iBY+zjASq+4zNO8A4f8bOU0rpUWET8Ci/xJIbj/eMYjn/1Gh+w7dLzHp5HvE7",
			"/ddLqMmcdzjm+tda+jg92iGepfFs8xU44x9F0deK8H8Jd4hG7OMARljX9r/Bw0v",
			"Mcah73ERbVf6ImJOcZVX8PzRDuBfqahG0y518hzOFHuBtc11Q9TUi+xPAubHGG9",
			"zHou1LK0Fq7TMJWkyDtTiYypPIZ3uAtrkopw1yUD/La5qI8t0xHGdW4TJucK2z/",
			"WqZ7rHOP63+t828VpGlpgl0TVwAAAABJRU5ErkJggg=="
		].join("");
	}
	duration = duration || 1000;
	if(isNaN(parseInt(zoom))) {
		zoom = 2;
	}
	if(isNaN(parseInt(rotation))) {
		rotation = rotation ? Math.PI : 0;
	}
	cb = cb || function() {};

	this.draw = function draw(ctx, timeOffset, out) {
		var prog = timeOffset / duration;
		//prog = (Math.exp(prog) - 1) / (Math.E - 1);
		if(!prog) {
			// haven't started yet
			if(!out) {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
			return false;
		} else if(prog > 1.0) {
			// done, return true
			if(out) {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
			cb();
			return true;
		}
		if(out) {
			prog = 1 - prog;
		}

		ctx.save();
		ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		ctx.scale(prog * (ctx.canvas.width / img.width * zoom),
				  prog * (ctx.canvas.width / img.width * zoom));
		if(rotation) {
			ctx.rotate(prog * rotation);
		}
		ctx.globalCompositeOperation = "destination-atop";
		ctx.drawImage(img, img.width / -2, img.height / -2);
		ctx.restore();
		return false;
	}
}

// take care of resize, pause etc
function penduinSCENE(canvas, logicWidth, logicHeight,
					  logicTickFunc, logicTicksPerSec, jaggy) {
	/* internals */
	var ctx = canvas.getContext("2d");
	var bg = "silver";
	logicWidth = logicWidth || 320;
	logicHeight = logicHeight || 240;
	var scale = 1.0;
	var objects = [];
	logicTickFunc = logicTickFunc || function() {};
	logicTicksPerSec = logicTicksPerSec || 60;
	var logicTickWait = Math.floor(1000 / logicTicksPerSec);
	var lastFrame = 0;
	var requestAnimationFrame = (window.requestAnimationFrame ||
								 window.mozRequestAnimationFrame ||
								 window.webkitRequestAnimationFrame ||
								 window.msRequestAnimationFrame);
	var frametime = 0;
	var run = false;
	var showfps = false;
	var tags = [];
	var uniq = 0;
	var trans = {
		fx: null,
		start: 0,
		out: false
	};

	this.resize = function resize() {
		canvas.width = 0;
		canvas.height = 0;

		var parent = canvas.parentElement;
		var ratio = logicWidth / logicHeight;
		var toowide = (parent.clientWidth / parent.clientHeight) > ratio;

		if(toowide) {
			canvas.width = parent.clientHeight * ratio;
			canvas.height = parent.clientHeight;
		} else {
			canvas.width = parent.clientWidth;
			canvas.height = parent.clientWidth / ratio;
		}
		ctx.mozImageSmoothingEnabled = !jaggy;
		ctx.webkitImageSmoothingEnabled = !jaggy;
		ctx.msImageSmoothingEnabled = !jaggy;
		ctx.imageSmoothingEnabled = !jaggy;

		scale = canvas.width / logicWidth;
	};

	this.render = function render(time) {
		var ticks = 0;
		if(!run) {
			return;
		}
		requestAnimationFrame(this.render.bind(this));
		if(time - lastFrame < 16) {  // 60fps max
			return;
		}

		// call logicTickFunc() at logicTicksPerSec, regardless of framerate
		if(frametime) {
			frametime += time - lastFrame;
		} else {
			frametime = time - lastFrame;
		}
		while(frametime >= logicTickWait) {
			logicTickFunc(this);
			ticks++
			frametime -= logicTickWait;
			frametime /= 1.5;  // HACK: prefer natural to exact fps
		}

		ctx.save();

		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// draw objects ordered by obj.y coordinate
		var ordered = Object.keys(objects).sort(function(a, b) {
			return a.y - b.y;
		});
		for(i in ordered) {
			objects[ordered[i]].draw(ctx, scale);
		}

		// draw any active transition
		if(trans.fx) {
			if(!trans.start) {
				trans.start = time;
			}
			if(trans.fx.draw(ctx, time - trans.start, trans.out)) {
				trans.fx = null;
				trans.start = 0;
			}
		}

		if(showfps) {
			var str = Math.floor( 1000/ (time - lastFrame) ).toString() + "fps";
			str += " " + ticks + "ticks";
			ctx.font = "20px monospace, Monaco, 'Lucida Console'";
			ctx.fillStyle = "black";
			ctx.textBaseline = "top";
			ctx.fillText(str, 3, 3);
			ctx.fillStyle = "white";
			ctx.fillText(str, 2, 2);
		}

		ctx.restore();
		lastFrame = time;
	};


	/* API */

	// add a named penduinOBJ to the scene
	this.addOBJ = function addOBJ(obj, name) {
		if(!name) {
			name = obj.name || "anonymous" + (uniq++);
		}
		objects[name] = obj;
		obj.scene = this;
		return obj;
	};
	// remove (and return) a scene object
	this.removeOBJ = function removeOBJ(name) {
		var obj = objects[name] || null;
		if(obj) {
			delete objects[name];
		}
		return obj;
	};

	// set the scene's background color
	this.setBG = function setBG(color) {
		bg = color;
	};

	// pause the scene
	this.pause = function pause() {
		run = false;
	};
	// resume the scene
	this.resume = function resume() {
		if(!run) {
			run = true;
			lastFrame = 0;
			requestAnimationFrame(this.render.bind(this));
		}
	};

	// begin a transition
	this.transition = function transition(transObj, out) {
		trans.fx = transObj;
		trans.start = 0;
		trans.out = out;
	};

	// show frames per second (true or false)
	this.showFPS = function showFPS(show) {
		showfps = show;
	};

	/* FIXME: duplicate of penduinOBJ code */
	// set/replace tags (to show/hide different parts)
	this.setTags = function setTags(newTags) {
		if(typeof(newTags) === "string") {
			tags = [newTags];
		} else {
			tags = [].concat(newTags);
		}
	};

	// get a list of the current tags
	this.getTags = function getTags() {
		return tags;
	};

	// add one or more tags
	this.addTags = function addTags(newTags) {
		if(typeof(newTags) === "string") {
			tags = tags.concat([newTags]);
		} else {
			tags = tags.concat(newTags);
		}
	};

	// remove one or more tags
	this.removeTags = function removeTags(byeTags) {
		if(typeof(byeTags) === "string") {
			tags = tags.filter(function(tag) {
				return tag !== byeTags;
			});
		} else {
			for(i in byeTags) {
				tags = tags.filter(function(tag) {
					return tag !== byeTags[i];
				});
			}
		}
	};

	// clear all tags
	this.clearTags = function clearTags() {
		tags = [];
	};


	/* initialize */
	run = true;
	this.resize();
	window.addEventListener("resize", this.resize.bind(this), false);
	requestAnimationFrame(this.render.bind(this));
}


// leaving this here for now, probably dump it though.
function _penduinART(game) {
	this.game = {};
	this.scene = {};
	this.state = {};
	this.blankgame = {
		"title": "sample penduinART game",
		"width": 320,
		"height": 240
	};

	this.init = function init(game) {
		this.canvas = document.querySelector("canvas");
		this.ctx = this.canvas.getContext("2d");

		if(this.initialized) {
			this.load(game);
			return;
		}

		window.addEventListener("resize", this.resize.bind(this), false);
		var requestAnimationFrame = (window.requestAnimationFrame ||
									 window.mozRequestAnimationFrame ||
									 window.webkitRequestAnimationFrame ||
									 window.msRequestAnimationFrame);
		window.requestAnimationFrame = requestAnimationFrame;

		this.load(game);
		this.initialized = true;
	};

	this.resize = function resize() {
		this.canvas.width = 0;
		this.canvas.height = 0;

		var parent = this.canvas.parentElement;
		var ratio = this.game.width / this.game.height;
		var toowide = (parent.clientWidth / parent.clientHeight) > ratio;

		if(toowide) {
			this.canvas.width = parent.clientHeight * ratio;
			this.canvas.height = parent.clientHeight;
		} else {
			this.canvas.width = parent.clientWidth;
			this.canvas.height = parent.clientWidth / ratio;
		}

		this.render();
	};

	this.load = function load(game) {
		if(game) {
			this.game = game;
		} else {
			this.game = this.blankgame;
		}
		window.document.title = this.game.title;
		if(this.game.custom && typeof(this.game.custom) === "function") {
			this.game.custom();
		}
		if(this.game.animation && this.game.animation.load) {
			var l = this.game.animation.load;

			if(l.custom && typeof(l.custom) === "function") {
				l.custom();
			}
		}
	};

	this.init(game);
};
