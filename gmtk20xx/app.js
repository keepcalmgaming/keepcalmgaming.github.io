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
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(i * 10, j * 10, this.rectSize, this.rectSize);
                }
            }
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
define("game/driver", ["require", "exports", "game/utils", "game/car"], function (require, exports, utils_1, car_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EchoDriver {
        constructor() {
            this.car = new car_1.Car();
            this.direction = utils_1.Direction.Forward;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.direction = utils_1.Direction.Left;
                    console.log('ECHO LEFT');
                    break;
                case utils_1.DriverInput.Right:
                    this.direction = utils_1.Direction.Right;
                    console.log('ECHO RIGHT');
                    break;
                case utils_1.DriverInput.Cool:
                    console.log('ECHO COOL');
                    break;
                case utils_1.DriverInput.Crap:
                    console.log('ECHO CRAP');
                    break;
            }
        }
        getNextStep() {
            return this.direction;
        }
        flushDirection() {
            this.direction = utils_1.Direction.Forward;
        }
    }
    exports.EchoDriver = EchoDriver;
    class SimpleDriver {
        constructor() {
            this.car = new car_1.Car();
            this.nextDirection = utils_1.Direction.Forward;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.nextDirection = utils_1.Direction.Left;
                    break;
                case utils_1.DriverInput.Right:
                    this.nextDirection = utils_1.Direction.Right;
                    break;
                case utils_1.DriverInput.Cool:
                    this.car.setSpeed(this.car.speed + 1);
                    break;
                case utils_1.DriverInput.Crap:
                    let newSpeed = this.car.speed - 1;
                    if (newSpeed >= 0)
                        this.car.setSpeed(this.car.speed - 1);
                    break;
            }
        }
        getNextStep() {
            let result = this.nextDirection;
            this.flushDirection();
            return result;
        }
        flushDirection() {
            this.nextDirection = utils_1.Direction.Forward;
        }
    }
    exports.SimpleDriver = SimpleDriver;
    class Misha {
        constructor() {
            this.car = new car_1.Car();
            this.direction = utils_1.Direction.Forward;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.direction = utils_1.Direction.Right;
                    console.log('RIGHT');
                    break;
                case utils_1.DriverInput.Right:
                    this.direction = utils_1.Direction.Left;
                    console.log('LEFT');
                    break;
                case utils_1.DriverInput.Cool:
                    console.log('Misha says: well, technically its not cool, but i got your point, thank you.');
                    break;
                case utils_1.DriverInput.Crap:
                    console.log('Misha says: indeed');
                    break;
            }
        }
        getNextStep() {
            return this.direction;
        }
        flushDirection() {
            this.direction = utils_1.Direction.Forward;
        }
    }
    exports.Misha = Misha;
    class Ahmed {
        constructor() {
            this.car = new car_1.Car();
            this.isTriggered = false;
            this.direction = utils_1.Direction.Forward;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.direction = isTriggered ? utils_1.Direction.Left : utils_1.Direction.Right;
                    break;
                case utils_1.DriverInput.Right:
                    this.direction = isTriggerd ? utils_1.Direction.Left : utils_1.Direction.Right;
                    break;
                case utils_1.DriverInput.Cool:
                    isTriggered = !isTriggered;
                    break;
                case utils_1.DriverInput.Crap:
                    isTriggered = !isTriggered;
                    break;
            }
        }
        getNextStep() {
            return this.direction;
        }
        flushDirection() {
            this.direction = utils_1.Direction.Forward;
            this.isTriggered = false;
        }
    }
    exports.Ahmed = Ahmed;
    // 1. Your driver Danny listens carefully to all your commands and executes them. He is a reliable driver. Others are not.
    // 2. Your driver Misha always performs reversed commands. He had a tough childhood.
    // 2.5. Your driver Ahmed always performs reversed commands. If you swear or compliment, he performs commands normally. If you swear or compliment once more, he performs commands reversely. 
    // 3. Your driver Jessica always turns left if he doesn't hear any command. Command "right" makes he move forward. Command "left" makes him turn right. Classic Jessica.
    // 4. Your driver Lloyd always performs your penultimate command. His first move is random.
    // 5. Your driver Elon always goes with perfect route ignoring all your commands. He's out of control.
    class Jessica {
        constructor() {
            this.car = new car_1.Car();
            this.direction = utils_1.Direction.Left;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.direction = utils_1.Direction.Forward;
                    break;
                case utils_1.DriverInput.Right:
                    this.direction = utils_1.Direction.Forward;
                    break;
                case utils_1.DriverInput.Cool:
                    console.log('Thank you!');
                    break;
                case utils_1.DriverInput.Crap:
                    console.log('Well that wasn\'t so nice.');
                    break;
            }
        }
        getNextStep() {
            return this.direction;
        }
        flushDirection() {
            this.direction = utils_1.Direction.Left;
        }
    }
    exports.Jessica = Jessica;
    class Lloyd {
        constructor() {
            this.car = new car_1.Car();
            this.directions = [utils_1.Direction.Forward, utils_1.Direction.Left, utils_1.Direction.Right];
            this.direction = directions[Math.floor(Math.random() * directions.length)];
            this.previous = direction;
        }
        input(di) {
            switch (di) {
                case utils_1.DriverInput.Left:
                    this.direction = this.previous;
                    this.previous = utils_1.Direction.Left;
                    break;
                case utils_1.DriverInput.Right:
                    this.direction = this.previous;
                    this.previous = utils_1.Direction.Left;
                    break;
                case utils_1.DriverInput.Cool:
                    console.log('Thank you!');
                    break;
                case utils_1.DriverInput.Crap:
                    console.log('Well that wasn\'t so nice.');
                    break;
            }
        }
        getNextStep() {
            return this.direction;
        }
        flushDirection() {
            this.direction = this.directions[Math.floor(Math.random() * directions.length)];
        }
    }
    exports.Lloyd = Lloyd;
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
    var Movement;
    (function (Movement) {
        Movement[Movement["Left"] = 0] = "Left";
        Movement[Movement["Right"] = 1] = "Right";
        Movement[Movement["Up"] = 2] = "Up";
        Movement[Movement["Down"] = 3] = "Down";
    })(Movement = exports.Movement || (exports.Movement = {}));
    let level1 = {
        start: { x: 4, y: 0 },
        finish: { x: 0, y: 7 },
        flags: [{ x: 4, y: 1 }, { x: 1, y: 3 }, { x: 7, y: 1 }],
        direction: Movement.Up
    }; //Danny
    let level2 = {
        start: { x: 0, y: 0 },
        finish: { x: 8, y: 7 },
        flags: [{ x: 3, y: 3 }, { x: 5, y: 5 }, { x: 8, y: 1 }],
        direction: Movement.Up
    }; //Misha
    let level3 = {
        start: { x: 7, y: 0 },
        finish: { x: 0, y: 8 },
        flags: [{ x: 5, y: 3 }, { x: 8, y: 5 }, { x: 0, y: 1 }],
        direction: Movement.Up
    }; //Ahmed
    let level4 = {
        start: { x: 3, y: 3 },
        finish: { x: 6, y: 6 },
        flags: [{ x: 0, y: 0 }, { x: 2, y: 5 }, { x: 8, y: 7 }],
        direction: Movement.Up
    }; //Jessica
    let level5 = {
        start: { x: 4, y: 0 },
        finish: { x: 7, y: 0 },
        flags: [{ x: 1, y: 6 }, { x: 6, y: 3 }, { x: 3, y: 7 }],
        direction: Movement.Up
    }; //Floyd
    let level6 = {
        start: { x: 1, y: 1 },
        finish: { x: 0, y: 0 },
        flags: [{ x: 3, y: 3 }, { x: 4, y: 5 }, { x: 7, y: 7 }],
        direction: Movement.Up
    }; //Elon
    let defaultHero = {
        pic: 'images/menu/profile.png',
        text: 'Dummy Text for Hero Screen'
    };
    class LevelInfo {
        constructor(driverConstructor, level, name = 'default', heroOutro = defaultHero, heroIntro = defaultHero) {
            this.driverConstructor = driverConstructor;
            this.level = level;
            this.name = name;
            this.heroOutro = heroOutro;
            this.heroIntro = heroIntro;
        }
    }
    exports.LevelInfo = LevelInfo;
    exports.LevelOrder = ['danny', 'misha', 'alex', 'yappie', 'elon'];
    exports.LevelConfig = {
        danny: new LevelInfo(() => new driver_1.EchoDriver(), level1, 'danny', {
            pic: 'images/profile_danny.png',
            text: "But you are not the driver.\n\nYour driver Danny listens carefully to all your commands and executes them. He is a reliable driver.\n\nOthers are not.",
            name: 'intro'
        }, {
            pic: 'images/profile_player.png',
            text: 'This is you.\n\nYou need to get to the Finish.',
            name: 'beginning'
        }),
        alex: new LevelInfo(() => new driver_1.Ahmed(), level3, 'alex', {
            pic: 'images/profile_alex.png',
            text: 'Your driver Ahmed always performs reversed commands. If you swear or compliment, he performs commands normally. If you swear or compliment once more, he performs commands reversely.',
            name: 'alex'
        }),
        yappie: new LevelInfo(() => new driver_1.Jessica(), level4, 'yappie', {
            pic: 'images/profile_yappie.png',
            text: `Your driver Jessica always turns left if he doesn't hear any command. Command "right" makes he move forward. Command "left" makes him turn right. Classic Jessica.`,
            name: 'yappie'
        }),
        misha: new LevelInfo(() => new driver_1.Misha(), level2, 'misha', {
            pic: 'images/profile_misha.png',
            text: 'Your driver Misha always performs reversed commands. He had a tough childhood.',
            name: 'misha'
        }),
        elon: new LevelInfo(() => new driver_1.Lloyd(), level6, 'elon', {
            pic: 'images/profile_elon.png',
            text: "Your driver Floyd always performs your penultimate command. His first move is random.",
            name: 'elon'
        }),
        lloyd: new LevelInfo(() => new driver_1.Lloyd(), level5, 'lloyd', {
            pic: 'images/profile_elon.png',
            text: "Your driver Elon always goes with perfect route ignoring all your commands. He's out of control.",
            name: 'elon'
        })
    };
});
define("game/car", ["require", "exports", "game/utils"], function (require, exports, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Car {
        constructor() {
            this.speed = 0;
            this.horizontalSpeed = 0;
            this.verticalSpeed = 0;
        }
        setDriver(d) {
            this.driver = d;
            d.car = this;
        }
        setSpeed(speed) {
            this.speed = speed;
        }
        setMovementDirection(m) {
            switch (m) {
                case utils_2.Movement.Down:
                    this.verticalSpeed = this.speed;
                    this.horizontalSpeed = 0;
                    break;
                case utils_2.Movement.Up:
                    this.verticalSpeed = -this.speed;
                    this.horizontalSpeed = 0;
                    break;
                case utils_2.Movement.Right:
                    this.horizontalSpeed = this.speed;
                    this.verticalSpeed = 0;
                    break;
                case utils_2.Movement.Left:
                    this.horizontalSpeed = -this.speed;
                    this.verticalSpeed = 0;
                    break;
            }
        }
        getNextStep() {
            return this.driver ? this.driver.getNextStep() : utils_2.Direction.Forward;
        }
        flushDirection() {
            this.driver.flushDirection();
        }
        getMovementDirection() {
            if (this.horizontalSpeed > 0) {
                return utils_2.Movement.Right;
            }
            else if (this.horizontalSpeed < 0) {
                return utils_2.Movement.Left;
            }
            else {
                if (this.verticalSpeed > 0) {
                    return utils_2.Movement.Down;
                }
                else {
                    return utils_2.Movement.Up;
                }
            }
        }
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
        constructor(sceneConfig) {
            super({ key: 'Level' });
            this.offsetX = 0;
            this.offsetY = 0;
            this.carX = 0;
            this.carY = 0;
            this.stars = 0;
            this.levelInfo = utils_3.LevelConfig.danny;
            this.car = new car_2.Car();
            this.driver = new driver_2.EchoDriver();
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
            console.log('Game Created', this.x, this.y);
        }
        create() {
            this.stars = 0;
            this.loadLevel();
            this.cameras.main.setBackgroundColor('#FFFFFF');
            this.setupHouses();
            this.setupCrossRoads();
            this.setupEvents();
        }
        getRows() {
            if (this.isVertical) {
                return maxSide;
            }
            return minSide;
        }
        getCols() {
            if (this.isVertical) {
                return minSide;
            }
            return maxSide;
        }
        loadLevel() {
            let li = window.LevelSetup;
            this.levelInfo = li;
            this.car = new car_2.Car();
            this.driver = li.driverConstructor();
            this.car.setDriver(this.driver);
            this.defaultSpeed = this.rectSize / 11;
            this.car.setSpeed(this.defaultSpeed);
            let initialDirection = li.direction;
            //TODO fix
            initialDirection = utils_3.Movement.Right;
            this.car.setMovementDirection(initialDirection);
            let ls = li.level;
            this.carSprite = this.physics.add.sprite(this.offsetX + this.rectSize * (3 * ls.start.x + 0.5), this.offsetY + this.rectSize * (3 * ls.start.y + 0.5), 'car');
            this.carSprite.setDepth(20);
            switch (initialDirection) {
                case utils_3.Movement.Right:
                    this.carSprite.setAngle(90);
                    break;
                case utils_3.Movement.Left:
                    this.carSprite.setAngle(270);
                    break;
                case utils_3.Movement.Down:
                    this.carSprite.setAngle(180);
                    break;
            }
            this.scaleSprite(this.carSprite, this.rectSize * 0.9);
            this.setupControls();
            // TODO: set start/finish/flags from here
            let startSprite = this.physics.add.sprite(this.getX(ls.start.x), this.getY(ls.start.y), 'start');
            startSprite.setOrigin(0.5);
            this.scaleSprite(startSprite, this.rectSize);
            startSprite.setDepth(15);
            let finishSprite = this.physics.add.sprite(this.getX(ls.finish.x), this.getY(ls.finish.y), 'finish');
            finishSprite.setOrigin(0.5);
            this.scaleSprite(finishSprite, this.rectSize);
            finishSprite.setDepth(15);
            this.physics.add.collider(finishSprite, this.carSprite, () => {
                this.time.addEvent({
                    delay: 300,
                    loop: false,
                    callback: () => {
                        this.finishLevel();
                    }
                });
            });
            this.flags = this.physics.add.group();
            for (let flag of ls.flags) {
                let flagSprite = this.physics.add.sprite(this.getX(flag.x), this.getY(flag.y), 'flag_ready');
                flagSprite.setOrigin(0.5);
                this.scaleSprite(flagSprite, this.rectSize);
                flagSprite.setDepth(15);
                this.flags.add(flagSprite);
            }
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
            sprite.setDepth(100);
            sprite.x = gameWidth - 50;
            sprite.y = gameHeight - 50;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Right);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_down').setInteractive();
            sprite.setDepth(100);
            sprite.x = gameWidth - 50;
            sprite.y = gameHeight - 50 - 60;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Crap);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_left').setInteractive();
            sprite.setDepth(100);
            sprite.x = gameWidth - 50 - 60;
            sprite.y = gameHeight - 50;
            sprite.on('pointerdown', (pointer) => {
                this.processInput(utils_3.DriverInput.Left);
            });
            sprite = this.physics.add.sprite(0, 0, 'arrow_up').setInteractive();
            sprite.setDepth(100);
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
            let bubble = this.physics.add.sprite(this.carSprite.x + 10, this.carSprite.y - 10, s);
            this.scaleSprite(bubble, this.rectSize * 2);
            bubble.setOrigin(0, 1);
            bubble.setDepth(30);
            bubble.setScale(0.1);
            this.tweens.addCounter({
                from: 0.1,
                to: 1,
                duration: 300,
                onUpdate: (tween) => {
                    let value = tween.getValue();
                    bubble.setScale(value);
                }
            });
            this.tweens.addCounter({
                from: 1,
                to: 0.1,
                delay: 700,
                duration: 200,
                onUpdate: (tween) => {
                    let value = tween.getValue();
                    bubble.setScale(value);
                }
            });
            this.tweens.addCounter({
                duration: 1000,
                onUpdate: (tween) => {
                    bubble.x = this.carSprite.x + 10;
                    bubble.y = this.carSprite.y - 10;
                }
            });
            this.time.addEvent({
                delay: 900,
                loop: false,
                callback: () => { bubble.destroy(); }
            });
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
        randomTile() {
            let tiles = ['tile_1', 'tile_2', 'tile_3', 'tile_4'];
            return tiles[Math.floor(Math.random() * tiles.length)];
        }
        setupHouses() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < maxSide; i++) {
                for (let j = 0; j < minSide; j++) {
                    // field.fillRect(this.offsetX + this.rectSize * (3 * i + 1), this.offsetY + this.rectSize * (3 * j + 1), this.rectSize * 2, this.rectSize * 2);
                    let sprite = this.physics.add.sprite(this.offsetX + this.rectSize * (3 * i + 1), this.offsetY + this.rectSize * (3 * j + 1), this.randomTile());
                    sprite.setOrigin(0);
                    this.scaleSprite(sprite, this.rectSize * 2);
                }
            }
        }
        setupEvents() {
            if (!this.bigCrossroads || !this.smallCrossroads || !this.flags || !this.carSprite)
                return;
            this.physics.add.collider(this.bigCrossroads, this.carSprite, this.bigCrossroadHit.bind(this));
            this.physics.add.overlap(this.smallCrossroads, this.carSprite, this.smallCrossroadHit.bind(this));
            this.physics.add.collider(this.flags, this.carSprite, this.flagHit.bind(this));
            this.time.addEvent({
                delay: 16,
                loop: true,
                callback: this.moveCar,
                callbackScope: this
            });
        }
        flagHit(carSprite, flag) {
            this.stars++;
            let flagSprite = this.physics.add.sprite(flag.x, flag.y, 'flag_empty');
            flagSprite.setOrigin(0.5);
            this.scaleSprite(flagSprite, this.rectSize);
            flagSprite.setDepth(15);
            flag.destroy();
        }
        bigCrossroadHit(carSprite, crossroad) {
            if (crossroad === this.prevBigCrossRoad)
                return;
            this.prevBigCrossRoad = crossroad;
            let angle = carSprite.angle;
            this.car.speed;
            let angleChange = 0;
            this.currentNextStep = this.car.getNextStep();
            if (!this.canGo(this.currentNextStep)) {
                this.currentNextStep = this.resolveCurrentNextStep();
            }
            this.car.flushDirection();
            switch (this.currentNextStep) {
                case utils_3.Direction.Left:
                    angleChange = -90;
                    break;
                case utils_3.Direction.Right:
                    angleChange = 90;
                    break;
            }
            this.tweens.addCounter({
                from: angle,
                to: angle + angleChange,
                delay: 150,
                duration: 100,
                onUpdate: (tween) => {
                    let value = tween.getValue();
                    carSprite.setAngle(value);
                }
            });
        }
        resolveCurrentNextStep() {
            if (this.canGo(utils_3.Direction.Forward)) {
                return utils_3.Direction.Forward;
            }
            else if (this.canGo(utils_3.Direction.Right)) {
                return utils_3.Direction.Right;
            }
            return utils_3.Direction.Left;
        }
        canGo(d) {
            switch (d) {
                case utils_3.Direction.Forward:
                    switch (this.car.getMovementDirection()) {
                        case utils_3.Movement.Down:
                            return this.prevBigCrossRoad.mapPositionY < this.getRows();
                        case utils_3.Movement.Left:
                            return this.prevBigCrossRoad.mapPositionX > 0;
                        case utils_3.Movement.Right:
                            return this.prevBigCrossRoad.mapPositionX < this.getCols();
                        case utils_3.Movement.Up:
                            return this.prevBigCrossRoad.mapPositionY > 0;
                    }
                    break;
                case utils_3.Direction.Left:
                    switch (this.car.getMovementDirection()) {
                        case utils_3.Movement.Down:
                            return this.prevBigCrossRoad.mapPositionX != this.getCols();
                        case utils_3.Movement.Left:
                            return this.prevBigCrossRoad.mapPositionY != this.getRows();
                        case utils_3.Movement.Right:
                            return this.prevBigCrossRoad.mapPositionY != 0;
                        case utils_3.Movement.Up:
                            return this.prevBigCrossRoad.mapPositionX != 0;
                    }
                    break;
                case utils_3.Direction.Right:
                    switch (this.car.getMovementDirection()) {
                        case utils_3.Movement.Down:
                            return this.prevBigCrossRoad.mapPositionX != 0;
                        case utils_3.Movement.Left:
                            return this.prevBigCrossRoad.mapPositionY != 0;
                        case utils_3.Movement.Right:
                            return this.prevBigCrossRoad.mapPositionY != this.getRows();
                        case utils_3.Movement.Up:
                            return this.prevBigCrossRoad.mapPositionX != this.getCols();
                    }
                    break;
            }
        }
        smallCrossroadHit(carSprite, crossroad) {
            if (crossroad === this.prevSmallCrossRoad)
                return;
            let duration = 200;
            let verticalCounter = {
                from: this.carSprite.y,
                to: crossroad.y,
                duration: duration,
                onUpdate: (tween) => {
                    this.carSprite.y = tween.getValue();
                }
            };
            let horizontalCounter = {
                from: this.carSprite.x,
                to: crossroad.x,
                duration: duration,
                onUpdate: (tween) => {
                    this.carSprite.x = tween.getValue();
                }
            };
            let speedStep = this.defaultSpeed;
            this.prevSmallCrossRoad = crossroad;
            switch (this.currentNextStep) {
                case utils_3.Direction.Left:
                    if (this.car.verticalSpeed > 0) {
                        this.car.verticalSpeed = 0;
                        this.car.horizontalSpeed = speedStep;
                        this.tweens.addCounter(verticalCounter);
                    }
                    else if (this.car.verticalSpeed < 0) {
                        this.car.verticalSpeed = 0;
                        this.car.horizontalSpeed = -speedStep;
                        this.tweens.addCounter(verticalCounter);
                    }
                    else {
                        if (this.car.horizontalSpeed > 0) {
                            this.car.verticalSpeed = -speedStep;
                            this.car.horizontalSpeed = 0;
                            this.tweens.addCounter(horizontalCounter);
                        }
                        else {
                            this.car.verticalSpeed = speedStep;
                            this.car.horizontalSpeed = 0;
                            this.tweens.addCounter(horizontalCounter);
                        }
                    }
                    break;
                case utils_3.Direction.Right:
                    if (this.car.verticalSpeed > 0) {
                        this.car.verticalSpeed = 0;
                        this.car.horizontalSpeed = -speedStep;
                        this.tweens.addCounter(verticalCounter);
                    }
                    else if (this.car.verticalSpeed < 0) {
                        this.car.verticalSpeed = 0;
                        this.car.horizontalSpeed = speedStep;
                        this.tweens.addCounter(verticalCounter);
                    }
                    else {
                        if (this.car.horizontalSpeed > 0) {
                            this.car.verticalSpeed = speedStep;
                            this.car.horizontalSpeed = 0;
                            this.tweens.addCounter(horizontalCounter);
                        }
                        else {
                            this.car.verticalSpeed = -speedStep;
                            this.car.horizontalSpeed = 0;
                            this.tweens.addCounter(horizontalCounter);
                        }
                    }
                    break;
            }
        }
        moveCar() {
            if (!this.car || !this.carSprite)
                return;
            console.log('moving car');
            this.carSprite.x = this.carSprite.x + this.car.horizontalSpeed;
            this.carSprite.y = this.carSprite.y + this.car.verticalSpeed;
        }
        setupCrossRoads() {
            this.bigCrossroads = this.physics.add.group();
            for (let i = 0; i <= maxSide; i++) {
                for (let j = 0; j <= minSide; j++) {
                    let crossroad = this.bigCrossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace');
                    crossroad.alpha = 0;
                    crossroad.mapPositionX = i;
                    crossroad.mapPositionY = j;
                    this.scaleSprite(crossroad, this.rectSize * 2);
                    if (!this.prevBigCrossRoad && i == this.levelInfo.level.start.x && j == this.levelInfo.level.start.y) {
                        this.prevBigCrossRoad = crossroad;
                    }
                }
            }
            this.smallCrossroads = this.physics.add.group();
            for (let i = 0; i <= maxSide; i++) {
                for (let j = 0; j <= minSide; j++) {
                    let crossroad = this.smallCrossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace');
                    crossroad.alpha = 0;
                    this.scaleSprite(crossroad, this.rectSize * 0.75);
                    if (!this.prevSmallCrossRoad && i == this.levelInfo.level.start.x && j == this.levelInfo.level.start.y) {
                        this.prevSmallCrossRoad = crossroad;
                    }
                }
            }
        }
        getX(i) {
            return this.offsetX + this.rectSize * (3 * i + 0.5);
        }
        getY(i) {
            return this.offsetY + this.rectSize * (3 * i + 0.5);
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        finishLevel() {
            window.Result = {
                stars: this.stars,
                name: this.levelInfo.name
            };
            let heroInfo = Object.assign({}, utils_3.LevelConfig[this.levelInfo.name].heroOutro);
            if (this.stars == 0) {
                heroInfo.text = 'You finished the level! Get at least one flag to get to know your driver better.';
            }
            window.HeroSettings = heroInfo;
            this.scene.stop('Level');
            this.scene.switch('hero');
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
            this.load.image('start', 'images/start.png');
            this.load.image('finish', 'images/finish.png');
            this.load.image('flag_ready', 'images/flag_ready.png');
            this.load.image('flag_empty', 'images/flag_empty.png');
            this.load.image('tile_1', 'images/tile_1.png');
            this.load.image('tile_2', 'images/tile_2.png');
            this.load.image('tile_3', 'images/tile_3.png');
            this.load.image('tile_4', 'images/tile_4.png');
            // this.load.audio('music', 'sounds/NavigatorOST.mp3')
        }
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
//# sourceMappingURL=app.js.map