
function createJetpack(x,y)
{
	var jetpack = game.add.sprite(x, y, "sprites", "jetpack.png");
	game.physics.arcade.enable(jetpack);
	game.slopes.enable(jetpack);
	jetpack.anchor.setTo(0.5);
	//seal.enableBody = true;
	//candy.body.slopes.preferY = true;
	//candy.body.bounce.y = 0.3;
	jetpack.body.gravity.y = fallgrav;
	//candy.body.gravity.x = 0;
	jetpack.body.velocity.y = -500;

	// setTimeout(function () {
	// 	jetpack.body.collideWorldBounds = true;
	// }, 0);

	jetpack.update = jetpackUpdate;

	return jetpack;
}

function jetpackUpdate()
{
	game.physics.arcade.collide(this, groundmap);
}
