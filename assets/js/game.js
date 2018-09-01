var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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

function preload ()
{
  this.load.image('ball', 'assets/images/ball.png');
}

function create ()
{
  this.cameras.main.setBackgroundColor('#ffffff');
  platforms = this.physics.add.staticGroup();
  ball = this.physics.add.sprite(300, 500, 'ball');
  ball.setCollideWorldBounds(true);
}

function update ()
{
}
