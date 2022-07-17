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
                "Calendice",
                "",
                "Calendice is a game where you need to SEIZE THE DAY.",
                "You SEIZE THE DAY if you roll the number of the day of the week.",
                "1 for Mondays, 2 for Tuesdays,.. 6 for Saturdays.",
                "You do not roll on Sundays, Sunday is a Shopping day.",
                "Use powerups and SEIZE as much days as you can!",
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
define("game/calendar", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DayOfWeek;
    (function (DayOfWeek) {
        DayOfWeek[DayOfWeek["Monday"] = 1] = "Monday";
        DayOfWeek[DayOfWeek["Tuesday"] = 2] = "Tuesday";
        DayOfWeek[DayOfWeek["Wednesday"] = 3] = "Wednesday";
        DayOfWeek[DayOfWeek["Thursday"] = 4] = "Thursday";
        DayOfWeek[DayOfWeek["Friday"] = 5] = "Friday";
        DayOfWeek[DayOfWeek["Saturday"] = 6] = "Saturday";
        DayOfWeek[DayOfWeek["Sunday"] = 7] = "Sunday";
    })(DayOfWeek = exports.DayOfWeek || (exports.DayOfWeek = {}));
    var Roll;
    (function (Roll) {
        Roll[Roll["One"] = 1] = "One";
        Roll[Roll["Two"] = 2] = "Two";
        Roll[Roll["Three"] = 3] = "Three";
        Roll[Roll["Four"] = 4] = "Four";
        Roll[Roll["Five"] = 5] = "Five";
        Roll[Roll["Six"] = 6] = "Six";
    })(Roll = exports.Roll || (exports.Roll = {}));
    function getNextDow(dow) {
        if (dow == DayOfWeek.Sunday) {
            return DayOfWeek.Monday;
        }
        else {
            return dow + 1;
        }
    }
    exports.getNextDow = getNextDow;
    const dowNames = [
        'Zerday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    var Status;
    (function (Status) {
        Status[Status["Future"] = 0] = "Future";
        Status[Status["Current"] = 1] = "Current";
        Status[Status["Seized"] = 2] = "Seized";
        Status[Status["Failed"] = 3] = "Failed";
    })(Status || (Status = {}));
    class Day {
        constructor(dayOfMonth, dayOfWeek, monthName) {
            this.status = Status.Future;
            this.dayOfMonth = dayOfMonth;
            this.dayOfWeek = dayOfWeek;
            this.monthName = monthName;
            this.rolls = [];
        }
        getName() {
            return dowNames[this.dayOfWeek] + ', the ' + this.dayOfMonth + 'th of ' + this.monthName;
        }
    }
    exports.Day = Day;
    class Month {
        constructor(monthName, days, firstDay) {
            console.log('Month constructor called with ', monthName, days, firstDay);
            this.monthName = monthName;
            this.days = [new Day(1, firstDay, monthName)];
            let curDayOfWeek = getNextDow(firstDay);
            for (let i = 1; i < days; i++) {
                let day = new Day(i + 1, curDayOfWeek, monthName);
                this.days.push(day);
                curDayOfWeek = getNextDow(curDayOfWeek);
            }
        }
    }
    exports.Month = Month;
    class Calendar {
        constructor() {
            this.months = [new Month('Whatember', 56, DayOfWeek.Monday)];
            this.days = [];
            for (let i = 0; i < this.months.length; i++) {
                this.days = this.days.concat(this.months[i].days);
            }
        }
        printAll() {
            for (let i = 0; i < this.days.length; i++) {
                console.log(this.days[i].getName());
            }
        }
    }
    exports.Calendar = Calendar;
});
define("scenes/main", ["require", "exports", "game/calendar"], function (require, exports, calendar_1) {
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
            this.calendar = new calendar_1.Calendar();
            this.calendar.printAll();
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
define("game/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Roll;
    (function (Roll) {
        Roll[Roll["One"] = 1] = "One";
        Roll[Roll["Two"] = 2] = "Two";
        Roll[Roll["Three"] = 3] = "Three";
        Roll[Roll["Four"] = 4] = "Four";
        Roll[Roll["Five"] = 5] = "Five";
        Roll[Roll["Six"] = 6] = "Six";
    })(Roll = exports.Roll || (exports.Roll = {}));
});
//# sourceMappingURL=app.js.map