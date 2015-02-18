if(!console) {
	console = {
		log: function(str) {
		}
	};
}

function penduinOBJ(obj, cb) {
	/* consumer-available stuff */
	this.x = obj.x;
	this.y = obj.y;
	this.obj = obj;
	this.$ = {};  // hash of part names for direct manipulation

	/* internal stuff */
	var TO_RADIANS = Math.PI / 180;
	var tags = [];
	var pose = null;
	var anim = null;
	var animstart = 0;
	var frompose = null;
	var lastsolved = null;
	var posetime = 0;
	var instances = null;
	var dirty = false;

	var loadPart = function loadPart(part, cb) {
		dirty = true;
		var img;
		var i = 0;
		var $ = this.$;
		for(i = 0; i < part.length; i++) {
			if(part[i].image && part[i].name) {
				console.log("loading '" + part[i].name + "' (" + part[i].image + ")");
				$[part[i].name] = part[i];

				if(obj._img[part[i].image] === undefined) {
					obj._img[part[i].image] = null;

					img = document.createElement("img");
					img.src = part[i].image;
					img.style.display = "none";
					obj._img[part[i].image] = img;
					img.addEventListener("load", function(e) {
						//e.target.removeEventListener("load", this);
						obj._imgLoaded++;
						if(loadedAll() && cb) {
							console.log("all done");
							obj.pose = obj.pose || {};
							obj.pose["_default"] = capturePose();
							lastsolved = capturePose();
							cb();
						}
					}.bind(this), false);
					img.addEventListener("error", function(e) {
						console.error("ERROR: could not load " + e.target.src);
					}.bind(this), false);
					//document.body.appendChild(img);
				}
			}

			loadPart.bind(this)([].concat(part[i].above || [],
							   part[i].below || []), cb);
		}
	}.bind(this);
	var loadedAll = function loadedAll() {
		var total = 0;
		for(i in obj._img) {
			total++;
		}
		console.log("loaded " + obj._imgLoaded + " of " + total);
		if(obj._imgLoaded > total) {
			console.log("greater, why?", obj);
		}
		return total === obj._imgLoaded;
	};

	var drawPart = function drawPart(ctx, part, scale, displayx, displayy,
									 instance) {
		if((part.tag && tags.indexOf(part.tag) < 0) ||
		   (part.hidetag && tags.indexOf(part.hidetag) >= 0)) {
			// this part's tag or hidetag says to skip drawing.
			return;
		}

		if(instance && instances && instances.length) {
			instances.every(function(ins) {
				// FIXME: not quite right if scale/x/y are 0
				drawPart(ctx, part,
						 ins.scale || scale,
						 ins.x || displayx,
						 ins.y || displayy,
						 false);
				return true;
			}, this);
			return;
		}

		var offx = 0;
		var offy = 0;
		ctx.save();

		if(isNaN(displayx) || isNaN(displayy)) {
			ctx.translate(this.x * scale, this.y * scale);
		} else {
			ctx.translate(displayx * scale, displayy * scale);
		}
		if(part.offset) {
			ctx.translate(part.offset.x, part.offset.y);
		}
		if(part._offset) {
			ctx.translate(part._offset.x || 0, part._offset.y || 0);
		}

		if(!isNaN(part.alpha)) {
			ctx.globalAlpha = part.alpha;
		}
		if(!isNaN(part._alpha)) {
			ctx.globalAlpha = part._alpha;
		}

		ctx.scale(scale || 1, scale || 1);
		if(part.scale) {
			ctx.scale(part.scale, part.scale);
		}
		if(part._scale) {
			ctx.scale(part._scale, part._scale);
		}
		if(part.flipx) {
			ctx.scale(-1, 1);
		}
		if(part.flipy) {
			ctx.scale(1, -1);
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

		part.below && part.below.every(function partbelow(part) {
			drawPart(ctx, part, 1, offx, offy);
			return true;
		});
/*
		if(part.below) {
			for(i in part.below) {
				drawPart(ctx, part.below[i], 1, offx, offy);
			}
		}
*/

		if(part.image) {
			var img = obj._img[part.image];
			if(part.pivot) {
				ctx.drawImage(img, -part.pivot.x, -part.pivot.y);
			} else {
				console.log("no pivot for " + part.name);
				ctx.drawImage(img, -(img.width / 2), -(img.height / 2));
			}
		}

		part.above && part.above.every(function partabove(part) {
			drawPart(ctx, part, 1, offx, offy);
			return true;
		});
/*
		if(part.above) {
			for(i in part.above) {
				drawPart(ctx, part.above[i], 1, offx, offy);
			}
		}
		*/

		ctx.restore();
	}.bind(this);

	var lerp = function lerp(from, to, prog) {
		return (1 - prog) * from + prog * to;
	};

	var lerpPose = function lerpPose(dest, src1, src2, prog) {
		dest = dest || {};
		Object.keys(src1).every(function(key) {
			dest[key] = dest[key] || {};
			if(!isNaN(src1[key].alpha) && !isNaN(src2[key].alpha)) {
				dest[key].alpha = lerp(src1[key].alpha, src2[key].alpha, prog);
			}
			if(!isNaN(src1[key].scale) && !isNaN(src2[key].scale)) {
				dest[key].scale = lerp(src1[key].scale, src2[key].scale, prog);
			}
			if(!isNaN(src1[key].rotate) && !isNaN(src2[key].rotate)) {
				dest[key].rotate = lerp(src1[key].rotate, src2[key].rotate,
										prog);
			} else {
				console.log(key, src1, src2);
			}
			if(src1[key].offset && src2[key].offset) {
				dest[key].offset = dest[key].offset || {};
				if(!isNaN(src1[key].offset.x) && !isNaN(src2[key].offset.x)) {
					dest[key].offset.x = lerp(src1[key].offset.x,
											  src2[key].offset.x, prog);
				}
				if(!isNaN(src1[key].offset.y) && !isNaN(src2[key].offset.y)) {
					dest[key].offset.y = lerp(src1[key].offset.y,
											  src2[key].offset.y, prog);
				}
			}
			return true;
		});
		return dest;
	};

	var capturePose = function capturePose(user) {
		var posedata = {};
		var data = null;
		Object.keys(this.$).every(function(key) {
			posedata[key] = posedata[key] || {};
			if((data = this.$[key])) {
				if(user) {
					posedata[key] = {};
					posedata[key].alpha = data.alpha;
					posedata[key].scale = data.scale;
					posedata[key].rotate = data.rotate;
					if(data.offset) {
						posedata[key].offset = posedata[key].offset || {};
						posedata[key].offset.x = data.offset.x;
						posedata[key].offset.y = data.offset.y;
					}
				} else {
					posedata[key].alpha = (isNaN(data._alpha) ?
										   1 : data._alpha);
					posedata[key].scale = (isNaN(data._scale) ?
										   1 : data._scale);
					posedata[key].rotate = (isNaN(data._rotate) ?
											1 : data._rotate);
					posedata[key].offset = posedata[key].offset || {};
					if(data._offset) {
						posedata[key].offset.x = data._offset.x;
						posedata[key].offset.y = data._offset.y;
					} else {
						posedata[key].offset.x = 0;
						posedata[key].offset.y = 0;
					}
				}
			} else {
				console.log("capturePose: no data in key " + key);
			}
			return true;
		}.bind(this));
		return posedata;
	}.bind(this);

	var applyPose = function applyPose(posedata, user) {
		var data = null;
		var part = null;
		Object.keys(this.$).every(function(key) {
			var part = this.$[key];
			if(user) {
				if(posedata && (data = posedata[key])) {
					part.alpha = data.alpha;
					part.scale = data.scale;
					part.rotate = data.rotate;
					part.offset = part.offset || {};
					if(data.offset) {
						part.offset.x = data.offset.x;
						part.offset.y = data.offset.y;
					}
				} else {
					part.alpha = 1;
					part.scale = 0;
					part.rotate = 0;
					part.offset = part.offset || {};
					part.offset.x = 0;
					part.offset.y = 0;
				}
			} else {
				if(posedata && (data = posedata[key])) {
					part._alpha = data.alpha;
					part._scale = data.scale;
					part._rotate = data.rotate;
					part._offset = part._offset || {};
					if(data._offset) {
						part._offset.x = data.offset.x;
						part._offset.y = data.offset.y;
					}
				} else {
					part._alpha = 1;
					part._scale = 0;
					part._rotate = 0;
					part._offset = part.offset || {};
					part._offset.x = 0;
					part._offset.y = 0;
				}
			}
			return true;
		}.bind(this));
	}.bind(this);

	var solvePose = function solvePose(now) {
		now = now || new Date();
		var prog = 0;

		if(anim) {
			//TODO
		} else if(pose) {
			if(posetime) {
				if(now - animstart >= posetime) {
					// finished
					applyPose(obj.pose[pose]);
					animstart = 0;
					posetime = 0;
				} else {
					// interpolate
					prog = (now - animstart) / posetime;
					lerpPose(lastsolved, frompose, obj.pose[pose], prog);
					applyPose(lastsolved);
				}
			}
		}
	};

	/* initialize */
	obj = JSON.parse(JSON.stringify(obj));  // prevent dupes/refs between objs
	obj._img = {};
	obj._imgLoaded = 0;
	loadPart([obj], cb);


	/* API */

	/* API: INSTANCES */
	// set to null or array of {scale:1, x:2, y:3} instances
	this.setInstances = function setInstances(arr) {
		dirty = true;
		instances = arr;
	};
	this.addInstances = function addInstances(newInst) {
		dirty = true;
		if(typeof(newInst) === "object") {
			instances.push(newInst);
		} else {
			instances = instances.concat(newInst);
		}
	};
	this.removeInstances = function removeInstances(byeInst) {
		dirty = true;
		if(typeof(byeInst) === "object") {
			byeInst = [byeInst];
		}
		byeInst.every(function(inst) {
			instances = instances.filter(function(item) {
				return !(item.x === inst.x && item.y === inst.y);
			});
			return true;
		});
	};

	/* API: TAGS */

	// set/replace tags (to show/hide different parts)
	this.setTags = function setTags(newTags) {
		dirty = true;
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
		dirty = true;
		if(typeof(newTags) === "string") {
			tags = tags.concat([newTags]);
		} else {
			tags = tags.concat(newTags);
		}
	};

	// remove one or more tags
	this.removeTags = function removeTags(byeTags) {
		dirty = true;
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
		dirty = true;
		tags = [];
	};

	/* API: POSING */

	//flip x/y
	this.flip = function flip(x, y) {
		dirty = true;
		obj.flipx = x;
		obj.flipy = y;
	};

	// animate to a pose specified by name
	this.setPose = function setPose(name, transtime) {
		dirty = true;
		pose = name || "_default";
		if(isNaN(transtime)) {
			transtime = 500;
		}
		animstart = 0;
		posetime = 0;
		frompose = capturePose();
		requestAnimationFrame(function(time) {
			animstart = time;
			posetime = transtime;
		});
	};

	// get and set full pose data
	this.getPoseData = function getPoseData() {
		return capturePose(true);
	};
	this.setPoseData = function setPoseData(data) {
		dirty = true;
		return applyPose(data, true);
	};

	/* API: ANIMATION */
	// TODO: implement animations :^)
	// set an animation
	this.setAnimation = function setAnimation(name, transtime, now) {
		dirty = true;
		if(isNaN(transtime)) {
			transtime = 500;
		}
		anim = name;
		animstart = now || new Date();
		frompose = capturePose();
	},

	/* API: MISC */

	// check (and clear) if object is dirty (changed since last checked)
	this.wasDirty = function wasDirty() {
		if(dirty) {
			dirty = false;
			return true;
		}
		return false;
	};

	// draw the object
	this.draw = function draw(ctx, scale, displayx, displayy, time) {
		if(time) {
			solvePose(time);
		}
		drawPart(ctx, obj, scale, displayx, displayy, true);
	};
}

function penduinTRANSITION(cb, img, zoom, duration, rotation) {
	var scratchCtx = document.createElement("canvas").getContext("2d");
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

		// some canvas implementations won't blot outer area without scratch
		scratchCtx.canvas.width = ctx.canvas.width;
		scratchCtx.canvas.height = ctx.canvas.height;
		scratchCtx.mozImageSmoothingEnabled = ctx.mozImageSmoothingEnabled;
		scratchCtx.webkitImageSmoothingEnabled =ctx.webkitImageSmoothingEnabled;
		scratchCtx.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
		scratchCtx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
		scratchCtx.scale((prog * prog) * (ctx.canvas.width / img.width * zoom),
						 (prog * prog) * (ctx.canvas.width / img.width * zoom));
		if(rotation) {
			scratchCtx.rotate(prog * rotation);
		}
		scratchCtx.drawImage(img, img.width / -2, img.height / -2);

		ctx.save();
		ctx.globalCompositeOperation = "destination-atop";

		ctx.drawImage(scratchCtx.canvas, 0, 0);

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
	logicWidth = logicWidth || canvas.width || 320;
	logicHeight = logicHeight || canvas.height || 240;
	var scale = 1.0;
	var redrawbg = false;
	var bgcanv = {};
	var bgcompcanv = null;
	var backgrounds = {};
	var objects = {};
	var vignette = null;
	var ghostAmount = 0;
	var ghostCtx = document.createElement("canvas").getContext("2d");
	logicTickFunc = logicTickFunc || function() {};
	logicTicksPerSec = logicTicksPerSec || 60;
	var logicTickWait = Math.floor(1000 / logicTicksPerSec);
	var lastFrame = 0;
	var requestAnimationFrame = (window.requestAnimationFrame ||
								 window.mozRequestAnimationFrame ||
								 window.webkitRequestAnimationFrame ||
								 window.msRequestAnimationFrame);
	requestAnimationFrame = requestAnimationFrame || function(cb) {
		setTimeout(cb, 10, new Date());
	};
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
		redrawbg = true;
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
		this.setJaggy(jaggy);

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
			logicTickFunc(this, time);
			ticks++
			frametime -= logicTickWait;
			frametime /= 1.5;  // HACK: prefer natural to exact fps
		}

		ctx.save();

		// prepare any ghosting
		if(ghostAmount) {
			ghostCtx.canvas.width = canvas.width;
			ghostCtx.canvas.height = canvas.height;
			ghostCtx.mozImageSmoothingEnabled = ctx.mozImageSmoothingEnabled;
			ghostCtx.webkitImageSmoothingEnabled =ctx.webkitImageSmoothingEnabled;
			ghostCtx.imageSmoothingEnabled = ctx.imageSmoothingEnabled;
			ghostCtx.drawImage(ctx.canvas, 0, 0, ghostCtx.canvas.width, ghostCtx.canvas.height);
		}

		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// update backgrounds if necessary then draw
		var bgctx = null;
		Object.keys(backgrounds).every(function(key) {
			if(backgrounds[key].wasDirty()) {
				console.log("dirty bg '" + key + "'");
				redrawbg = true;
				return false;
			}
			return true;
		});
		if(redrawbg) {
			redrawbg = false;
			bgcompcanv = bgcompcanv || document.createElement("canvas");
			bgcompcanv.width = canvas.width;
			bgcompcanv.height = canvas.height;
			Object.keys(backgrounds).every(function(key) {
				bgcanv[key] = bgcanv[key] || document.createElement("canvas");
				bgcanv[key].width = canvas.width;
				bgcanv[key].height = canvas.height;
				bgctx = bgcanv[key].getContext("2d");
				backgrounds[key].draw(bgctx, scale, undefined, undefined, time);

				bgctx = bgcompcanv.getContext("2d");
				backgrounds[key].draw(bgctx, scale, undefined, undefined, time);
				return true;
			});
		}
		ctx.drawImage(bgcompcanv, 0, 0);
/*
		// TODO: background offset and layered scrolling support
		Object.keys(backgrounds).every(function(key) {
			ctx.drawImage(bgcanv[key], 0, 0);
			return true;
		});
*/

		// draw objects ordered by obj.y coordinate
		var ordered = Object.keys(objects).sort(function(a, b) {
			return objects[a].y - objects[b].y;
		});
		for(i in ordered) {
			objects[ordered[i]].draw(ctx, scale, undefined, undefined, time);
		}

		// draw any vignette
		if(vignette) {
			ctx.drawImage(vignette, 0, 0, canvas.width, canvas.height);
		}

		// draw any ghosting
		if(ghostAmount) {
			ctx.globalAlpha = ghostAmount;
			ctx.drawImage(ghostCtx.canvas, 0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;
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
			obj.scene = null;
		}
		return obj;
	};

	// add a named penduinOBJ to the scene as a background layer
	this.addBG = function addBG(bg, name) {
		if(!name) {
			name = bg.name || "anonymous" + (uniq++);
		}
		backgrounds[name] = bg;
		bg.scene = this;
		return bg;
	};
	// remove (and return) a scene background
	this.removeBG = function removeBG(name) {
		var bg = backgrounds[name] || null;
		if(bg) {
			delete backgrounds[name];
			bg.scene = null;
		}
		bg = bgcanv[name] || null;
		if(bg) {
			delete bgcanv[name];
		}
		return bg;
	};

	// set the scene's background color
	this.setBG = function setBG(color) {
		bg = color;
	};

	// set the scene's vignette (or null, or default)
	this.setVignette = function setVignette(img) {
		if(img === null) {
			vignette = null;
			return;
		} else if(img) {
			vignette = img;
		} else {
			vignette = document.createElement("img");
			vignette.src = [
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAA",
				"ABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wINFwMGfDHM",
				"5AAAAfdJREFUWMPFV9FuwzAIPBy3/cn9/z9sbcxe7IqgA7PtYZZQoybKHYe",
				"5GAHwAeALwOf8XfEC8Jy/p4kBQE0AgJhoAA4THcBt/t5NPADcOwF/OvCXA9",
				"8RUHIf5rnL6gTcxkkI6IbAmCrY+57IhYAF/ypmP4LsWqCCfVYZgedGektgm",
				"Bd5BVj2bAkj4MFfBjirPxwJJfIzMgpAuwFj4J6AFghItf4ApCfATPoqAQlq",
				"Lv66k53uQUdB/gXECFhypyfbg6wr2e96fGw24ZtANfNRqK06RxxBiU5PYCf",
				"3LnsL7muvJgFvWGcnWTLwEbSXl1VdCRp5j1VHGgFBwcUiBUCeZ8SH9QFNgJ",
				"mZ7BQQ55DpO1sCgIKR7JYmKilmLf51NdciCEzktyt6l1gnFHLD+7q4VtOAm",
				"AQJMZuW1QXivuWZr0uiigR+z4CbNaJmWsO2pSSulingE/L/NXvd58FRiWlo",
				"sjck+RZIEI3EYQlkdstcDZvPcQR6OTX3uRG1cIwahe6IwI8gOlMACaGfHEj",
				"SzGfixxoakJxc5Q8EjgB4xc2WYGcmUjyUisu4MeB1vcYlSWp6kqN3dCzHRv",
				"IF/o5FoPLh8Z6QDSaegM98Ebh7ApmTnab/WzKaCQE/fOZrSO1zSq3UX4rDa",
				"Zb9BRzAgymAZIOdwfRTHc9vfjz/BqyPaNTRmnliAAAAAElFTkSuQmCC"
			].join("");
		}
	};

	// set scene ghosting amount
	this.setGhost = function setGhost(amount) {
		ghostAmount = amount;
	};

	// set whether the scaling is jaggy or smooth
	this.setJaggy = function setJaggy(jag) {
		jaggy = jag;
		ctx.mozImageSmoothingEnabled = !jaggy;
		ctx.webkitImageSmoothingEnabled = !jaggy;
		ctx.msImageSmoothingEnabled = !jaggy;
		ctx.imageSmoothingEnabled = !jaggy;
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
