
function createCandy(x,y)
{
	var candy = game.add.sprite(x, y, "sprites", "icecandy.png");
	game.physics.arcade.enable(candy);
	//game.slopes.enable(seal);
	candy.anchor.setTo(0.5);
	//seal.enableBody = true;
	//candy.body.slopes.preferY = true;
	//candy.body.bounce.y = 0.3;
	//candy.body.gravity.y = fallgrav;
	//candy.body.gravity.x = 0;
	//candy.body.velocity.x = 0;

	// setTimeout(function () {
	// 	candy.body.collideWorldBounds = true;
	// }, 0);

	candy.update = candyUpdate;

	return candy;
}

function candyUpdate()
{
}
