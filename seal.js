
function createSeal()
{
	seal = game.add.sprite(32 * 3, 0, "sprites", "seal.png");
	game.physics.arcade.enable(seal);
	game.slopes.enable(seal);
	seal.anchor.setTo(0.5);
	seal.body.slopes.preferY = true;
	seal.body.bounce.y = 0.3;
	seal.body.gravity.y = fallgrav;
	seal.body.gravity.x = 0;
	seal.body.velocity.x = -100;

	setTimeout(function () {
		seal.body.collideWorldBounds = true;
	}, 0);

	seal.update = sealUpdate;

	return seal;
}

function sealUpdate()
{
	game.physics.arcade.collide(this, groundmap);
}
