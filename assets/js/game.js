var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;

var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
var graphics;

var platforms;
var ball;
var hook;
var rope;

function preload ()
{
  this.load.image('ball', 'assets/images/ball.png');
  this.load.image('hook', 'assets/images/hook.png');
  this.load.image('ground', 'assets/images/ground.png');
}

function create ()
{

  this.cameras.main.setBackgroundColor('#44BBA4');
  platforms = this.physics.add.staticGroup();

  var halfWidth = gameWidth / 2;
  var halfHeight = gameHeight / 2;
  createPlatform(0, gameHeight, halfWidth - 100, 40);
  createPlatform(halfWidth + 100, gameHeight, halfWidth - 100, 40);
  createPlatform(0, 40, halfWidth - 100, 40);
  createPlatform(halfWidth + 100, 40, halfWidth - 100, 40);

  createPlatform(halfWidth - 280, 300, 80, 80);
  createPlatform(halfWidth + 200, 300, 80, 80);

  createPlatform(0, halfHeight + 150, 40, 300);
  createPlatform(gameWidth - 40, halfHeight + 150, 40, 300);
  createPlatform(0, halfHeight + 150, 400, 40);
  createPlatform(gameWidth - 400, halfHeight + 150, 400, 40);


  graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xF6F7EB } });

  hook = this.physics.add.sprite(300, gameHeight - 300, 'hook');
  hook.setScale(0.3);
  hook.body.allowGravity = false;
  hook.setActive(false);
  hook.setVisible(false);
  hook.setCollideWorldBounds(true);
  hook.body.onWorldBounds = true;

  ball = this.physics.add.image(300, gameHeight - 300, 'ball');
  ball.setScale(0.3);
  ball.setCircle(120);
  ball.setCollideWorldBounds(false);

  this.physics.add.collider(ball, platforms);
  this.physics.add.collider(hook, platforms, onHitWall, null, this);

  this.physics.world.on('worldbounds', onWorldBounds);
}

function createPlatform(x, y, widthX, widthY) {
  var scaleX = widthX / 40;
  var scaleY = widthY / 40;
  var platform = platforms.create(x, y, 'ground').setScale(scaleX, scaleY);
  platform.setOrigin(0, 1);
  platform.refreshBody();
}

function update ()
{
    hook.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(ball.x, ball.y, hook.x, hook.y))+90);
    graphics.clear();

    if (hook.active) {
        graphics.beginPath();
        graphics.moveTo(ball.x, ball.y);
        graphics.lineTo(hook.x, hook.y);
        graphics.strokePath();
    }

    this.input.on('pointerdown', function (pointer) {
        hook.setActive(true);
        hook.setVisible(true);

        hook.x = ball.x;
        hook.y = ball.y;
        this.physics.moveTo(hook, pointer.x, pointer.y, 2500);
    }, this);

    this.input.on('pointerup', function(pointer) {
        hook.setActive(false);
        hook.setVisible(false);
    })

    screenWrap(ball);
}

function onWorldBounds(body) {
  if (body.gameObject == hook) {
    if (hook.active) {
      grap.call(body.gameObject.scene);
    }
  }
}

function onHitWall(hook) {
  grap.call(hook.scene);
}

function grap() {
  console.log('processing grap')
  hook.setVelocity(0, 0);
  ball.setVelocity(0, 0);
  this.physics.moveTo(ball, hook.x, hook.y, 420);
}

function disableHook() {
  hook.setActive(false);
  hook.setVisible(false);
}

function screenWrap (sprite) {
    if (sprite.x < 0)
    {
        sprite.x = gameWidth;
        disableHook();
    }
    else if (sprite.x > gameWidth)
    {
        sprite.x = 0;
        disableHook();
    }

    if (sprite.y < 0)
    {
        sprite.y = gameHeight;
        disableHook();
    }
    else if (sprite.y > gameHeight)
    {
        sprite.y = 0;
        disableHook();
    }
}
