function swipe()
{
	var startx, starty;
	var moved;

	window.addEventListener("touchstart", function(e) {
		moved = false;

		if (e.touches.length > 1) {
			/* Ignore events with more than one finger */
			return;
		}

		startx = e.touches[0].clientX;
		starty = e.touches[0].clientY;
	});

	window.addEventListener("touchmove", function(e) {
		/*
			Prevent all move events except the first to allow click events to
			work as normal.
		*/
		if (!moved) {
			moved = true;
		} else {
			e.preventDefault();
		}
	});

	window.addEventListener("touchend", function(e) {
		if (e.touches.length > 1) {
			/* Ignore if there is still a finger touching */
			return;
		}

		var dx = e.changedTouches[0].clientX - startx;
		var dy = e.changedTouches[0].clientY - starty;

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
	}.bind(this));
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


