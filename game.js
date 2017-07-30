log = console.log;

jumpvel = 500;
runvel = 200;
maxfallvel = 1000;
maxrisevel = -1000;
maxjetxvel = 500;
fallgrav = 2000;
jetupgrav = 1000;

seal_runvel = 180;

var game = new Phaser.Game(
	900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }
);

function preload()
{
	game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("tiles", "tiles.png");
	game.load.atlas("sprites", "sprites.png");

	game.load.audio("pongping", "pongping.ogg");
}

function create()
{
	pongping = game.add.audio("pongping");

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

	cursors = this.game.input.keyboard.createCursorKeys();
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	startLevel();

	addEventListener("resize", resizeWindow);
	resizeWindow();
}

function startLevel()
{
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
		24: "FULL",
		25: "FULL",
		26: "FULL",
		27: "FULL",
		28: "HALF_TOP_RIGHT",
		29: "HALF_TOP_LEFT",
		30: "FULL",
		31: "FULL",
		32: "FULL",
		33: "FULL",
		34: "FULL",
		35: "FULL",
		36: "FULL",
		37: "FULL",
		38: "FULL",
		39: "FULL",
		40: "FULL",
	});
	map.setCollisionBetween(1, 100, true, "groundmap");
	groundmap.resizeWorld();
	//groundmap.debug = true;

	//seal = createSeal(0, 0);

	seals = game.add.group();
	candies = game.add.group();
	jetpacks = game.add.group();

	for(var i=0; i<map.objects.items.length; i++) {
		var obj = map.objects.items[i];

		switch(obj.type) {
			case "candy":
				var candy = createCandy(obj.x + 16, obj.y - 32 + 16);
				candies.add(candy);
				break;
			case "seal":
				var seal = createSeal(obj.x + 16, obj.y - 32 + 16);
				seals.add(seal);
				break;
			case "penguin":
				var penguinX = obj.x + 16;
				var penguinY = obj.y - 32 + 16;
				break;
		}
	}

	penguin = createPenguin(penguinX, penguinY);
	game.camera.follow(penguin);

	jetBar = game.add.sprite(16, 16, "sprites", "jetbar.png");
	jetBar.fixedToCamera = true;
	jetBar.visible = false;

	iceBar = game.add.sprite(16, 48, "sprites", "icebar.png");
	iceBar.fixedToCamera = true;
	iceBar.visible = false;

	// spawnNextSealPossibly();
}

function stopLevel()
{
	iceBar.destroy();
	jetBar.destroy();
	penguin.destroy();

	jetpacks.destroy();
	candies.destroy();
	seals.destroy();

	groundmap.destroy();
	map.destroy();
}

function restartLevel()
{
	stopLevel();
	startLevel();
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

function spawnNextSealPossibly()
{
	setTimeout(function ()
		{
			var seal = createSeal(
				game.camera.x + innerWidth / 2,
				game.camera.y - 64
			);
			seals.add(seal);
			spawnNextSealPossibly();
		},
		5000 + Math.random() * 5000
	);
}

function updateJetBar(vis, fuel)
{
	jetBar.visible = vis;
	jetBar.crop(new Phaser.Rectangle(0, 0, fuel * 128, 16))
}


function updateIceBar(vis, fuel)
{
	iceBar.visible = vis;
	iceBar.crop(new Phaser.Rectangle(0, 0, fuel * 128, 16))
}

function squareDistBetween(sp1, sp2)
{
	return Math.pow(sp1.x - sp2.x, 2) + Math.pow(sp1.y - sp2.y, 2)
}
