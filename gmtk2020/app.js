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
                "Wingman",
                "",
                "Topic of GMTK Game Jam 2020 is “out of control”.",
                "",
                "We hope you’ll have as much fun as we did while developing B#.",
                "",
                "Enjoy!",
                "",
                "https://keepcalmgaming.github.io"
            ];
            var text = this.add.text(0, 0, content, { align: 'center' });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            let clicked = false;
            this.input.on('pointerdown', () => {
                if (!clicked || true) {
                    this.goHero();
                    clicked = true;
                }
            });
        }
        goHero() {
            window.heroPic = 'images/menu/profile.png';
            window.heroTxt = 'This is you. You need to get to the Finish.';
            this.scene.switch('hero');
        }
    }
    exports.GreetingScene = GreetingScene;
});
define("game/game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        constructor(x, y, isVertical) {
            this.isVertical = isVertical;
            this.X = x;
            this.Y = y;
            this.map = this.generateMap();
        }
        randomLabs() {
            return labs[0];
        }
        generateMap() {
            let result = [];
            if (!this.isVertical && false) {
                result = this.rotateMap(result);
            }
            return result;
        }
        rotateMap(map) {
            let rotatedMap = [];
            for (let y = 0; y < this.Y; y++) {
                let row = [];
                for (let x = 0; x < this.X; x++) {
                    row.push(map[x][y]);
                }
                rotatedMap.push(row);
            }
            return rotatedMap;
        }
        active() {
            return true;
        }
        randomCoords() {
            let spawnX = this.getRandNum(this.X);
            let spawnY = this.getRandNum(this.Y);
            return { x: spawnX, y: spawnY };
        }
        getRandNum(n) {
            return Math.floor(Math.random() * Math.floor(n));
        }
    }
    exports.Game = Game;
});
define("game/car", ["require", "exports", "game/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Car {
        constructor() {
            this.speed = 0;
        }
        setDriver(d) {
            this.driver = d;
            d.car = this;
        }
        setSpeed(speed) {
            this.speed = speed;
        }
        getNextStep() {
            return this.driver ? this.driver.getNextStep() : utils_1.Direction.Forward;
        }
    }
    exports.Car = Car;
});
define("game/driver", ["require", "exports", "game/utils", "game/car"], function (require, exports, utils_2, car_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EchoDriver {
        constructor() {
            this.car = new car_1.Car();
        }
        input(di) {
            switch (di) {
                case utils_2.DriverInput.Left:
                    console.log('ECHO LEFT');
                    break;
                case utils_2.DriverInput.Right:
                    console.log('ECHO RIGHT');
                    break;
                case utils_2.DriverInput.Cool:
                    console.log('ECHO COOL');
                    break;
                case utils_2.DriverInput.Crap:
                    console.log('ECHO CRAP');
                    break;
            }
        }
        getNextStep() {
            return utils_2.Direction.Forward;
        }
    }
    exports.EchoDriver = EchoDriver;
    class SimpleDriver {
        constructor() {
            this.car = new car_1.Car();
            this.nextDirection = utils_2.Direction.Forward;
        }
        input(di) {
            switch (di) {
                case utils_2.DriverInput.Left:
                    this.nextDirection = utils_2.Direction.Left;
                    break;
                case utils_2.DriverInput.Right:
                    this.nextDirection = utils_2.Direction.Right;
                    break;
                case utils_2.DriverInput.Cool:
                    this.car.setSpeed(this.car.speed + 1);
                    break;
                case utils_2.DriverInput.Crap:
                    let newSpeed = this.car.speed - 1;
                    if (newSpeed >= 0)
                        this.car.setSpeed(this.car.speed - 1);
                    break;
            }
        }
        getNextStep() {
            let result = this.nextDirection;
            this.nextDirection = utils_2.Direction.Forward;
            return result;
        }
    }
    exports.SimpleDriver = SimpleDriver;
});
define("game/utils", ["require", "exports", "game/driver"], function (require, exports, driver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DriverInput;
    (function (DriverInput) {
        DriverInput[DriverInput["Left"] = 0] = "Left";
        DriverInput[DriverInput["Right"] = 1] = "Right";
        DriverInput[DriverInput["Cool"] = 2] = "Cool";
        DriverInput[DriverInput["Crap"] = 3] = "Crap";
    })(DriverInput = exports.DriverInput || (exports.DriverInput = {}));
    var Direction;
    (function (Direction) {
        Direction[Direction["Left"] = 0] = "Left";
        Direction[Direction["Right"] = 1] = "Right";
        Direction[Direction["Forward"] = 2] = "Forward";
    })(Direction = exports.Direction || (exports.Direction = {}));
    class LevelInfo {
        constructor(driverConstructor, level) {
            this.driverConstructor = driverConstructor;
            this.level = level;
        }
    }
    exports.LevelInfo = LevelInfo;
    let level1 = {
        start: { x: 1, y: 1 },
        finish: { x: 5, y: 5 },
        flags: [{ x: 3, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 3 }]
    };
    exports.LevelsSettings = [
        new LevelInfo(() => new driver_1.EchoDriver(), level1),
        new LevelInfo(() => new driver_1.SimpleDriver(), level1)
    ];
});
define("scenes/Level", ["require", "exports", "game/game", "game/utils", "game/car", "game/driver"], function (require, exports, game_1, utils_3, car_2, driver_2) {
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
        constructor(sceneConfig) {
            super({ key: 'Level' });
            this.offsetX = 0;
            this.offsetY = 0;
            this.carX = 0;
            this.carY = 0;
            this.levelInfo = utils_3.LevelsSettings[0];
            this.car = new car_2.Car();
            this.driver = new driver_2.SimpleDriver();
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
            let rw = gameWidth / (this.x * 3 + 1);
            let rh = gameHeight / (this.y * 3 + 1);
            this.rectSize = rh < rw ? rh : rw;
            this.offsetX = (gameWidth - this.rectSize * (this.x * 3 + 1)) / 2;
            this.offsetY = (gameHeight - this.rectSize * (this.y * 3 + 1)) / 2;
            this.towergame = new game_1.Game(this.x, this.y, this.isVertical);
            console.log('Game Created', this.x, this.y, this.towergame);
        }
        create() {
            this.loadLevel();
            this.cameras.main.setBackgroundColor('#FFFFFF');
            this.setupHouses();
            this.setupCrossRoads();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
        }
        loadLevel() {
            let li = window.LevelSetup;
            this.levelInfo = li;
            this.car = new car_2.Car();
            this.driver = li.driverConstructor();
            this.car.setDriver(this.driver);
            this.carSprite = this.physics.add.sprite(this.offsetX + this.rectSize * 0.5, this.offsetY + this.rectSize * 0.5, 'car');
            this.scaleSprite(this.carSprite, this.rectSize * 0.5);
            this.setupControls();
            // TODO: set start/finish/flags from here
            let ls = li.level;
        }
        setupControls() {
            let mapping = [
                {
                    keys: [Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W],
                    value: utils_3.DriverInput.Cool
                },
                {
                    keys: [Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.SPACE, Phaser.Input.Keyboard.KeyCodes.ENTER],
                    value: utils_3.DriverInput.Crap
                },
                {
                    keys: [Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A],
                    value: utils_3.DriverInput.Left
                },
                {
                    keys: [Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D],
                    value: utils_3.DriverInput.Right
                }
            ];
            // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
            this.input.keyboard.on('keydown', (event) => {
                for (let data of mapping) {
                    for (let key of data.keys) {
                        if (event.keyCode === key) {
                            event.stopPropagation();
                            this.processInput(data.value);
                        }
                    }
                }
                console.log(event);
            });
            let sprite = this.physics.add.sprite(0, 0, 'arrow_right').setInteractive();
            sprite.x = gameWidth - 50;
            sprite.y = gameHeight - 50;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Right);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_down').setInteractive();
            sprite.x = gameWidth - 50 - 60;
            sprite.y = gameHeight - 50;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Crap);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_left').setInteractive();
            sprite.x = gameWidth - 50 - 120;
            sprite.y = gameHeight - 50;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Left);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_up').setInteractive();
            sprite.x = gameWidth - 50 - 60;
            sprite.y = gameHeight - 50 - 60;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Cool);
            });
        }
        showBubble(d) {
            if (!this.carSprite) {
                return;
            }
            let s = '', a = '';
            switch (d) {
                case utils_3.DriverInput.Left:
                    s = 'bubble_left';
                    a = 'left';
                    break;
                case utils_3.DriverInput.Right:
                    s = 'bubble_right';
                    a = 'right';
                    break;
                case utils_3.DriverInput.Crap:
                    s = 'bubble_down';
                    a = 'crap';
                    break;
                case utils_3.DriverInput.Cool:
                    s = 'bubble_up';
                    a = 'cool';
                    break;
            }
            let bubble = this.physics.add.sprite(this.carSprite.x + 15, this.carSprite.y + 15, s);
            bubble.setOrigin(0);
            let audio = this.sound.add(a);
            audio.play();
        }
        processInput(d) {
            console.log('LEVEL SCENE, PROCESS INPUT', d);
            // TODO: Draw bubbles here
            this.driver.input(d);
            this.showBubble(d);
        }
        update() {
            // console.log('update()')
            // this.input.on('pointerup', () => {
            //     if (!this.towergame.active()) {
            //         if (this.music) { this.music.destroy() }
            //       this.towergame = new Game(this.x, this.y, this.isVertical)
            //       this.scene.restart();
            //     }
            // });
        }
        setupHouses() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < maxSide; i++) {
                for (let j = 0; j < minSide; j++) {
                    field.fillRect(this.offsetX + this.rectSize * (3 * i + 1), this.offsetY + this.rectSize * (3 * j + 1), this.rectSize * 2, this.rectSize * 2);
                }
            }
        }
        setupEvents() {
            if (!this.crossroads || !this.carSprite)
                return;
            this.physics.add.collider(this.crossroads, this.carSprite, this.crossroadHit);
            this.time.addEvent({
                delay: 16,
                loop: true,
                callback: this.moveCar,
                callbackScope: this
            });
        }
        crossroadHit(car, crossroad) {
        }
        moveCar() {
            if (!this.car || !this.carSprite)
                return;
            // switch (this.car.getNextStep) {
            //     case Direction.Forward
            // }
            this.physics.moveTo(this.carSprite, this.carSprite.x + this.car.speed, this.carSprite.y);
        }
        setupCrossRoads() {
            this.crossroads = this.physics.add.group();
            for (let i = 0; i <= maxSide; i++) {
                for (let j = 0; j <= minSide; j++) {
                    let crossroad = this.crossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace');
                    // crossroad.alpha = 0
                    this.scaleSprite(crossroad, this.rectSize * 2);
                }
            }
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        preload() {
            this.load.image('car', 'images/car.png');
            this.load.image('arrow_left', 'images/arrow_left.png');
            this.load.image('arrow_right', 'images/arrow_right.png');
            this.load.image('arrow_up', 'images/arrow_up.png');
            this.load.image('arrow_down', 'images/arrow_down.png');
            this.load.image('bubble_left', 'images/bubble_left.png');
            this.load.image('bubble_right', 'images/bubble_right.png');
            this.load.image('bubble_up', 'images/bubble_up.png');
            this.load.image('bubble_down', 'images/bubble_down.png');
            this.load.image('towerplace', 'images/towerplace.png');
            this.load.audio('left', 'sounds/left.mp3');
            this.load.audio('right', 'sounds/right.mp3');
            this.load.audio('cool', 'sounds/nice.mp3');
            this.load.audio('crap', 'sounds/crap.mp3');
            // this.load.audio('music', 'sounds/NavigatorOST.mp3')
        }
    }
    exports.LevelScene = LevelScene;
});
define("scenes/level_select", ["require", "exports", "game/utils"], function (require, exports, utils_4) {
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
            let sprite = this.physics.add.sprite(0, 0, 'profile').setInteractive();
            sprite.x = halfWidth - 300;
            sprite.y = halfHeight;
            sprite.on('pointerdown', (pointer) => {
                window.LevelSetup = utils_4.LevelsSettings[0];
                this.scene.switch('Level');
            });
        }
        preload() {
            this.load.image('profile', 'images/menu/profile.png');
        }
    }
    exports.LevelSelectScene = LevelSelectScene;
});
// setupTowerSpawns() {
//     this.towerSpawns = []
//     for (let i=0; i<this.towergame.towerSpawns.length; i++) {
//         let towerSpawn = this.towergame.towerSpawns[i]
//         let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive()
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)
//         let position = this.getC(towerSpawn)
//         sprite.x = position.x
//         sprite.y = position.y
//         sprite.on('pointerdown', (pointer: any) => {
//             if (!this.tower) return
//             this.tower.x = sprite.x
//             this.tower.y = sprite.y
//         })
//         this.towerSpawns.push(sprite)
//     }
// }
// setupMonsterSpawns() {
//     this.monsterSpawns = []
//     for (let i=0; i<this.towergame.spawns.length; i++) {
//         let spawn = this.towergame.spawns[i]
//         let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)
//         let position = this.getC(spawn)
//         sprite.x = position.x;
//         sprite.y = position.y;
//         (sprite as any)['spawn'] = spawn
//         this.monsterSpawns.push(sprite)
//     }
// }
define("scenes/hero_scene", ["require", "exports", "game/utils"], function (require, exports, utils_5) {
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
            let imgPath = window.heroPic;
            this.load.once('complete', this.renderScene, this);
            this.load.image('img', imgPath);
            this.load.start();
        }
        renderScene() {
            let sprite = this.physics.add.sprite(0, 0, 'img').setInteractive();
            sprite.x = halfWidth - 300;
            sprite.y = halfHeight;
            let content = window.heroTxt;
            var text = this.add.text(0, 0, content, { align: 'left' });
            var bounds = text.getBounds();
            text.x = halfWidth - 100;
            text.y = halfHeight - bounds.height / 2;
            let clicked = false;
            this.input.on('pointerdown', () => {
                if (!clicked || true) {
                    window.LevelSetup = utils_5.LevelsSettings[0];
                    this.scene.switch('Level');
                }
            });
        }
        preload() {
            this.load.image('profile', 'images/menu/profile.png');
        }
    }
    exports.HeroScene = HeroScene;
});
// setupTowerSpawns() {
//     this.towerSpawns = []
//     for (let i=0; i<this.towergame.towerSpawns.length; i++) {
//         let towerSpawn = this.towergame.towerSpawns[i]
//         let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive()
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)
//         let position = this.getC(towerSpawn)
//         sprite.x = position.x
//         sprite.y = position.y
//         sprite.on('pointerdown', (pointer: any) => {
//             if (!this.tower) return
//             this.tower.x = sprite.x
//             this.tower.y = sprite.y
//         })
//         this.towerSpawns.push(sprite)
//     }
// }
// setupMonsterSpawns() {
//     this.monsterSpawns = []
//     for (let i=0; i<this.towergame.spawns.length; i++) {
//         let spawn = this.towergame.spawns[i]
//         let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)
//         let position = this.getC(spawn)
//         sprite.x = position.x;
//         sprite.y = position.y;
//         (sprite as any)['spawn'] = spawn
//         this.monsterSpawns.push(sprite)
//     }
// }
define("app", ["require", "exports", "scenes/greeting", "scenes/Level", "scenes/level_select", "scenes/hero_scene"], function (require, exports, greeting_1, Level_1, level_select_1, hero_scene_1) {
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
        scene: [greeting_1.GreetingScene, Level_1.LevelScene, level_select_1.LevelSelectScene, hero_scene_1.HeroScene]
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
define("scenes/main", ["require", "exports", "game/game"], function (require, exports, game_2) {
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
        constructor(sceneConfig) {
            super({ key: 'main' });
            this.offsetX = 0;
            this.offsetY = 0;
            this.towerSpawns = [];
            this.monsterSpawns = [];
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
            this.towergame = new game_2.Game(this.x, this.y, this.isVertical);
            console.log('Game Created', this.x, this.y, this.towergame);
        }
        create() {
            this.cameras.main.setBackgroundColor('#E8745A');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupMainframe();
            this.setupWalls();
            this.setupTowerSpawns();
            this.setupTower();
            this.setupMonsterSpawns();
            this.setupText();
            this.setupEvents();
            this.music = this.sound.add('music');
            this.music.play();
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
            this.input.on('pointerup', () => {
                if (!this.towergame.active()) {
                    if (this.music) {
                        this.music.destroy();
                    }
                    this.towergame = new game_2.Game(this.x, this.y, this.isVertical);
                    this.scene.restart();
                }
            });
        }
        setupMainframe() {
            this.mfGroup = this.physics.add.staticGroup();
            this.mainframe = this.mfGroup.create(0, 0, 'mainframe');
            this.scaleSprite(this.mainframe, this.rectSize * 2);
            this.mainframe.setOrigin(0);
            let position = this.getC(this.towergame.mainframe);
            this.mainframe.x = position.x;
            this.mainframe.y = position.y;
            this.mainframe['refreshBody'].call(this.mainframe);
        }
        setupWalls() {
            for (let i = 0; i < this.towergame.walls.length; i++) {
                let wall = this.towergame.walls[i];
                let sprite = this.physics.add.sprite(0, 0, 'wallbrick');
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(wall);
                sprite.x = position.x;
                sprite.y = position.y;
            }
        }
        setupTower() {
            this.tower = this.physics.add.sprite(0, 0, 'tower');
            this.scaleSprite(this.tower, this.rectSize);
            this.tower.setOrigin(0);
            let coord = this.towergame.towerSpawns ? this.towergame.towerSpawns[0] : { x: 0, y: 0 };
            let position = this.getC(coord);
            this.tower.x = position.x;
            this.tower.y = position.y;
        }
        setupTowerSpawns() {
            this.towerSpawns = [];
            for (let i = 0; i < this.towergame.towerSpawns.length; i++) {
                let towerSpawn = this.towergame.towerSpawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive();
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(towerSpawn);
                sprite.x = position.x;
                sprite.y = position.y;
                sprite.on('pointerdown', (pointer) => {
                    if (!this.tower)
                        return;
                    this.tower.x = sprite.x;
                    this.tower.y = sprite.y;
                });
                this.towerSpawns.push(sprite);
            }
        }
        setupMonsterSpawns() {
            this.monsterSpawns = [];
            for (let i = 0; i < this.towergame.spawns.length; i++) {
                let spawn = this.towergame.spawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'monsterplace');
                this.scaleSprite(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(spawn);
                sprite.x = position.x;
                sprite.y = position.y;
                sprite['spawn'] = spawn;
                this.monsterSpawns.push(sprite);
            }
        }
        setupEvents() {
            if (!this.mainframe || !this.mfGroup)
                return;
            this.monsters = this.physics.add.group();
            this.physics.add.collider(this.monsters, this.mfGroup, this.mainframeHit);
            this.bullets = this.physics.add.group();
            this.physics.add.collider(this.monsters, this.bullets, this.bulletHit);
            // MONSTER SPAWNS
            for (let monsterSpawn of this.monsterSpawns) {
                this.time.addEvent({
                    delay: 3000,
                    loop: true,
                    callback: this.createMonster,
                    callbackScope: this,
                    args: [monsterSpawn]
                });
            }
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: this.towerShoot,
                callbackScope: this
            });
        }
        towerShoot() {
            if (!this.tower || !this.monsters || !this.bullets)
                return;
            let minDistance = 999999;
            let closestMonster = null;
            for (let monster of this.monsters.getChildren()) {
                let distance = Phaser.Math.Distance.Between(this.tower.x, this.tower.y, monster.x, monster.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestMonster = monster;
                }
            }
            if (closestMonster && minDistance < this.rectSize * 5) {
                let bullet = this.bullets.create(this.tower.x + this.rectSize / 2, this.tower.y + this.rectSize / 2, 'bullet');
                let scale = this.getScale(bullet, this.rectSize);
                bullet.setScale(scale);
                bullet.setOrigin(0.5);
                bullet.setCircle(20 * scale, bullet.width / 2, bullet.height / 2);
                this.physics.moveTo(bullet, closestMonster.x + this.rectSize / 2, closestMonster.y + this.rectSize / 2, this.rectSize * 4);
            }
        }
        bulletHit(o1, o2) {
            let scene = o1['scene'];
            o1.destroy();
            o2.destroy();
            if (scene.towergame.active()) {
                scene.towergame.score++;
                if (!scene.textScore)
                    return;
                scene.textScore.setText(`SCORE: ${scene.towergame.score}`);
            }
        }
        mainframeHit(monster, mainframe) {
            monster.destroy();
            let scene = mainframe['scene'];
            scene.towergame.lives--;
            if (!scene.textLives)
                return;
            if (scene.towergame.lives > 0) {
                scene.textLives.setText(`LIVES: ${scene.towergame.lives}`);
            }
            else {
                scene.textLives.setText('YOU DIED');
            }
        }
        createMonster(spawn) {
            if (!this.monsters)
                return;
            if (!this.towergame)
                return;
            if (!this.towergame.active())
                return;
            let mfc = this.getMFC();
            let spawnpoint = spawn['spawn'];
            let path = this.buildPath(this.towergame.createMonsterPass(spawnpoint));
            let monster = this.add.follower(path, spawn.x, spawn.y, 'monster');
            this.monsters.add(monster);
            this.scaleSprite(monster, this.rectSize);
            monster.setOrigin(0);
            monster.x = spawn.x;
            monster.y = spawn.y;
            monster.startFollow({
                duration: 15000,
                from: 0,
                to: 1
            });
        }
        buildPath(cells) {
            console.log('building path for', cells);
            let start = this.getC(cells[0]);
            let path = this.add.path(start.x, start.y);
            for (let i = 1; i < cells.length; i++) {
                let pos1 = this.getC(cells[i - 1]);
                let pos2 = this.getC(cells[i]);
                let p1 = new Phaser.Math.Vector2(pos1.x, pos1.y);
                let p2 = new Phaser.Math.Vector2(pos2.x, pos2.y);
                path.add(new Phaser.Curves.Line(p1, p2));
            }
            return path;
        }
        setupText() {
            this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' });
            this.textScore = this.add.text(gameWidth - 120, 20, `SCORE: ${this.towergame.score}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' });
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        getMFC() {
            let mf = this.towergame.mainframe;
            return this.getC({ x: mf.x + 1, y: mf.y + 1 });
        }
        getC(c) {
            return {
                x: this.getCX(c.x),
                y: this.getCY(c.y)
            };
        }
        getCX(x) { return this.offsetX + x * this.rectSize; }
        getCY(y) { return this.offsetY + y * this.rectSize; }
        preload() {
            this.load.image('bullet', 'images/bullet2.png');
            this.load.image('mainframe', 'images/mainframe.png');
            this.load.image('monster', 'images/monster.png');
            this.load.image('monsterplace', 'images/monsterplace.png');
            this.load.image('tower', 'images/tower.png');
            this.load.image('towerplace', 'images/towerplace.png');
            this.load.image('wallbrick', 'images/wallbrick.png');
            this.load.audio('music', 'sounds/GameOST.mp3');
        }
        debugDrawGrid() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(this.getCX(i), this.getCY(j), this.rectSize, this.rectSize);
                }
            }
        }
    }
    exports.MainScene = MainScene;
});
//# sourceMappingURL=app.js.map