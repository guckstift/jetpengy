log = console.log;

jumpvel = 500;
runvel = 200;
maxfallvel = 1000;
maxrisevel = -1000;
maxjetxvel = 250;
fallgrav = 2000;
jetupgrav = 1000;

seal_runvel = 180;
seal_jetupgrav = 1200;

streamPlayId = -1;
streamPlaying = false;

var game = new Phaser.Game(
	900, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }
);

function preload()
{
	game.load.tilemap("level", "level.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("tiles", "tiles.png");
	game.load.atlas("sprites", "sprites.png");

	game.load.audio("pongping", "pongping.ogg");
	game.load.audio("streamsnd", "stream2.ogg");
	game.load.audio("wakwak", "wakwak.ogg");
	game.load.audio("waaak", "waaak.ogg");
}

function create()
{
	pongping = game.add.audio("pongping");
	streamsnd = game.add.audio("streamsnd");
	streamsnd.allowMultiple = true;
	wakwak = game.add.audio("wakwak");
	waaak = game.add.audio("waaak");

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
		31: "QUARTER_RIGHT_BOTTOM_HIGH",
		32: "QUARTER_LEFT_BOTTOM_HIGH",
		33: "FULL",
		34: "FULL",
		35: "FULL",
		36: "FULL",
		37: "FULL",
		38: "FULL",
		39: "QUARTER_RIGHT_BOTTOM_LOW",
		40: "QUARTER_LEFT_BOTTOM_LOW",
		41: "FULL",
		42: "FULL",
		43: "FULL",
		44: "FULL",
		45: "FULL",
		46: "FULL",
		47: "QUARTER_RIGHT_TOP_HIGH",
		48: "QUARTER_LEFT_TOP_HIGH",
		49: "FULL",
		50: "FULL",
		51: "FULL",
		52: "FULL",
		53: "FULL",
		54: "FULL",
		55: "QUARTER_RIGHT_TOP_LOW",
		56: "QUARTER_LEFT_TOP_LOW",
		57: "FULL",
	});
	map.setCollisionBetween(1, 100, true, "groundmap");
	groundmap.resizeWorld();
	// groundmap.debug = true;

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
	penguin.emitter.destroy();
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

function startStreamSnd()
{
	if(streamPlaying)
		return;

	streamPlaying = true;

	streamsnd.play();
	streamPlayId = setInterval(
		function () {
			log("play")
			streamsnd.play();
		},
		1000
	);
}

function stopStreamSnd()
{
	streamPlaying = false;
	clearInterval(streamPlayId);
}
