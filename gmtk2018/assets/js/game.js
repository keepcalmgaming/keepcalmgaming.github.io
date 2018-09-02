var gameHeight = window.innerHeight;
var gameWidth = window.innerWidth;
var halfWidth = gameWidth / 2;
var halfHeight = gameHeight / 2;

var debug = false;
var graphics;

var platforms;
var ball;
var hook;
var rope;
var bullet;
var bullets;

var skittles;

var GS;

function initGameState() {
  GS = {
    skittleCount: 0,
    hookGrapped: false,
    waitingDown: false,
    hookDistance: 0
  }
}

function log() {
  if (debug) {
    console.log.apply(null, arguments);
  }
}

var level = {
  platforms: [
    [0, gameHeight, halfWidth - 100, 30],
    [halfWidth + 100, gameHeight, halfWidth - 100, 30],
    [0, 30, halfWidth - 100, 30],
    [halfWidth + 100, 30, halfWidth - 100, 30],

    [halfWidth - 280, 300, 80, 80],
    [halfWidth + 200, 300, 80, 80],

    [0, halfHeight + 130, 30, 300],
    [gameWidth - 30, halfHeight + 130, 30, 300],
    [0, halfHeight + 130, 400, 30],
    [gameWidth - 400, halfHeight + 130, 400, 30]
  ],
  enemies: [
    [120, halfHeight],
    [gameWidth - 200, gameHeight - 100],
    [halfWidth - 240, 150],
    [halfWidth + 240, 150],
    [gameWidth - 300, gameHeight - 320],
    [gameWidth - 70, gameHeight - 320],
    [150, gameHeight - 100],
    [420, gameHeight - 100]
  ],
  ballStart: [300, halfHeight]
};

GameScene = {
  key: 'game',

  preload: function() {
    // this.load.setBaseURL('gmtk2018/entry/assets/');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('hook', 'assets/images/hook.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('skittle', 'assets/images/skittle.png');
    this.load.image('bullet', 'assets/images/bullet.png');
  },

  create: function() {
    initGameState();

    this.cameras.main.setBackgroundColor('#44BBA4');
    platforms = this.physics.add.staticGroup();

    for (var p of level.platforms) {
      createPlatform(p[0], p[1], p[2], p[3]);
    }

    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xF6F7EB } });

    hook = this.physics.add.sprite(level.ballStart[0], level.ballStart[1], 'hook');
    hook.setScale(0.3);
    hook.body.allowGravity = false;
    hook.setActive(false);
    hook.setVisible(false);
    hook.setCollideWorldBounds(true);
    hook.body.onWorldBounds = true;

    ball = this.physics.add.image(level.ballStart[0], level.ballStart[1], 'ball');
    ball.setScale(0.3);
    ball.setCircle(120);
    ball.setCollideWorldBounds(false);
    ball.setBounce(0.1);
    ball.body.stopVelocityOnCollide = false;
    ball.setMass(2);

    this.physics.add.collider(ball, platforms, onBallWall, null, this);
    this.physics.add.collider(hook, platforms, onHitWall, null, this);

    this.physics.world.on('worldbounds', onWorldBounds);

    skittles = this.physics.add.group();
    GS.skittleCount = 0;

    for (var s of level.enemies) {
      createSkittle(s[0], s[1]);
    }

    this.physics.add.collider(skittles, platforms);

    bullets = this.physics.add.group();
    this.physics.add.collider(bullets, platforms, onBulletWall, null, this);
  },

  update: function() {
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
          GS.hookGrapped = false;
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
          if (hook.active) {
            returnHook();
          }
      }, this);

      screenWrap(ball);

      if (ball.active && GS.waitingDown) {
        if (ball.body.velocity.y > 0) {
          GS.waitingDown = false;
          GS.hookDistance = Phaser.Math.Distance.Between(ball.x, ball.y, hook.x, hook.y);
        }
      }

      if (hook.active && GS.hookGrapped && !GS.waitingDown) {
        var distance = Phaser.Math.Distance.Between(ball.x, ball.y, hook.x, hook.y);
        if (distance > GS.hookDistance) {
          var curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(hook.x, hook.y), new Phaser.Math.Vector2(ball.x, ball.y));
          //  Get the t value for 200 pixels along the curve
          var t = curve.getTFromDistance(GS.hookDistance);

          //  Get the point at t
          var p = curve.getPoint(t);
          ball.x = p.x;
          ball.y = p.y;
        }
      }
  }
}

function createSkittle(x, y) {
  var skittle = skittles.create(x, y, 'skittle');
  skittle.setScale(0.3);
  skittle.setCollideWorldBounds(true);

  GS.skittleCount += 1;
  skittle.scene.physics.add.collider(ball, skittle, onSkittleHit, null, this);
  skittle.scene.time.addEvent({ delay: Math.floor(Math.random() * (4500 - 2000 + 1) ) + 3000, callback: onEvent, callbackScope: skittle, loop: true });
}

function createPlatform(x, y, widthX, widthY) {
  var scaleX = widthX / 40;
  var scaleY = widthY / 40;
  var platform = platforms.create(x, y, 'ground').setScale(scaleX, scaleY);
  platform.setOrigin(0, 1);
  // platform.setFrictionX(0);
  // platform.setFrictionY(0);
  platform.refreshBody();
}

function onWorldBounds(body) {
  if (body.gameObject == hook) {
    if (hook.active) {
      grap.call(body.gameObject.scene);
    }
  }
}

function onBallWall(ball) {
  // console.log(ball.body.velocity)
}

function onHitWall(hook) {
  log('hit wall')
  grap.call(hook.scene);
}

function onBulletWall(bullet) {
  bullet.destroy();
}

function addTextCenter(content, opts) {
  var text = ball.scene.add.text(0, 0, content, opts);
  var bounds = text.getBounds();
  text.x = halfWidth - bounds.width/2;
  text.y = halfHeight - bounds.height/2;
}

function onBallHit(hook) {
  addTextCenter('YOU DIED', { fontFamily: 'Times New Roman', fontSize: 64, color: '#4C191B', align: 'center' })

  ball.destroy();
  ball.setActive(false).setVisible(false);
  hook.destroy();
}

function onSkittleHit(hook, skittle) {
  if (skittle.active) {
    GS.skittleCount -= 1;
  }
  skittle.setActive(false).setVisible(false);
  skittle.destroy();
  if (GS.skittleCount <= 0) {
    addTextCenter('STRIKE!', { fontFamily: 'Times New Roman', fontSize: 64, color: '#F6BD60', align: 'center' })
  }
}

function grap() {
  log('grapping', ball.active, GS.hookGrapped)
  if (ball.active && !GS.hookGrapped) {
    GS.hookGrapped = true;
    GS.waitingDown = true;
    hook.setVelocity(0, 0);
    ball.setVelocity(0, 0);
    var distance = Phaser.Math.Distance.Between(ball.x, ball.y, hook.x, hook.y)
    // console.log(distance)
    this.physics.moveTo(ball, hook.x, hook.y, 420 + distance/20);
  }
}

function returnHook() {
  log('returning hook')
  hook.setActive(false);
  hook.setVisible(false);
}

function screenWrap (sprite) {
    if (sprite.x < 0)
    {
        sprite.x = gameWidth;
        returnHook();
    }
    else if (sprite.x > gameWidth)
    {
        sprite.x = 0;
        returnHook();
    }

    if (sprite.y < 0)
    {
        sprite.y = gameHeight;
        returnHook();
    }
    else if (sprite.y > gameHeight)
    {
        sprite.y = 0;
        returnHook();
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
