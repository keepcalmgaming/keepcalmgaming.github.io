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
            debug: true
        }
    }
};

var game = new Phaser.Game(config);
var platforms;
var ball;
var hook;

function preload ()
{
  this.load.image('ball', 'assets/images/ball.png');
  this.load.image('hook', 'assets/images/hook.png');
}

function create ()
{
  this.cameras.main.setBackgroundColor('#44BBA4');
  platforms = this.physics.add.staticGroup();
  ball = this.physics.add.sprite(300, 500, 'ball');
  ball.setCollideWorldBounds(true);

  hook = this.physics.add.sprite(0, 0, 'hook');
  hook.setScale(0.3);
  hook.body.allowGravity = false;
  hook.setActive(false);
  hook.setVisible(false);
}

function update ()
{
    this.input.on('pointerdown', function (pointer) {
        hook.setActive(true);
        hook.setVisible(true);
        hook.x = pointer.x;
        hook.y = pointer.y;
    }, this);

    this.input.on('pointerup', function(pointer) {
        hook.setActive(false);
        hook.setVisible(false);
    })

    screenWrap(ball);
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
