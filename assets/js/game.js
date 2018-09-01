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

  hook = this.physics.add.sprite(0, 0, 'hook');
  hook.setScale(0.3);
  hook.body.allowGravity = false;
  hook.setActive(false);
  hook.setVisible(false);

  ball = this.physics.add.sprite(300, 100, 'ball');
  ball.setCollideWorldBounds(true);
}

function update ()
{
    var that = this;

    this.input.on('pointerdown', function (pointer) {
        hook.setActive(true);
        hook.setVisible(true);

        hook.x = ball.x;
        hook.y = ball.y;
        that.physics.moveTo(hook, pointer.x, pointer.y, 840);
    }, this);

    this.input.on('pointerup', function(pointer) {
        hook.setActive(false);
        hook.setVisible(false);
    })

    screenWrap(ball);
    screenWrap(hook);
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
