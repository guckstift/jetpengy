
function createPenguin(x, y)
{
	var penguin = game.add.sprite(x, y, "sprites", "penguin.png");
	game.physics.arcade.enable(penguin);
	game.slopes.enable(penguin);
	penguin.anchor.setTo(0.5);
	penguin.enableBody = true;
	penguin.body.slopes.preferY = true;
	penguin.body.bounce.y = 0.3;
	penguin.body.gravity.y = fallgrav;
	penguin.body.gravity.x = 0;
	penguin.body.velocity.x = 0;

	setTimeout(function () {
		penguin.body.collideWorldBounds = true;
	}, 0);

	penguin.jet = false;
	penguin.fuel = 0.0;
	penguin.ice = false;
	penguin.icefuel = 0.0;
	penguin.firing = false;
	penguin.dead = false;

	penguin.update = penguinUpdate;
	penguin.die = penguinDie;

	penguin.emitter = game.add.emitter(30, 30, 70);
	penguin.emitter.makeParticles("sprites", "ice-bullet.png", 70, true);
    penguin.emitter.minParticleSpeed.setTo(250, -50);
    penguin.emitter.maxParticleSpeed.setTo(250, 50);
    penguin.emitter.minParticleScale = 0.1;
    penguin.emitter.maxParticleScale = 1.2;
    penguin.emitter.gravity = 0;
	penguin.emitter.on = false;

	penguin.animations.add(
		"run",
		["penguin.png", "penguin-1.png", "penguin.png", "penguin-2.png"],
		10, true, false
	);

	penguin.animations.add(
		"stand",
		["penguin.png"],
		10, true, false
	);

	penguin.animations.add(
		"jet",
		["penguin-jet.png"],
		10, true, false
	);

	penguin.animations.add(
		"jetup",
		["penguin-jetup.png"],
		10, true, false
	);

	penguin.animations.add(
		"jetrun",
		["penguin-jet.png", "penguin-1-jet.png", "penguin-jet.png", "penguin-2-jet.png"],
		10, true, false
	);

	penguin.animations.add(
		"die",
		["penguin-die.png"],
		10, true, false
	);

	return penguin;
}

function penguinUpdate()
{
	if(this.dead) {
		this.angle += 10;
		this.scale.setTo(this.scale.x * 1.1)
		return;
	}

	game.physics.arcade.collide(this, groundmap);

	if(cursors.left.isDown) {
		this.scale.x = -1;
	}

	if(cursors.right.isDown) {
		this.scale.x = +1;
	}

	if(this.jet) {

		// JET MODE

		if(cursors.up.isDown) {
	    	this.body.gravity.y = -jetupgrav;
			this.fuel -= 0.002;

			// play stream sound
			startStreamSnd();

			this.animations.play("jetup");
	    }
		else {
	    	this.body.gravity.y = fallgrav;

			// stop streamsnd
			stopStreamSnd();
		}

		if(this.body.onFloor()) {

			// STANDING

			if(cursors.left.isDown) {
				this.body.velocity.x = -runvel;
				if(!wakwak.isPlaying) wakwak.loopFull();
				this.animations.play("jetrun");
			}

			if(cursors.right.isDown) {
				this.body.velocity.x = runvel;
				if(!wakwak.isPlaying) wakwak.loopFull();
				this.animations.play("jetrun");
			}

			if(cursors.left.isUp && cursors.right.isUp) {
				this.body.velocity.x *= 0.95;
				if(wakwak.isPlaying) wakwak.stop();
				this.animations.play("jet");
			}
		}
		else {

			// IN AIR

			if(wakwak.isPlaying) wakwak.stop();

			if(cursors.left.isDown) {
				this.body.gravity.x = -500;
			}

			if(cursors.right.isDown) {
				this.body.gravity.x = 500;
			}

			if(cursors.left.isUp && cursors.right.isUp) {
				this.body.gravity.x = 0;
			}
		}
	}
	else {

		// NO JET MODE

		if(cursors.up.isDown && (this.body.onFloor() || this.body.touching.down)) {
	    	this.body.velocity.y = -jumpvel;
	    }

		if(cursors.left.isDown) {
			this.body.velocity.x = -runvel;
			if(!wakwak.isPlaying) wakwak.loopFull();
			this.animations.play("run");
		}

		if(cursors.right.isDown) {
			this.body.velocity.x = runvel;
			if(!wakwak.isPlaying) wakwak.loopFull();
			this.animations.play("run");
		}

		if(cursors.left.isUp && cursors.right.isUp) {
			this.body.velocity.x *= 0.95;
			if(wakwak.isPlaying) wakwak.stop();
			this.animations.play("stand");
		}
	}

	if(this.fuel <= 0) {
		this.jet = false;
		penguin.body.gravity.y = fallgrav;
		penguin.body.gravity.x = 0;

		// stop streamsnd
		stopStreamSnd();
	}

	if(this.body.velocity.y > maxfallvel) {
		this.body.velocity.y = maxfallvel;
	}
	else if(this.body.velocity.y < maxrisevel) {
		this.body.velocity.y = maxrisevel;
	}
	else if(this.body.velocity.x > maxjetxvel) {
		this.body.velocity.x = maxjetxvel;
	}
	else if(this.body.velocity.x < -maxjetxvel) {
		this.body.velocity.x = -maxjetxvel;
	}

	game.physics.arcade.overlap(
		this, candies,
		function (penguin, candy) {
			candy.destroy();
			penguin.ice = true;
			penguin.icefuel = 1.0;
			pongping.play();
		},
		null, this
	);

	if(spaceKey.isDown && this.ice && !this.firing) {
		this.firing = true;
		penguin.emitter.flow(350, 20, 5, -1);
		penguin.emitter.on = true;
		startIceSnd();
	}

	if(this.firing) {
		this.emitter.x = this.x + this.scale.x * 16;
		this.emitter.y = this.y - 8;
		this.emitter.minParticleSpeed.x = this.emitter.maxParticleSpeed.x =
			250 * this.scale.x;

		this.emitter.forEachAlive(function(particle) {
			particle.alpha = game.math.clamp(particle.lifespan / 350, 0, 1);
		}, this);

		this.icefuel -= 0.004;

		if(this.icefuel <= 0) {
			this.firing = false;
			this.ice = false;
			this.icefuel = 0.0;
			this.emitter.on = false;
			stopIceSnd();
		}
	}

	if(this.firing && spaceKey.isUp) {
		this.firing = false;
		this.emitter.on = false;
		stopIceSnd();
	}

	game.physics.arcade.overlap(
		this, jetpacks,
		function (penguin, jetpack) {
			jetpack.destroy();
			penguin.jet = true;
			penguin.fuel = 1.0;
			jetpacksnd.play();
		},
		null, this
	);

	game.physics.arcade.overlap(
		this, seals,
		function (penguin, seal) {
			if(!seal.iced)
				this.die();
		},
		null, this
	);

	updateJetBar(this.jet, this.fuel);
	updateIceBar(this.ice, this.icefuel);
}

function penguinDie()
{
	if(this.dead)
		return;

	this.animations.play("die");

	this.frameName = "penguin-die.png";
	this.dead = true;
	this.body.collideWorldBounds = false;
	this.body.gravity.x = 0;
	this.body.gravity.y = fallgrav;
	this.body.velocity.x = 0;
	this.body.velocity.y = -jumpvel * 2;

	this.emitter.destroy();

	waaak.play();
	wakwak.stop();
	stopIceSnd();
	stopStreamSnd();

	setTimeout(restartLevel, 850);
}
