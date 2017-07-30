
function createPenguin()
{
	var penguin = game.add.sprite(0, 0, "sprites", "penguin.png");
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

	penguin.update = penguinUpdate;

	penguin.emitter = game.add.emitter(30, 30, 70);
	penguin.emitter.makeParticles("sprites", "ice-bullet.png", 70, true);
    penguin.emitter.minParticleSpeed.setTo(250, -50);
    penguin.emitter.maxParticleSpeed.setTo(250, 50);
    penguin.emitter.minParticleScale = 0.1;
    penguin.emitter.maxParticleScale = 1.2;
    penguin.emitter.gravity = 0;
	penguin.emitter.on = false;

	return penguin;
}

function penguinUpdate()
{
	game.physics.arcade.collide(this, groundmap);

	if(cursors.left.isDown) {
		this.scale.x = -1;
	}

	if(cursors.right.isDown) {
		this.scale.x = +1;
	}

	if(this.jet) {

		// JET MODE

		this.frameName = "penguin-jet.png";

		if(cursors.up.isDown) {
	    	this.body.gravity.y = -jetupgrav;
			this.fuel -= 0.002;
	    }
		else {
	    	this.body.gravity.y = fallgrav;
		}

		if(this.body.onFloor()) {

			// STANDING

			if(cursors.left.isDown) {
				this.body.velocity.x = -runvel;
			}

			if(cursors.right.isDown) {
				this.body.velocity.x = runvel;
			}

			if(cursors.left.isUp && cursors.right.isUp) {
				this.body.velocity.x *= 0.95;
			}
		}
		else {

			// IN AIR

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

		this.frameName = "penguin.png";

		if(cursors.up.isDown && (this.body.onFloor() || this.body.touching.down)) {
	    	this.body.velocity.y = -jumpvel;
	    }

		if(cursors.left.isDown) {
			this.body.velocity.x = -runvel;
		}

		if(cursors.right.isDown) {
			this.body.velocity.x = runvel;
		}

		if(cursors.left.isUp && cursors.right.isUp) {
			this.body.velocity.x *= 0.95;
		}
	}

	if(this.fuel <= 0) {
		this.jet = false;
		penguin.body.gravity.y = fallgrav;
		penguin.body.gravity.x = 0;
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
		},
		null, this
	);

	if(spaceKey.isDown && this.ice && !this.firing) {
		this.firing = true;
		penguin.emitter.flow(350, 20, 5, -1);
		penguin.emitter.on = true;
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
		}
	}

	if(this.firing && spaceKey.isUp) {
		this.firing = false;
		this.emitter.on = false;
	}

	game.physics.arcade.overlap(
		this, jetpacks,
		function (penguin, jetpack) {
			jetpack.destroy();
			penguin.jet = true;
			penguin.fuel = 1.0;
		},
		null, this
	);

	updateJetBar(this.jet, this.fuel);
	updateIceBar(this.ice, this.icefuel);
}
