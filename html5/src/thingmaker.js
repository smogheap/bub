var TM = {
	pieces: [],
	thing: {},
	asm: null,
	asmCtx: null,
	json: null,
	obj: null,
	pose: null,
	tempPoseData: {},
	poseData: {},
	poseCtx: null,
	poseObj: null
};


function render() {
	var scale = parseFloat(document.querySelector("#scale").value);
	TM.asm.width = TM.asm.width;
	TM.asmCtx.fillStyle = "green";
	TM.asmCtx.fillRect(0, 0, TM.asm.width, TM.asm.height);
	TM.obj.draw(TM.asmCtx, scale, 320, 300);
	crosshair(TM.asmCtx, 320, 300);

	TM.pose.width = TM.pose.width;
	TM.poseCtx.fillStyle = "blue";
	TM.poseCtx.fillRect(0, 0, TM.pose.width, TM.pose.height);
	TM.poseObj.draw(TM.poseCtx, scale, 320, 300);
	crosshair(TM.poseCtx, 320, 300);
}

function updateData() {
	TM.thing = {
		"above": [],
		"below": []
	};
	var buildThing = null;
	buildThing = function(thing) {
		var i = 0;
		var p = null;
		var piece = null;
		for(i = 0; i < TM.pieces.length; i++) {
			p = TM.pieces[i];
			piece = {
				name: p.name,
				image: p.image,
				pivot: p.pivot || {
					x: 0,
					y: 0
				},
				rotate: p.rotate || 0,
				scale: (p.scale === undefined) ? 1 : p.scale,
				alpha: (p.alpha === undefined) ? 1 : p.alpha,
				offset: p.offset || {
					x: 0,
					y: 0
				}
			};
			if(!p.layer) {
				continue;
			}
			thing.above = thing.above || [];
			thing.below = thing.below || [];
			if((p.parent === thing.name) ||
			   (!p.parent && !thing.name)) {
				thing[p.layer].push(piece);
				buildThing(piece);
			}
		}
	};
	buildThing(TM.thing);
	TM.thing.pose = TM.poseData;

	TM.json.value = JSON.stringify(TM.thing, null, "\t");

	TM.obj = new penduinOBJ(TM.thing, render);
	TM.poseObj = new penduinOBJ(TM.thing, render);

	var poselist = document.getElementById("poselist");
	var sel = poselist.value;
	var i = 0;
	var opt = null;
	while(poselist.firstChild) {
		poselist.removeChild(poselist.firstChild);
	}
	opt = document.createElement("option");
	opt.value = "";
	opt.innerHTML = "(neutral)";
	poselist.appendChild(opt);
	for(i in TM.poseData) {
		opt = document.createElement("option");
		opt.value = i;
		opt.innerHTML = i;
		if(sel === opt.value) {
			opt.selected = true;
		}
		poselist.appendChild(opt);
	}
}

function crosshair(ctx, x, y) {
	ctx.save();
	ctx.moveTo(x, y);
	ctx.strokeStyle = "yellow";
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.fillRect(x - 5, y - 5, 10, 10);
	ctx.moveTo(x - 15, y);
	ctx.lineTo(x + 15, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y - 15);
	ctx.lineTo(x, y + 15);
	ctx.stroke();
	ctx.restore();
}

function buildPieceUI(piece) {
	piece.layer = piece.layer || "above";

	var dom = document.createElement("div");
	dom.className = "pieceUI";

	var canv = document.createElement("canvas");
	canv.style.cursor = "crosshair";
	canv.width = piece.gpx.width;
	canv.height = piece.gpx.height;
	dom.appendChild(canv);

	var info = document.createElement("span");

	var ctx = canv.getContext("2d");
	var click = function(evt) {
		var x = evt.clientX;
		var y = evt.clientY;
		if(!evt.fake) {
			x -= this.getBoundingClientRect().left;
			x -= this.clientLeft + this.scrollLeft;
			y -= this.getBoundingClientRect().top;
			y -= this.clientTop + this.scrollTop;
		}
		x = Math.floor(x);
		y = Math.floor(y);

		canv.width = canv.width;
		ctx.drawImage(piece.gpx, 0, 0);
		crosshair(ctx, x, y);

		piece.pivot.x = x;
		piece.pivot.y = y;
		info.querySelector(".pivotx").value = x;
		info.querySelector(".pivoty").value = y;
		updateData();
	};
	canv.addEventListener("click", click);

	var input = null;
	info.style.display = "inline-block";
	info.style.verticalAlign = "top";
	info.appendChild(document.createTextNode("name:"));
	input = document.createElement("input");
	input.className = "name";
	input.value = piece.name;
	input.addEventListener("change", function(evt) {
		var basename = this.value;
		var suf = 0;
		var names = [];
		var i = 0;
		for(i = 0; i < TM.pieces.length; i++) {
			names.push(TM.pieces[i].name);
		}
		var name = basename;
		while(names.indexOf(name) >= 0) {
			suf++;
			name = basename + suf;
		}
		piece.name = name;
		this.value = name;
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("pivot x:"));
	input = document.createElement("input");
	input.className = "pivotx";
	input.value = piece.pivot.x;
	input.addEventListener("change", function(evt) {
		piece.pivot.x = this.value;
//		updateData();
		click.bind(canv)({fake: true,
						  clientX: piece.pivot.x, clientY: piece.pivot.y});
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("pivot y:"));
	input = document.createElement("input");
	input.className = "pivoty";
	input.value = piece.pivot.y;
	input.addEventListener("change", function(evt) {
		piece.pivot.y = this.value;
//		updateData();
		click.bind(canv)({fake: true,
						  clientX: piece.pivot.x, clientY: piece.pivot.y});
	});
	info.appendChild(input);

	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("rotate:"));
	input = document.createElement("input");
	input.className = "rotate";
	input.value = piece.rotate;
	input.addEventListener("change", function(evt) {
		piece.rotate = parseInt(this.value);
		updateData();
	});
	info.appendChild(input);

	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("scale:"));
	input = document.createElement("input");
	input.className = "scale";
	input.value = piece.scale;
	input.addEventListener("change", function(evt) {
		piece.scale = parseFloat(this.value);
		updateData();
	});
	info.appendChild(input);

	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("alpha:"));
	input = document.createElement("input");
	input.className = "alpha";
	input.value = piece.alpha;
	input.addEventListener("change", function(evt) {
		piece.alpha = parseFloat(this.value);
		updateData();
	});
	info.appendChild(input);

	var select = null;
	var option = null;
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("appears:"));
	select = document.createElement("select");
	option = document.createElement("option");
	option.value = option.innerHTML = "above";
	if(piece.layer === "above") {
		option.selected = true;
	}
	select.appendChild(option);
	option = document.createElement("option");
	option.value = option.innerHTML = "below";
	if(piece.layer === "below") {
		option.selected = true;
	}
	select.appendChild(option);
	select.addEventListener("change", function(evt) {
		piece.layer = this.value;
		updateData();
	});
	info.appendChild(select);
	info.appendChild(document.createTextNode(" parent:"));
	select = document.createElement("select");
	select.className = "parent";
	option = document.createElement("option");
	option.value = option.innerHTML = "(root)";
	if(!piece.parent) {
		option.selected = true;
	}
	select.appendChild(option);
	var i = 0;
	for(i = 0; i < TM.pieces.length; i++) {
		if(piece.name === TM.pieces[i].name) {
			continue;
		}
		option = document.createElement("option");
		option.value = option.innerHTML = TM.pieces[i].name;
		if(piece.parent === TM.pieces[i].name) {
			option.selected = true;
		}
		select.appendChild(option);
	}
	select.addEventListener("change", function(evt) {
		piece.parent = this.value !== "(root)" ? this.value : null;
		updateData();
	});
	info.appendChild(select);

	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("offset x:"));
	input = document.createElement("input");
	input.className = "offsetx";
	input.value = piece.offset.x;
	input.addEventListener("change", function(evt) {
		piece.offset.x = this.value;
		updateData();
	});
	info.appendChild(input);
	info.appendChild(document.createElement("br"));
	info.appendChild(document.createTextNode("offset y:"));
	input = document.createElement("input");
	input.className = "offsety";
	input.value = piece.offset.y;
	input.addEventListener("change", function(evt) {
		piece.offset.y = this.value;
		updateData();
	});
	info.appendChild(input);

	dom.appendChild(info);

	click.bind(canv)({fake: true,
					  clientX: piece.pivot.x, clientY: piece.pivot.y});

	return dom;
}


window.addEventListener("load", function() {
	// init globals
	TM.asm = document.querySelector("#assemble");
	TM.asmCtx = TM.asm.getContext("2d");
	TM.pose = document.querySelector("#pose");
	TM.poseCtx = TM.pose.getContext("2d");
	TM.json = document.querySelector("#json");

	// build up data and UI for piece images
	var imgs = document.querySelectorAll("#resources img");
	var i = 0;
	var img = null;
	var name = null;
	var piece = null;
	for(i = 0; i < imgs.length; i++) {
		img = imgs[i];
		name = img.src.substring(0, img.src.lastIndexOf("."));
		name = name.substring(img.src.lastIndexOf("/") + 1);
		name = name.substring(img.src.lastIndexOf("\\") + 1);
		name = img.title || name;
		piece = {
			name: name,
			image: img.src,
			gpx: img,
			pivot: {
				x: 0,
				y: 0
			},
			rotate: 0,
			scale: 1,
			alpha: 1,
			layer: null,
			parent: null,
			offset: {
				x: 0,
				y: 0
			}
		};
		TM.pieces.push(piece);
	}
	var ui = null;
	for(i = 0; i < TM.pieces.length; i++) {
		ui = buildPieceUI(TM.pieces[i]);
		document.querySelector("#resources").appendChild(ui);
	}

	// UI hooks for assembly section
	document.querySelector("#scale").addEventListener("change", function() {
		updateData();
	});
	var option = null;
	var option2;
	for(i = 0; i < TM.pieces.length; i++) {
		option = document.createElement("option");
		option.value = option.innerHTML = TM.pieces[i].name;
		document.querySelector("#pieces").appendChild(option);
		option2 = option.cloneNode(true);
		document.querySelector("#posepieces").appendChild(option2);
	}
	var dragging = false;
	var dragX = 0;
	var dragY = 0;
	var dragSelected = {};
	var dragScale = 0;

	var findPiece = function(name, cur) {
		var i = 0;
		var sub = null;
		if(!cur) {
			cur = TM.thing;
		}
		if(cur.name === name) {
			return cur;
		}
		for(i = 0; i < cur.above.length; i++) {
			sub = findPiece(name, cur.above[i]);
			if(sub) {
				return sub;
			}
		}
		for(i = 0; i < cur.below.length; i++) {
			sub = findPiece(name, cur.below[i]);
			if(sub) {
				return sub;
			}
		}
		return null;
	};

	var mousedown = function(evt) {
		dragging = true;
		dragX = evt.clientX;
		dragY = evt.clientY;

		dragScale = parseFloat(document.querySelector("#scale").value);
		dragSelected = {};
		var sel = document.querySelectorAll("#pieces option");
		var i = 0;

		for(i = 0; i < sel.length; i++) {
			if(!sel[i].selected) {
				continue;
			}
			dragSelected[sel[i].value] = TM.obj.$[sel[i].value];
			//dragSelected[sel[i].value] = findPiece(sel[i].value);
		}
	};
	var mousemove = function(evt) {
		if(!dragging) {
			return;
		}
		var x = evt.clientX - dragX;
		var y = evt.clientY - dragY;
		dragX = evt.clientX;
		dragY = evt.clientY;
		var scale = dragScale || 1.0;

		var i = 0;
		for(i in dragSelected) {
			switch(document.querySelector("#mode").value) {
			case "offset":
				dragSelected[i].offset.x += x / scale;
				dragSelected[i].offset.y += y / scale;
				break;
			case "rotate":
				if(!dragSelected[i].rotate) {
					dragSelected[i].rotate = 0;
				}
				dragSelected[i].rotate += x;
				break;
			case "scale":
				if(dragSelected[i].scale === undefined) {
					dragSelected[i].scale = 1;
				}
				dragSelected[i].scale += x / 10;
				break;
			case "alpha":
				if(dragSelected[i].alpha === undefined) {
					dragSelected[i].alpha = 1;
				}
				dragSelected[i].alpha += x / 100;
				if(dragSelected[i].alpha > 1) {
					dragSelected[i].alpha = 1;
				} else if(dragSelected[i].alpha < 0) {
					dragSelected[i].alpha = 0;
				}
				break;
			default:
				break;
			}
		}
		render();
	};
	var mouseup = function() {
		if(!dragging) {
			return;
		}
		dragging = false;

		var i = null;
		var j = 0;
		var ui = null;
		var piece = null;
		for(i in dragSelected) {
			for(j = 0; j < TM.pieces.length; j++) {
				if(TM.pieces[j].name === i) {
					piece = TM.pieces[j];
				}
			}
			if(piece) {
				ui = document.querySelectorAll(".pieceUI");
				for(j = 0; j < ui.length; j++) {
					if(ui[j].querySelector(".name") &&
					   ui[j].querySelector(".name").value === i) {
						ui = ui[j];
						break;
					}
				}
				if(ui.querySelector) {
					ui.querySelector(".offsetx").value = (
						dragSelected[i].offset.x);
					ui.querySelector(".offsety").value = (
						dragSelected[i].offset.y);
					ui.querySelector(".rotate").value = (
						dragSelected[i].rotate);
					ui.querySelector(".scale").value = (
						dragSelected[i].scale);
					ui.querySelector(".alpha").value = (
						dragSelected[i].alpha);
				}

				piece.offset = dragSelected[i].offset;
				piece.rotate = dragSelected[i].rotate;
				piece.scale = dragSelected[i].scale;
				piece.alpha = dragSelected[i].alpha;
			}
		}

		updateData();
	};
	TM.asm.addEventListener("mousedown", mousedown);
	TM.asm.addEventListener("mousemove", mousemove);
	TM.asm.addEventListener("mouseup", mouseup);
	TM.asm.addEventListener("mouseout", mouseup);

	var posemousedown = function(evt) {
		dragging = true;
		dragX = evt.clientX;
		dragY = evt.clientY;

		dragScale = parseFloat(document.querySelector("#scale").value);
		dragSelected = {};
		var sel = document.querySelectorAll("#posepieces option");
		var i = 0;

		for(i = 0; i < sel.length; i++) {
			if(!sel[i].selected) {
				continue;
			}
			dragSelected[sel[i].value] = TM.poseObj.$[sel[i].value];
		}
	};
	var posemousemove = function(evt) {
		if(!dragging) {
			return;
		}
		var x = evt.clientX - dragX;
		var y = evt.clientY - dragY;
		dragX = evt.clientX;
		dragY = evt.clientY;
		var scale = dragScale || 1.0;

		var i = 0;
		for(i in dragSelected) {
			switch(document.querySelector("#posemode").value) {
			case "offset":
				dragSelected[i].offset.x += x / scale;
				dragSelected[i].offset.y += y / scale;
				break;
			case "rotate":
				if(!dragSelected[i].rotate) {
					dragSelected[i].rotate = 0;
				}
				dragSelected[i].rotate += x;
				break;
			case "scale":
				if(dragSelected[i].scale === undefined) {
					dragSelected[i].scale = 1;
				}
				dragSelected[i].scale += x / 10;
				break;
			case "alpha":
				if(dragSelected[i].alpha === undefined) {
					dragSelected[i].alpha = 1;
				}
				dragSelected[i].alpha += x / 100;
				if(dragSelected[i].alpha > 1) {
					dragSelected[i].alpha = 1;
				} else if(dragSelected[i].alpha < 0) {
					dragSelected[i].alpha = 0;
				}
				break;
			default:
				break;
			}
		}
		render();
	};
	var posemouseup = function() {
		if(!dragging) {
			return;
		}
		dragging = false;

		var i = null;
		var j = 0;
		var ui = null;
		var piece = null;

		TM.tempPoseData = TM.poseObj.getPoseData();
		updateData();
		TM.poseObj.setPoseData(TM.tempPoseData);
		render();
	};
	TM.pose.addEventListener("mousedown", posemousedown);
	TM.pose.addEventListener("mousemove", posemousemove);
	TM.pose.addEventListener("mouseup", posemouseup);
	TM.pose.addEventListener("mouseout", posemouseup);
	document.getElementById("posereset").addEventListener("click", function() {
		TM.poseObj.setPose(null);
		TM.tempPoseData = {};
		updateData();
	});
	document.getElementById("poseadd").addEventListener("click", function() {
		var name = document.getElementById("posename").value || "untitled";
		TM.poseData[name] = TM.poseObj.getPoseData();
		updateData();
		TM.poseObj.setPoseData(TM.tempPoseData);
		render();
		document.getElementById("poselist").value = name;
	});
	document.getElementById("posedel").addEventListener("click", function() {
		var name = document.getElementById("poselist").value;
		if(name) {
			delete TM.poseData[name];
		}
		TM.tempPoseData = {};
		updateData();
	});
	document.getElementById("poselist").addEventListener("change", function() {
		TM.poseObj.setPoseData(TM.poseData[this.value]);
		render();
	});
});
