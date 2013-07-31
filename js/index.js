//@codekit-prepend "convenience.js", ParticleSystem.js", "_events.js", "_text.js";

var c = document.getElementById("c")
	,ctx = c.getContext('2d')
	,wWidth = $(window).width()
	,wHeight = $(window).height()
	,widthIsBiggerThanHeight = (wWidth > wHeight) ? true : false
	,xHeight = ((widthIsBiggerThanHeight) ? wHeight * 0.75 : wWidth * 0.75)
	;

c.width = wWidth;
c.height = wHeight;

var text = new Text(ctx);

var particleSystem = new ParticleSystem(ctx);
particleSystem.x = wWidth / 2;
particleSystem.y = wHeight / 2 + text.xHeight / 4;

function draw()
{
	ctx.clearRect(0, 0, wWidth, wHeight);
<<<<<<< HEAD
	particleSystem.drawBack();
	text.draw();
	//particleSystem.draw();
	particleSystem.drawFront();
=======
	particleSystem.draw();
	text.draw();

>>>>>>> 547a675e09b9a25daefb83253d633330dfb32f21
}

var prevTime = null

function step(time)
{
	if (prevTime != null)
	{
		var delta = (time - prevTime) / 1000;
		particleSystem.step(delta);
		text.step(delta);
		draw();
	}
	window.requestAnimationFrame(step);
	prevTime = time;
}

window.requestAnimationFrame(step);
