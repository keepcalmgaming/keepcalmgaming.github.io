define("scenes/greeting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class GreetingScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'greeting' });
        }
        create() {
            var content = [
                "JOINT TOGETHER",
                "",
                "Topic of GMTK Game Jam 2020 is “JOINED TOGETHER”.",
                "Here's our small game about Tetris and Arcanoid.",
                "",
                "Enjoy!",
                "",
                "https://keepcalmgaming.github.io"
            ];
            this.cameras.main.setBackgroundColor('#FFFFFF');
            var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#000000', wordWrap: { width: gameWidth - 100 } });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            // this.load.once('complete', () => {
            //     let music = this.sound.add('music')
            //     music.play()
            // }, this);
            // this.load.audio('music', 'sounds/NavigatorOST.mp3')
            // this.load.start();
            let clicked = false;
            if (!window.SaveState) {
                window.SaveState = {};
            }
            this.input.on('pointerdown', () => {
                if (!clicked || true) {
                    this.scene.switch('main');
                    clicked = true;
                }
            });
        }
    }
    exports.GreetingScene = GreetingScene;
});
define("game/base_game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BaseGame {
        constructor(config) {
            this.config = config;
            this.x = this.config.x;
            this.y = this.config.y;
            this.cellSize = this.config.cellSize;
            this.offsetX = this.config.offsetX;
            this.offsetY = this.config.offsetY;
            this.physics = this.config.physics;
        }
        update() {
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
    }
    exports.BaseGame = BaseGame;
});
define("game/tetris", ["require", "exports", "game/base_game"], function (require, exports, base_game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Tetris extends base_game_1.BaseGame {
        constructor(config) {
            super(config);
            console.log('Tetris', this.config);
        }
        update() {
            super.update();
        }
    }
    exports.Tetris = Tetris;
});
define("game/arcanoid", ["require", "exports", "game/base_game"], function (require, exports, base_game_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Arcanoid extends base_game_2.BaseGame {
        constructor(config) {
            super(config);
            console.log(this);
            let ball = this.physics.add.image(this.offsetX, this.offsetY, 'ball');
            ball.setScale(0.3);
            ball.setCircle(120);
            ball.setCollideWorldBounds(false);
            ball.setBounce(0.1);
            ball.body.stopVelocityOnCollide = false;
            ball.setMass(2);
            this.ball = ball;
            console.log('Arcanoid', this.config);
        }
        update() {
            super.update();
        }
    }
    exports.Arcanoid = Arcanoid;
});
define("scenes/main", ["require", "exports", "game/tetris", "game/arcanoid"], function (require, exports, tetris_1, arcanoid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = false;
    const minSide = 10;
    const maxSide = 16;
    class MainScene extends Phaser.Scene {
        // private mfGroup?: Phaser.Physics.Arcade.StaticGroup
        // private mainframe?: Phaser.GameObjects.Sprite
        // private tower?: Phaser.GameObjects.Sprite
        // private towerSpawns: Phaser.GameObjects.Sprite[] = []
        // private monsterSpawns: Phaser.GameObjects.Sprite[] = []
        // private monsters?: Phaser.Physics.Arcade.Group
        // private bullets?: Phaser.Physics.Arcade.Group
        // public textLives?: Phaser.GameObjects.Text
        // public textScore?: Phaser.GameObjects.Text
        constructor(sceneConfig) {
            super({ key: 'main' });
            this.offsetX = 0;
            this.offsetY = 0;
            // super(sceneConfig)
            this.x = minSide;
            this.y = maxSide;
            let rw = gameWidth / this.x, rh = gameHeight / this.y;
            this.cellSize = rh < rw ? rh : rw;
            this.offsetX = (gameWidth - this.cellSize * this.x) / 2;
            this.offsetY = (gameHeight - this.cellSize * this.y) / 2;
        }
        create() {
            this.cameras.main.setBackgroundColor('#959F7D');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupText();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
            this.tetris = new tetris_1.Tetris({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: 100,
                offsetY: 100,
                physics: this.physics
            });
            this.arcanoid = new arcanoid_1.Arcanoid({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: 100,
                offsetY: 200,
                physics: this.physics
            });
            console.log('Game Created', this.x, this.y);
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
            this.arcanoid.update();
            this.tetris.update();
            // this.input.on('pointerup', () => {
            //     if (!this.towergame.active()) {
            //         if (this.music) { this.music.destroy() }
            //       this.towergame = new Game(this.x, this.y, this.isVertical)
            //       this.scene.restart();
            //     }
            // });
        }
        setupEvents() {
            // if (!this.mainframe || !this.mfGroup) return
            // this.monsters = this.physics.add.group()
            // this.physics.add.collider(this.monsters, this.mfGroup, this.mainframeHit)
            // this.bullets = this.physics.add.group()
            // this.physics.add.collider(this.monsters, this.bullets, this.bulletHit)
            // // MONSTER SPAWNS
            // for (let monsterSpawn of this.monsterSpawns) {
            //     this.time.addEvent({
            //         delay: 3000,
            //         loop: true,
            //         callback: this.createMonster,
            //         callbackScope: this,
            //         args: [ monsterSpawn ]
            //     })
            // }
            // this.time.addEvent({
            //     delay: 1000,
            //     loop: true,
            //     callback: this.towerShoot,
            //     callbackScope: this
            // })
        }
        setupText() {
            // this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
            // this.textScore = this.add.text(gameWidth - 120, 20, `SCORE: ${this.towergame.score}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        preload() {
            this.load.image('cell', 'images/cell_empty.png');
            this.load.image('block', 'images/cell_empty.png');
            this.load.image('ball', 'images/ball.png');
            this.load.image('bullet', 'images/bullet.png');
            // this.load.image('bullet', 'images/bullet2.png')
            // this.load.image('mainframe', 'images/mainframe.png')
            // this.load.image('monster', 'images/monster.png')
            // this.load.image('monsterplace', 'images/monsterplace.png')
            // this.load.image('tower', 'images/tower.png')
            // this.load.image('towerplace', 'images/towerplace.png')
            // this.load.image('wallbrick', 'images/wallbrick.png')
            // this.load.audio('music', 'sounds/GameOST.mp3')
        }
        debugDrawGrid() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(i * 10, j * 10, this.cellSize, this.cellSize);
                }
            }
        }
    }
    exports.MainScene = MainScene;
});
define("app", ["require", "exports", "scenes/main"], function (require, exports, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    let config = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
        scene: [main_1.MainScene]
    };
    class App {
        constructor() {
            this.isDebug = true;
        }
        start() {
            this.log('Generating game...');
            let g = new Phaser.Game(config);
            this.log('Ready to play');
        }
        log(...args) {
            if (this.isDebug) {
                console.log(...args);
            }
        }
    }
    exports.App = App;
});
//# sourceMappingURL=app.js.map