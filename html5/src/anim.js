// ork idle animation
function idle(ork, time) {
	var cos300 = Math.cos(time / 300);
	var cos150 = Math.cos(time / 150);
	var sin300 = Math.sin(time / 300);

	ork.$.body._offset.x =  cos300 * 14;
	ork.$.body._offset.y = cos150;
	ork.$.body._rotate = 0;
	ork.$.snout._scale = 1;
	ork.$.snout._rotate = sin300 * -2;
	ork.$.mouth._scale = 1;
	ork.$.mouth._rotate = cos300 * 2;

	ork.$.leg1._offset.x = 0;
	ork.$.leg1._offset.y = 0;
	ork.$.leg2._offset.x = 0;
	ork.$.leg2._offset.y = 0;
	ork.$.leg1._rotate = cos300 * 5;
	ork.$.foot1._rotate = cos300 * -5;
	ork.$.leg2._rotate = cos300 * 5;
	ork.$.foot2._rotate = cos300 * -5;

	ork.$.hair1._rotate = sin300 * 3;
	ork.$.hair2._rotate = sin300 * 6;

	ork.$.pupil1._offset.x = 0;
	ork.$.pupil1._offset.y = 0;
	ork.$.pupil2._offset.x = 0;
	ork.$.pupil2._offset.y = 0;
}

// ork walk
function walk(ork, time) {
	var sin50 = Math.sin(time / 50);
	var cos50 = Math.cos(time / 50);
	var sin100 = Math.sin(time / 100);
	var cos100 = Math.cos(time / 100);

	ork.$["body"]._offset.y = -25 - (sin50 * 15);
	ork.$["body"]._offset.x = 0;
	ork.$["body"]._rotate = sin100 * 3;
	ork.$.snout._scale = 1;
	ork.$["snout"]._rotate = cos100 * -3;
	ork.$.mouth._scale = 1;
	ork.$["mouth"]._rotate = sin100 * -3;

	ork.$["leg1"]._offset.x = 0;
	ork.$["leg1"]._offset.y = 0;
	ork.$["leg2"]._offset.x = 0;
	ork.$["leg2"]._offset.y = 0;
	ork.$["leg1"]._rotate = sin100 * 50;
	ork.$["foot1"]._rotate = cos100 * 30;
	ork.$["leg2"]._rotate = sin100 * -50;
	ork.$["foot2"]._rotate = cos100 * -30;

	ork.$["hair1"]._rotate = cos50 * -6;
	ork.$["hair2"]._rotate = cos50 * -9;

	ork.$["pupil1"]._offset.x = 5;
	ork.$["pupil1"]._offset.y = -5;
	ork.$["pupil2"]._offset.x = 5;
	ork.$["pupil2"]._offset.y = 10;
}

// ork climb
function climbup(ork, time) {
	var sin50 = Math.sin(time / 50);
	var cos50 = Math.cos(time / 50);

	ork.$["body"]._offset.y = 0;
	ork.$["body"]._offset.x = 0;
	ork.$.body._rotate = -45 - sin50 * 3;
	ork.$.snout._scale = 1;
	ork.$["snout"]._rotate = cos50 * -3;
	ork.$.mouth._scale = 1;
	ork.$["mouth"]._rotate = sin50 * -3;

	ork.$["leg1"]._offset.x = -20 + (sin50 * 40);
	ork.$["leg2"]._offset.y = 0;
	ork.$["leg2"]._offset.x = 10 + (sin50 * -40);
	ork.$["leg2"]._offset.y = -20 + (sin50 * 20);

	ork.$["leg1"]._rotate = 70 + (sin50 * 20);
	ork.$["foot1"]._rotate = 10 + (cos50 * 30);
	ork.$["leg2"]._rotate = 50 + (sin50 * -20);
	ork.$["foot2"]._rotate = 30 + (cos50 * -30);

	ork.$["hair1"]._rotate = -20 + (cos50 * -6);
	ork.$["hair2"]._rotate = -20 + (sin50 * -9);

	ork.$["pupil1"]._offset.x = 5;
	ork.$["pupil1"]._offset.y = -15;
	ork.$["pupil2"]._offset.x = 5;
	ork.$["pupil2"]._offset.y = -5;
}
function climbdown(ork, time) {
	var sin50 = Math.sin(time / 50);
	var cos50 = Math.cos(time / 50);

	ork.$["body"]._offset.y = 0;
	ork.$["body"]._offset.x = 0;
	ork.$.body._rotate = 45 - sin50 * 3;
	ork.$.snout._scale = 1;
	ork.$["snout"]._rotate = cos50 * -3;
	ork.$.mouth._scale = 1;
	ork.$["mouth"]._rotate = sin50 * -3;

	ork.$["leg1"]._offset.x = -20 + (sin50 * 40);
	ork.$["leg2"]._offset.y = 0;
	ork.$["leg2"]._offset.x = 10 + (sin50 * -20);
	ork.$["leg2"]._offset.y = -20 + (sin50 * -20);

	ork.$["leg1"]._rotate = -70 + (sin50 * 20);
	ork.$["foot1"]._rotate = 10 + (cos50 * -20);
	ork.$["leg2"]._rotate = -40 + (sin50 * -10);
	ork.$["foot2"]._rotate = 10 + (cos50 * 20);

	ork.$["hair1"]._rotate = 20 + (cos50 * -6);
	ork.$["hair2"]._rotate = 20 + (sin50 * -9);

	ork.$["pupil1"]._offset.x = 5;
	ork.$["pupil1"]._offset.y = 5;
	ork.$["pupil2"]._offset.x = 10;
	ork.$["pupil2"]._offset.y = 15;
}

//slurp bubble/key
function slurp(ork, time) {
	var sin75 = Math.sin(time / 75);
	var cos75 = Math.cos(time / 75);
	var cos150 = Math.cos(time / 150);
	var sin150 = Math.sin(time / 150);
	var cos300 = Math.cos(time / 300);
	var sin300 = Math.sin(time / 300);

	ork.$.body._offset.x = sin75 * 80;
	ork.$.body._offset.y = 0;
	ork.$.body._rotate = 0;
	ork.$.snout._rotate = 0;
	ork.$.snout._scale = 1 + (sin75 / 4);
	ork.$.mouth._scale = 1 + (sin150 / 3);
	ork.$.mouth._rotate = 0;

	ork.$.leg1._offset.x = 0;
	ork.$.leg1._offset.y = 0;
	ork.$.leg2._offset.x = 0;
	ork.$.leg2._offset.y = 0;
	ork.$.leg1._rotate = sin75 * 30;
	ork.$.foot1._rotate = -Math.abs(sin75 * 20);
	ork.$.leg2._rotate = sin75 * 30;
	ork.$.foot2._rotate = -Math.abs(sin75 * 20);

	ork.$.hair1._rotate = sin75 * -24;
	ork.$.hair2._rotate = sin75 * -32;

	ork.$["pupil1"]._offset.x = 5;
	ork.$["pupil1"]._offset.y = -5;
	ork.$["pupil2"]._offset.x = 5;
	ork.$["pupil2"]._offset.y = 10;

	ork.$.bubble._scale = 1 - (time / 450);
	ork.$.bubble._rotate = 0;
	ork.$.bubble._offset.x = (1 - (time / 450)) * 20;
	ork.$.bubble._offset.y = (1 - (time / 450)) * -30;

	ork.$.key._scale = 1 - (time / 450);
	if(ork.$.key.flipx) {
		ork.$.key._rotate = -5;
	} else {
		ork.$.key._rotate = 5;
	}
	ork.$.key._offset.x = (1 - (time / 450)) * 20;
	ork.$.key._offset.y = (1 - (time / 450)) * -80;
}

//spit bubble/key
function spit(ork, time) {
	var time350 = time / 350;
	var sin40 = Math.sin(time / 40);

	ork.$.body._offset.x = 0;
	ork.$.body._offset.y = Math.sin(time / 250) * (-122 / 0.3);
	ork.$.body._rotate = 50;
	ork.$.snout._rotate = 30;
	ork.$.snout._scale = 1;
	ork.$.mouth._scale = 1;
	ork.$.mouth._rotate = 10;

	ork.$.leg1._offset.x = 30;
	ork.$.leg1._offset.y = -40;
	ork.$.leg2._offset.x = 50;
	ork.$.leg2._offset.y = 10;
	ork.$.leg1._rotate = -50;
	ork.$.foot1._rotate = 0;
	ork.$.leg2._rotate = -50;
	ork.$.foot2._rotate = 0;

	ork.$.hair1._rotate = (sin40 * 10) - 20;
	ork.$.hair2._rotate = (sin40 * 5) - 90;

	ork.$.pupil1._offset.x = 5;
	ork.$.pupil1._offset.y = 5;
	ork.$.pupil2._offset.x = 10;
	ork.$.pupil2._offset.y = 15;

	ork.$.bubble._scale = time / 220 + 0.001;
	ork.$.bubble._rotate = -90;
	ork.$.bubble._offset.x = 0;
	ork.$.bubble._offset.y = time350 * 50;

	ork.$.key._scale = time / 250 + 0.001;
	if(ork.$.key.flipx) {
		ork.$.key._rotate = 85;
	} else {
		ork.$.key._rotate = -85;
	}
	ork.$.key._offset.x = time350 * -10;
	ork.$.key._offset.y = time350 * 60;
}

// ork bonk
function bonk(ork, time) {
	var sin = Math.sin(time / (Math.PI * 21));
	if(sin < 0) {
		sin *= 2;
	} else {
		sin /= 2;
	}

	ork.$.body._offset.x = sin * -130;
	ork.$.body._offset.y = sin * 20;
	ork.$.body._rotate = sin * -40;
	ork.$.snout._rotate = sin * -10;
	ork.$.snout._scale = 1;
	ork.$.mouth._scale = 1;
	ork.$.mouth._rotate = sin * -10;

	ork.$.leg1._offset.x = sin * -10;
	ork.$.leg1._offset.y = sin * 30;
	ork.$.leg2._offset.x = sin * -20;
	ork.$.leg2._offset.y = sin * -10;
	ork.$.leg1._rotate = sin * 10;
	ork.$.foot1._rotate = Math.abs(sin * 15);
	ork.$.leg2._rotate = sin * 10;
	ork.$.foot2._rotate = Math.abs(sin * 15);

	ork.$.hair1._rotate = sin * 60;
	ork.$.hair2._rotate = sin * 60;

	ork.$.pupil1._offset.x = 5;
	ork.$.pupil1._offset.y = -10;
	ork.$.pupil2._offset.x = 0;
	ork.$.pupil2._offset.y = 0;
}

// flag wave
function wave(flag, time) {
	var cos200 = Math.cos(time / 200);
	var sin200 = Math.sin(time / 200);

	flag.$["1"]._rotate = -1 + (cos200 * 4);
	flag.$["2"]._rotate = 2 + (sin200 * 7);
	flag.$["3"]._rotate = 0 - (cos200 * 12);
	flag.$["shade"]._offset.x = 15 + (cos200 * 20);
	flag.$["shade"]._alpha = 1 + (sin200 * -1);
}
