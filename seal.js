
function createSeal(x,y)
{
	var seal = game.add.sprite(x, y, "sprites", "seal.png");
	game.physics.arcade.enable(seal);
	game.slopes.enable(seal);
	seal.anchor.setTo(0.5);
	seal.enableBody = true;
	seal.body.slopes.preferY = true;
	seal.body.bounce.y = 0.3;
	seal.body.gravity.y = fallgrav;
	seal.body.gravity.x = 0;
	seal.body.velocity.x = 0;
	seal.dir = "r";

	setTimeout(function () {
		seal.body.collideWorldBounds = true;
	}, 0);

	seal.update = sealUpdate;

	return seal;
}

function sealUpdate()
{
	game.physics.arcade.collide(this, groundmap);
	game.physics.arcade.collide(this, seals);

	if(squareDistBetween(this, penguin) < Math.pow(400, 2)) {
		if(this.x + 32 < penguin.x) {
			this.dir = "r";
		}
		else if(this.x - 32 > penguin.x) {
			this.dir = "l";
		}
	}
	else {
		this.dir = "";
	}

	if(this.dir === "r") {
		this.scale.x = +1;
	}
	else {
		this.scale.x = -1;
	}

	//log(this.body.touching.right);

	// JET MODE

	this.frameName = "seal.png";

	if(this.body.touching.right || this.body.touching.left) {
    	this.body.gravity.y = -jetupgrav;
    }
	else {
    	this.body.gravity.y = fallgrav;
	}

	if(this.body.onFloor()) {

		// STANDING

		if(this.dir === "l") {
			this.body.velocity.x = -seal_runvel;
		}
		else if(this.dir === "r") {
			this.body.velocity.x = seal_runvel;
		}
		else {
			this.body.velocity.x = 0;
		}
	}
	else {

		// IN AIR

		if(this.dir === "l") {
			this.body.gravity.x = -500;
		}
		else if(this.dir === "r") {
			this.body.gravity.x = 500;
		}
		else {
			this.body.gravity.x = 0;
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

	game.physics.arcade.collide(this, groundmap);

	if(game.physics.arcade.overlap(this, penguin.emitter)) {
		var jetpack = createJetpack(Math.floor(this.x), Math.floor(this.y));
		jetpacks.add(jetpack);
		this.destroy();
	}
}
