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
var bullet;
var bullets;

var skittles;

var skittleCount;

function preload ()
{
  this.load.image('ball', 'assets/images/ball.png');
  this.load.image('hook', 'assets/images/hook.png');
  this.load.image('ground', 'assets/images/ground.png');
  this.load.image('skittle', 'assets/images/skittle.png');
  this.load.image('bullet', 'assets/images/bullet.png');
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
  ball.setBounce(0.1)

  this.physics.add.collider(ball, platforms);
  this.physics.add.collider(hook, platforms, onHitWall, null, this);

  this.physics.world.on('worldbounds', onWorldBounds);

  skittles = this.physics.add.group();
  skittleCount = 0;

  createSkittle(gameWidth - 200, gameHeight - 100);
  createSkittle(halfWidth - 240, 150)
  createSkittle(gameWidth - 300, gameHeight - 320);
  createSkittle(150, gameHeight - 100);
  createSkittle(420, gameHeight - 100);

  this.physics.add.collider(skittles, platforms);

  bullets = this.physics.add.group();
  this.physics.add.collider(bullets, platforms, onBulletWall, null, this);
}

function createSkittle(x, y) {
  var skittle = skittles.create(x, y, 'skittle');
  skittle.setScale(0.3);
  skittle.setCollideWorldBounds(true);

  skittleCount += 1;
  skittle.scene.physics.add.collider(ball, skittle, onSkittleHit, null, this);
  skittle.scene.time.addEvent({ delay: Math.floor(Math.random() * (4500 - 2000 + 1) ) + 3000, callback: onEvent, callbackScope: skittle, loop: true });
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
    for (var skittle of skittles.getChildren()) {
      skittle.setFlipX(ball.x > skittle.x)
    }

    hook.setAngle(Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(ball.x, ball.y, hook.x, hook.y))+90);
    graphics.clear();

    if (hook.active) {
        graphics.beginPath();
        graphics.moveTo(ball.x, ball.y);
        graphics.lineTo(hook.x, hook.y);
        graphics.strokePath();
    }

    this.input.on('pointerdown', function (pointer) {
      if (ball.active) {
        hook.setActive(true);
        hook.setVisible(true);

        hook.x = ball.x;
        hook.y = ball.y;
        this.physics.moveTo(hook, pointer.x, pointer.y, 2500);
      }
    }, this);

    this.input.on('pointerup', function(pointer) {
        if (!ball.active) {
          this.scene.restart();
        }
        hook.setActive(false);
        hook.setVisible(false);
    }, this);

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

function onBulletWall(bullet) {
  bullet.destroy();
}

function onBallHit(hook) {
  ball.scene.add.text(gameWidth/2 - 150, gameHeight/2 - 50, 'YOU DIED', { fontFamily: 'Times New Roman', fontSize: 64, color: '#4C191B' })
  ball.destroy();
  ball.setActive(false).setVisible(false);
  hook.destroy();
  console.log("YOU DIED");
}

function onSkittleHit(hook, skittle) {
  skittle.setActive(false).setVisible(false);
  skittle.destroy();
  skittleCount -= 1;
  if (skittleCount <= 0) {
    ball.scene.add.text(gameWidth/2 - 150, gameHeight/2 - 50, 'YOU LIVED', { fontFamily: 'Times New Roman', fontSize: 64, color: '#F6BD60' })
  }
  console.log("Skittle DIED", skittleCount);
}

function grap() {
  if (ball.active) {
    hook.setVelocity(0, 0);
    ball.setVelocity(0, 0);
    this.physics.moveTo(ball, hook.x, hook.y, 420);
  }
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

function onEvent ()
{
  if (this.active)
   fireBullet (this)
}

function fireBullet (skittle) {
  if (skittle.active) {
    bullet = bullets.create(skittle.body.x, skittle.body.y, 'bullet');
    bullet.setScale(0.3);
    bullet.body.allowGravity = false;
    bullet.scene.physics.moveTo(bullet, ball.x, ball.y, 200);
    bullet.scene.physics.add.collider(ball, bullet, onBallHit);
  }
}
