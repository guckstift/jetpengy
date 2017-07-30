
function createJetpack(x,y)
{
	jetpack = game.add.sprite(x, y, "sprites", "jetpack.png");
	game.physics.arcade.enable(jetpack);
	//game.slopes.enable(seal);
	jetpack.anchor.setTo(0.5);
	//seal.enableBody = true;
	//candy.body.slopes.preferY = true;
	//candy.body.bounce.y = 0.3;
	//candy.body.gravity.y = fallgrav;
	//candy.body.gravity.x = 0;
	//candy.body.velocity.x = 0;

	setTimeout(function () {
		jetpack.body.collideWorldBounds = true;
	}, 0);

	jetpack.update = candyUpdate;

	return candy;
}

function candyUpdate()
{
}
