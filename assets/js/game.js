var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
  this.load.spritesheet('ball', 'assets/images/ball.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
  this.cameras.main.setBackgroundColor('#ffffff');
}

function update ()
{
}
