function swipeSetup()
{
	var startx, starty;

	window.addEventListener("touchstart", function(e) {
		if (e.touches.length > 1) {
			/* Ignore events with more than one finger */
			return;
		}

		startx = e.touches[0].clientX;
		starty = e.touches[0].clientY;

		e.preventDefault();
	});

	window.addEventListener("touchmove", function(e) {
		e.preventDefault();
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

		if (Math.abs(ax - ay) < 5) {
			/* Couldn't tell which axis the swipe was meant to be on */
			return;
		}

		if (Math.max(ax, ay) < 10) {
			/* Gotta move further than that */
			return;
		}

		/* Set up a keydown event */
		var		ne;

		if (document.createEvent) {
			ne = document.createEvent("HTMLEvents");
			ne.initEvent("keydown", true, true);
		} else {
			ne = document.createEventObject();
			ne.eventType = "keydown";
		}
		ne.eventName = "keydown";

		/* Set the appropriate keycode on the fake event */
		if (ax > ay) {
			ne.keyCode = dx > 0 ? 39 : 37;
		} else {
			ne.keyCode = dy > 0 ? 40 : 38;
		}

		/* Send the event */
		if (document.createEvent) {
			window.dispatchEvent(ne);
		} else {
			window.fireEvent("on" + ne.eventType, ne);
		}
	});
};
swipeSetup();


