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
  var floorX = 0;
  var floorY = gameHeight;
  platforms.create(floorX, floorY, 'ground').setScale(40, 2).refreshBody();

  graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xF6F7EB } });

  hook = this.physics.add.sprite(0, 0, 'hook');
  hook.setScale(0.3);
  hook.body.allowGravity = false;
  hook.setActive(false);
  hook.setVisible(false);
  hook.setCollideWorldBounds(true);
  hook.body.onWorldBounds = true;

  ball = this.physics.add.sprite(300, 100, 'ball');
  ball.setCollideWorldBounds(true);

  this.physics.add.collider(ball, platforms);

  this.physics.world.on('worldbounds', onWorldBounds);
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
        this.physics.moveTo(hook, pointer.x, pointer.y, 840);
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

function grap() {
  hook.setVelocity(0, 0);
  ball.setVelocity(0, 0);
  this.physics.moveTo(ball, hook.x, hook.y, 420);
}

function screenWrap (sprite) {
    if (sprite.x < 0)
    {
        sprite.x = gameWidth;
    }
    else if (sprite.x > gameWidth)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = gameHeight;
    }
    else if (sprite.y > gameHeight)
    {
        sprite.y = 0;
    }
}
