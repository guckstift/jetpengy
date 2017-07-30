
function createPenguin()
{
	penguin = game.add.sprite(32 * 18, 0, "sprites", "penguin.png");
	game.physics.arcade.enable(penguin);
	game.slopes.enable(penguin);
	penguin.anchor.setTo(0.5);
	penguin.body.slopes.preferY = true;
	penguin.body.bounce.y = 0.3;
	penguin.body.gravity.y = fallgrav;
	penguin.body.gravity.x = 0;
	penguin.body.velocity.x = 0;

	setTimeout(function () {
		penguin.body.collideWorldBounds = true;
	}, 0);

	penguin.jet = true;

	penguin.update = penguinUpdate;

	return penguin;
}

function penguinUpdate()
{
	game.physics.arcade.collide(this, groundmap);

	//this.body.velocity.x = 0;

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
	    	this.body.gravity.y = -1000;
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
}
