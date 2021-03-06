function ParticleSystem(ctx)
{
	this.ctx = ctx;
	//this.particles = [];
	this.frontParticles = [];
	this.backParticles = [];
	this.emitFrontNext = true;
	//this.emmisionRate = 35; //per second?
	this.angle = 0;
	this.maxParticles = 350;
	this.particlesPerSecond = 30;
	this.deltaElapsed = 0;
	this.xSpread = 200;

	this.particleImage = renderBuffer(40, 40, function(ctx)
	{ 
		ctx.beginPath();
		ctx.moveTo(20, 0);
		ctx.lineTo(10, 20);
		ctx.lineTo(20, 40);
		ctx.lineTo(30, 20);
		ctx.closePath();
		ctx.fillStyle = "white";
		ctx.fill();
	});
}

ParticleSystem.prototype.step = function(delta)
{
	this.angle += 10 * delta;

	if (this.angle >= 360) this.angle -= 360 * 2;
	else if (this.angle <= -360) this.angle += 360;

	var particles = this.frontParticles.concat(this.backParticles);

	var self = this;
	var pStep = function(p)
	{
		p.step(delta);
		if (!p.dying && p.living > p.lifetime) p.dying = true;
		else if (p.living - p.deathTime > p.lifetime || p.y + 50 < 0)
		{
			// particles.splice(i, 1);
			if (p.front) self.frontParticles.splice(self.frontParticles.indexOf(p), 1);
			else self.backParticles.splice(self.backParticles.indexOf(p), 1);
		}
	}

	var f = this.frontParticles.length;
	var b = this.backParticles.length;

	var i = particles.length;

	while(i--) 
	{
		pStep(particles[i]);
	}

	for (var time = 1 / this.particlesPerSecond; this.deltaElapsed >= time; this.deltaElapsed -= time)
	{
		this.emit();
	}

	this.deltaElapsed += delta;
}

ParticleSystem.prototype.emit = function()
{
	if (this.frontParticles.length + this.backParticles.length < this.maxParticles) 
	{
		this.emitFrontNext = !this.emitFrontNext;
		var p = new Particle(this.x + (Math.random() - 0.5) * this.xSpread, this.y, Math.random() * 360, 50, Math.random() * 5 + 5)
		p.particleImage = this.particleImage;
		p.front = this.emitFrontNext;
		if (this.emitFrontNext) this.frontParticles.push(p);
		else this.backParticles.push(p);
	}
};

ParticleSystem.prototype.drawFront = function()
{
	for (var i = 0; i < this.frontParticles.length; i++)
	{
		this.frontParticles[i].draw(this.ctx);
	}
}

ParticleSystem.prototype.drawBack = function()
{
	for (var i = 0; i < this.backParticles.length; i++)
	{
		this.backParticles[i].draw(this.ctx);
	}
}

function Particle(x, y, angle, speed, lifetime)
{
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.speed = speed;
	this.lifetime = lifetime;
	this.fillStyle = "white";
	this.yvel = 0;
	this.rotation = 0;
	this.rotMod = Math.random() * 2 - 1;
	this.living = 0;
	this.deathTime = 3;
	this.dying = false;
	this.alpha = 1.0;
	this.front = true;

	this.r = Math.floor(Math.random() * 70) + 250;
	this.g = Math.floor(Math.random() * 70) + 155;
	this.b = Math.floor(Math.random() * 50);
}

Particle.prototype.step = function(delta)
{
	this.x += Math.cos(this.angle) * this.speed * delta;
	this.y += Math.sin(this.angle) * this.speed * delta;
	this.yvel += 60 * delta;
	this.y -= this.yvel * delta;
	this.lifetime -= delta;
	this.living += delta;
	this.rotation += Math.abs(Math.random() * delta * 2);

	var trueYVel = this.yvel + Math.sin(this.angle);
	var trueXVel = Math.cos(this.angle);

	this.newAngle = Math.atan2(trueXVel, trueYVel);

	if (this.dying)
	{
		var timeDying = this.living - this.lifetime;
		var deadness = timeDying / this.deathTime;

		this.alpha = 1.0 - deadness
		// this.r = 23;
		// this.g = 231;
		// this.b = 100 + Math.floor(Math.random() * 100);
		/*this.r = this.g = 150;
		this.b = 120 + Math.floor(Math.random() * 100);*/
		this.r = 220;
		this.g = 188;
		this.b = 255;
	}
};

Particle.prototype.draw = function(ctx)
{
	ctx.save();
	ctx.beginPath();
	ctx.translate(this.x, this.y);
	ctx.scale(0.7, 0.7);
	ctx.rotate(this.newAngle * 180/Math.PI);
	// ctx.drawImage(this.particleImage, -20, -20);

	ctx.beginPath();
	ctx.moveTo(0, 20);
	ctx.lineTo(-10, 0);
	ctx.lineTo(0, -20);
	ctx.lineTo(10, 0);
	ctx.closePath();
	// ctx.fillStyle = this.fillStyle;
	ctx.fillStyle = "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.alpha + ")";

	ctx.fill();

	ctx.restore();
};