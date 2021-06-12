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
                "Topic of GMTK Game Jam 2021 is “JOINED TOGETHER”.",
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
define("scenes/main", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = true;
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
            this.isVertical = gameHeight > gameWidth;
            if (this.isVertical) {
                this.x = minSide;
                this.y = maxSide;
            }
            else {
                this.x = maxSide;
                this.y = minSide;
            }
            let rw = gameWidth / this.x, rh = gameHeight / this.y;
            this.rectSize = rh < rw ? rh : rw;
            this.offsetX = (gameWidth - this.rectSize * this.x) / 2;
            this.offsetY = (gameHeight - this.rectSize * this.y) / 2;
            // this.towergame = new Game(this.x, this.y, this.isVertical)
            console.log('Game Created', this.x, this.y, this.towergame);
        }
        create() {
            this.cameras.main.setBackgroundColor('#E8745A');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupText();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
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
            // let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            // for (let i = 0; i < this.x; i++) {
            //     for (let j = 0; j < this.y; j++) {
            //         field.strokeRect(i * 10, j * 10, this.rectSize, this.rectSize);
            //     }
            // }
        }
    }
    exports.MainScene = MainScene;
});
define("app", ["require", "exports", "scenes/greeting", "scenes/main"], function (require, exports, greeting_1, main_1) {
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
        scene: [greeting_1.GreetingScene, main_1.MainScene]
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

define("game/utils", ["require", "exports", "game/driver"], function (require, exports, driver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LevelInfo {
        constructor() {}
    }
    exports.LevelInfo = LevelInfo;
    exports.LevelConfig = {};
});
define("", ["require", "exports", "game/utils"], function (require, exports, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Block {
        constructor() {}
        setSpeed(speed) {}
        setMovementDirection(m) {}
        getNextStep() {}
        flushDirection() {}
        getMovementDirection() {}
    }
    exports.Car = Car;
});
define("scenes/Level", ["require", "exports", "game/utils", "game/car", "game/driver"], function (require, exports, utils_3, car_2, driver_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = true;
    const minSide = 8;
    const maxSide = 9;
    class LevelScene extends Phaser.Scene {
        constructor(sceneConfig) {}
        create() {}
        getRows() {}
        getCols() {}
        loadLevel() {}
        finishLevel() {}
        preload() {}
    }
    exports.LevelScene = LevelScene;
});
define("scenes/hero_scene", ["require", "exports", "game/utils"], function (require, exports, utils_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class HeroScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'hero' });
        }
        create() {
            let heroSceneInfo = window.HeroSettings;
            this.pic = heroSceneInfo.pic;
            this.text = heroSceneInfo.text;
            let imgPath = this.pic;
            this.imgName = 'heroImg' + heroSceneInfo.name;
            console.log('loading', this.pic, this.imgName);
            this.load.once('complete', this.renderScene, this);
            this.load.image(this.imgName, imgPath);
            this.load.start();
        }
        renderScene() {
            let sprite = this.physics.add.sprite(0, 0, this.imgName).setInteractive();
            sprite.setOrigin(1, 0.5);
            sprite.x = halfWidth - 20;
            sprite.y = halfHeight;
            let content = this.text;
            this.cameras.main.setBackgroundColor('#FFFFFF');
            var text = this.add.text(0, 0, content, {
                align: 'left',
                font: 'bold 25px Arial',
                color: '#000000',
                wordWrap: { width: halfWidth }
            });
            var bounds = text.getBounds();
            text.x = halfWidth;
            text.y = halfHeight - bounds.height / 2;
            if (halfWidth > 300) {
                sprite.x -= 100;
                text.x -= 100;
            }
            let clicked = false;
            this.input.on('pointerdown', () => {
                if (!clicked) {
                    this.scene.stop('hero_scene');
                    if (window.Result) {
                        this.scene.start('level_select');
                    }
                    else {
                        window.LevelSetup = utils_4.LevelConfig[utils_4.LevelOrder[0]];
                        this.scene.start('Level');
                    }
                }
            });
        }
        preload() {
            this.load.image('profile', 'images/menu/profile.png');
        }
    }
    exports.HeroScene = HeroScene;
});
define("scenes/level_select", ["require", "exports", "game/utils"], function (require, exports, utils_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class LevelSelectScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'level_select' });
            // this.isVertical = gameHeight > gameWidth
            // if (this.isVertical) {
            //     this.x = minSide
            //     this.y = maxSide
            // } else {
            //     this.x = maxSide
            //     this.y = minSide
            // }
            // let rw = gameWidth / this.x, rh = gameHeight / this.y
            // this.rectSize = rh < rw ? rh : rw
            // this.offsetX = (gameWidth - this.rectSize * this.x) / 2
            // this.offsetY = (gameHeight - this.rectSize * this.y) / 2
        }
        create() {
            console.log('create called');
            this.cameras.main.setBackgroundColor('#FFFFFF');
            if (window.Result) {
                if (window.SaveState[window.Result.name]) {
                    if (window.Result.stars > window.SaveState[window.Result.name].stars) {
                        window.SaveState[window.Result.name].stars = window.Result.stars;
                    }
                }
                else {
                    window.SaveState[window.Result.name] = {
                        stars: window.Result.stars
                    };
                }
            }
            window.Result = null;
            let positions = [
                [halfWidth - 140, halfHeight - 90],
                [halfWidth, halfHeight - 90],
                [halfWidth + 140, halfHeight - 90],
                [halfWidth - 70, halfHeight + 90],
                [halfWidth + 70, halfHeight + 90]
            ];
            let i = 0, prevName = null;
            for (let name of utils_5.LevelOrder) {
                if (!prevName || window.SaveState[prevName]) {
                    let stars = window.SaveState[name] ? window.SaveState[name].stars : 0;
                    let sprite = this.physics.add.sprite(positions[i][0], positions[i][1], 'level_' + name).setInteractive();
                    sprite.setOrigin(0.5);
                    sprite.on('pointerdown', (pointer) => {
                        window.LevelSetup = utils_5.LevelConfig[name];
                        this.scene.start('Level');
                    });
                    for (let j = 0; j < 3; j++) {
                        let fl = j < stars ? 'flag_ready' : 'flag_empty';
                        let offsetX = 18, stepX = 20, offsetY = 53;
                        let flag = this.physics.add.sprite(positions[i][0] - offsetX + stepX * j, positions[i][1] + offsetY, fl);
                        flag.setScale(0.4);
                        flag.setOrigin(0.5);
                        flag.setDepth(20);
                    }
                }
                else {
                    let sprite = this.physics.add.sprite(positions[i][0], positions[i][1], 'level_locked');
                    sprite.setOrigin(0.5);
                }
                prevName = name;
                i++;
            }
        }
        preload() {
            for (let name of utils_5.LevelOrder) {
                let data = utils_5.LevelConfig[name];
                this.load.image('level_' + name, data.heroOutro.pic);
            }
            this.load.image('level_locked', 'images/profile_locked.png');
            this.load.image('profile', 'images/menu/profile.png');
            this.load.image('flag_ready', 'images/flag_ready.png');
            this.load.image('flag_empty', 'images/flag_empty.png');
        }
    }
    exports.LevelSelectScene = LevelSelectScene;
});