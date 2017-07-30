log = console.log;

jumpvel = 500;
runvel = 200;
maxfallvel = 1000;
maxrisevel = -1000;
maxjetxvel = 500;
fallgrav = 2000;

var game = new Phaser.Game(
	900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }
);

function preload()
{
	game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("tiles", "tiles.png");
	game.load.atlas("sprites", "sprites.png");
}

function create()
{
	game.plugins.add(Phaser.Plugin.ArcadeSlopes);
	game.slopes.solvers.sat.options.preferY = true;
	game.stage.backgroundColor = "#a9f0ff";
	game.physics.arcade.TILE_BIAS = 40;
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.canvas.style.position = "absolute";
	game.canvas.style.top = "0";
	game.canvas.style.left = "0";
	game.stage.disableVisibilityChange = true;

	//game.time.advancedTiming = true;

	map = game.add.tilemap("level");
	map.addTilesetImage("tiles", "tiles");
	groundmap = map.createLayer("groundmap");
	game.slopes.convertTilemapLayer(groundmap, {
		1: "FULL",
		2: "FULL",
		3: "FULL",
		4: "HALF_BOTTOM_RIGHT",
		5: "HALF_BOTTOM_LEFT",
		6: "FULL",
		7: "FULL",
		8: "FULL",
		9: "FULL",
		10: "FULL",
		11: "FULL",
		12: "FULL",
		13: "FULL",
		14: "FULL",
		15: "FULL",
		16: "FULL",
		17: "FULL",
		18: "FULL",
		19: "FULL",
		20: "FULL",
		21: "FULL",
		22: "FULL",
		23: "FULL",
	});
	map.setCollisionBetween(1, 100, true, "groundmap");
	groundmap.resizeWorld();
	//groundmap.debug = true;

	penguin = createPenguin();
	game.camera.follow(penguin);

	seal = createSeal(0, 0);

	cursors = this.game.input.keyboard.createCursorKeys();

	addEventListener("resize", resizeWindow);
	resizeWindow();
}

function resizeWindow()
{
	 //game.scale.refresh();
	 //game.renderer.resize(innerWidth, innerHeight);
	 //game.camera.setSize(innerWidth, innerHeight);
	 groundmap.resize(innerWidth, innerHeight);
}

function update()
{
	//log(game.time.fps);
}
