window.onload = () => {
  let player;
  let controls;
  let map;
  let terrainLayer;
  let flopsLayer;
  let jumpCount = 0;

  const config = {
    type: Phaser.AUTO,
    parent: document.getElementById('container'),
    width: 800,
    height: 308,
    backgroundColor: '0xffffff',
    antialias: false,
    scene: {
      preload,
      create,
      update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
      },
    },
  };

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('items', 'assets/items.png');
    this.load.tilemapTiledJSON('level1', 'assets/map.json');
    this.load.spritesheet('mario', 'assets/mario.png', { frameWidth: 34, frameHeight: 68 });
  }

  function create() {
    initMap(this);
    initPlayer(this);
    initAnimations(this);
    setCamera(this);

    controls = this.input.keyboard.createCursorKeys();
  }

  function update() {
    player.body.velocity.x = 0;
    if (player.body.onFloor()) {
      jumpCount = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(controls.up)) {
      if (++jumpCount <= 2) {
        player.anims.play('jump');
        player.setVelocityY(-270);
      }
    }

    if (controls.down.isDown) {
      player.anims.play('down');
      return null;
    }
    if (controls.left.isDown) {
      player.flipX = true;
      player.setVelocityX(-160);
      player.body.onFloor() && player.anims.play('run', true);
      return null;
    }
    if (controls.right.isDown) {
      player.flipX = false;
      player.setVelocityX(160);
      player.body.onFloor() && player.anims.play('run', true);
      return null;
    }

    player.body.onFloor() && player.anims.play('wait');
  }

  const initMap = scene => {
    map = scene.make.tilemap({ key: 'level1' });
    const itemsSet = map.addTilesetImage('tileset', 'items');
    terrainLayer = map.createStaticLayer('layer', [itemsSet], 0, 0);
    flopsLayer = map.createStaticLayer('flops', [itemsSet], 0, 0);
    terrainLayer.setCollisionBetween(0, 190);
    flopsLayer.setCollisionBetween(0, 190);
  };

  const setCamera = scene => {
    scene.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    scene.cameras.main.startFollow(player);
    scene.cameras.main.followOffset.set(0, 0);
    scene.cameras.main.setBackgroundColor('#ccccff');
  };

  const initPlayer = scene => {
    player = scene.physics.add.sprite(0, 200, 'mario', 1).setScale(0.6).setGravityY(600);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    scene.physics.add.collider(player, terrainLayer);
    scene.physics.add.collider(player, flopsLayer, flopDown);
  };

  const initAnimations = scene => {
    scene.anims.create({
      key: 'jump',
      frames: game.anims.generateFrameNumbers('mario', { frames: [6] }),
      frameRate: 1,
    });
    scene.anims.create({
      key: 'down',
      frames: game.anims.generateFrameNumbers('mario', { frames: [0] }),
      frameRate: 1,
    });
    scene.anims.create({
      key: 'run',
      frames: game.anims.generateFrameNumbers('mario', { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'wait',
      frames: [ { key: 'mario', frame: 1 } ],
      frameRate: 1
    });
  };

  const flopDown = (player, obj) => {
    console.log(player);
    console.log(obj);
    // console.log(++player.y);
    // player.setY(player.y + 1);
  }
};
