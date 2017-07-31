
function createPenguinWife(x, y)
{
	var wife = game.add.sprite(x, y, "sprites", "penguin-wife.png");
	game.physics.arcade.enable(wife);
	game.slopes.enable(wife);
	wife.anchor.setTo(0.5);
	wife.enableBody = true;
	wife.body.slopes.preferY = true;
	wife.body.bounce.y = 0.3;
	wife.body.gravity.y = fallgrav * 0.8;
	wife.body.gravity.x = 0;
	wife.body.velocity.x = 0;
	wife.scale.x = -1;

	setTimeout(function () {
		wife.body.collideWorldBounds = true;
	}, 0);

	wife.update = wifeUpdate;

	wife.startwak = false;
	wife.wak = wifeWak.bind(wife);

	wife.emitter = game.add.emitter(30, 30, 70);
	wife.emitter.makeParticles("sprites", "heart.png", 70, true);
    wife.emitter.minParticleSpeed.setTo(-50, -100);
    wife.emitter.maxParticleSpeed.setTo(50, -100);
    wife.emitter.minParticleScale = 0.1;
    wife.emitter.maxParticleScale = 1.2;
    wife.emitter.gravity = 0;
	wife.emitter.on = false;

	wife.animations.add(
		"yeah",
		["penguin-wife.png"],
		10, true, false
	);

	return wife;
}

function wifeUpdate()
{
	game.physics.arcade.collide(this, groundmap);

	if(this.startwak && this.body.onFloor()) {
		this.body.velocity.y = -jumpvel * 0.8;
	}

	this.emitter.y = this.y - 32;

	if(!this.startwak && squareDistBetween(this, penguin) < Math.pow(100, 2)) {
		this.startwak = true;
		this.emitter.on = true;
		this.emitter.flow(1000, 100, 5, -1);
		this.emitter.x = this.x;
		wifewak1.play();
		setTimeout(this.wak, 1000 + Math.random() * 4000);
	}
}

function wifeWak()
{
	var r = Math.random();

	if(r < 0.33)
		wifewak1.play();
	else if(r < 0.66)
		wifewak2.play();
	else
		wifewak3.play();

	setTimeout(this.wak, 1000 + Math.random() * 4000);
}
