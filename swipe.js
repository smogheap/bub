function swipe()
{
	var startx, starty;
	var moved;

	window.addEventListener("touchstart",	this.touchStart.bind(this));
	window.addEventListener("touchmove",	this.touchMove.bind(this));
	window.addEventListener("touchend",		this.touchEnd.bind(this));

	window.addEventListener("mousedown",	this.touchStart.bind(this));
	window.addEventListener("mousemove",	this.touchMove.bind(this));
	window.addEventListener("mouseup",		this.touchEnd.bind(this));
};

swipe.prototype.touchStart = function(e)
{
	this.moved = false;

	if (e.touches) {
		if (e.touches.length > 1) {
			/* Ignore events with more than one finger */
			return;
		}

		e.clientX = e.touches[0].clientX;
		e.clientY = e.touches[0].clientY;
	}

	this.startx = e.clientX;
	this.starty = e.clientY;
};

swipe.prototype.touchMove = function(e)
{
	/*
		Prevent all move events except the first to allow click events to
		work as normal.
	*/
	if (!this.moved) {
		this.moved = true;
	} else {
		e.preventDefault();
	}
};

swipe.prototype.touchEnd = function(e)
{
	if (e.touches) {
		if (e.touches.length > 1) {
			/* Ignore if there is still a finger touching */
			return;
		}

		e.clientX = e.changedTouches[0].clientX;
		e.clientY = e.changedTouches[0].clientY;
	}

	var dx = e.clientX - this.startx;
	var dy = e.clientY - this.starty;

	var ax = Math.abs(dx);
	var ay = Math.abs(dy);

	if (Math.max(ax, ay) < 10) {
		return;
	}

	if (Math.abs(ax - ay) < 5) {
		/* Couldn't tell which axis the swipe was meant to be on */
		return;
	}

	/* Set up a keydown event */
	var ne = this.createEvent("keydown");

	/* Set the appropriate keycode on the fake event */
	if (ax > ay) {
		ne.keyCode = dx > 0 ? 39 : 37;
	} else {
		ne.keyCode = dy > 0 ? 40 : 38;
	}

	/* Send the event */
	this.fireEvent(ne);
};

swipe.prototype.createEvent = function(name)
{
	var		e;

	if (document.createEvent) {
		e = document.createEvent("HTMLEvents");
		e.initEvent(name, true, true);
	} else {
		e = document.createEventObject();
		e.eventType = name;
	}
	e.eventName = name;

	return(e);
};

swipe.prototype.fireEvent = function(e)
{
	if (document.createEvent) {
		window.dispatchEvent(e);
	} else {
		window.fireEvent("on" + e.eventType, e);
	}
};

new swipe();


