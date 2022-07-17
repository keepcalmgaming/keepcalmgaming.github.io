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
    struct;
    Day;
    {
        var date;
        var rolledNumbers = [];
        var currentNumber;
        var isWin = false;
        var gaveCashback = false;
    }
    class Day {
        constructor(dayOfMonth, dayOfWeek, monthName) {
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
define("game/powerup", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PowerUp;
    (function (PowerUp) {
        PowerUp[PowerUp["reroll"] = 0] = "reroll";
        PowerUp[PowerUp["pseudorandomReroll"] = 1] = "pseudorandomReroll";
        PowerUp[PowerUp["twoDices"] = 2] = "twoDices";
        PowerUp[PowerUp["upwardReroll"] = 3] = "upwardReroll";
        PowerUp[PowerUp["downwardReroll"] = 4] = "downwardReroll";
        PowerUp[PowerUp["upsideDown"] = 5] = "upsideDown";
    })(PowerUp = exports.PowerUp || (exports.PowerUp = {}));
    function getPUTitle(p) {
        switch (p) {
            case PowerUp.reroll: return "Reroll";
            case PowerUp.pseudorandomReroll: return "Pseudorandom Reroll";
            case PowerUp.twoDices: return "Two Dices";
            case PowerUp.upwardReroll: return "Upward Reroll";
            case PowerUp.downwardReroll: return "Downward Reroll";
            case PowerUp.upsideDown: return "Upside Down";
        }
    }
    exports.getPUTitle = getPUTitle;
});
//     var title: String {
//         switch self {
//         case .reroll: return "Reroll"
//         case .pseudorandomReroll: return "Pseudorandom Reroll"
//         case .twoDices: return "Two Dices"
//         case .upwardReroll: return "Upward Reroll"
//         case .downwardReroll: return "Downward Reroll"
//         case .upsideDown: return "Upside Down"
//         }
//     }
//     var shortTitle: String {
//         switch self {
//         case .reroll: return "Reroll"
//         case .pseudorandomReroll: return "Pseudo"
//         case .twoDices: return "Two Dices"
//         case .upwardReroll: return "Upward"
//         case .downwardReroll: return "Downward"
//         case .upsideDown: return "Upside Down"
//         }
//     }
//     var description: String {
//         switch self {
//         case .reroll:
//             return "Gives you opportunity to reroll the dice. Simple as that"
//         case .pseudorandomReroll:
//             return "You can reroll the dice, and it will show value that wasn't rolled today"
//         case .twoDices:
//             return "You roll 2 dices and it gives you 3 values at once: from the 1 dice, from the 2 dice and their sum"
//         case .upwardReroll:
//             return "Rerolled dice will show value more than the last roll. If two dices are rolled, it will be the value more than the one that has minimum value"
//         case .downwardReroll:
//             return "Rerolled dice will show value less than the last roll. If two dices are rolled, it will be the value less than the one that has maximum value"
//         case .upsideDown:
//             return "You can rotate the dice (or dices) upside down. Tip: the sum of opposite side values in the dice always equals 7"
//         }
//     }
//     var price: Int {
//         switch self {
//         case .reroll: return 7
//         case .pseudorandomReroll: return 12
//         case .twoDices: return 20
//         case .upwardReroll: return 24
//         case .downwardReroll: return 24
//         case .upsideDown: return 25
//         }
//     }
//     var imageName: String {
//         switch self {
//         case .reroll: return "reroll"
//         case .pseudorandomReroll: return "psreroll"
//         case .twoDices: return "two"
//         case .upwardReroll: return "up"
//         case .downwardReroll: return "down"
//         case .upsideDown: return "rotate"
//         }
//     }
//     static var all: [PowerUp] {
//         return [PowerUp.reroll, PowerUp.pseudorandomReroll, PowerUp.twoDices, PowerUp.upwardReroll, PowerUp.downwardReroll, PowerUp.upsideDown]
//     }
// }
define("game/game", ["require", "exports", "game/calendar"], function (require, exports, calendar_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    BalanceStats = {
        sundayBonus: 40
    };
    class CalenGame {
        constructor() {
            this.points = 0;
            this.diceValue = null;
            this.isFinished = false;
            this.calendar = new calendar_2.Calendar();
            this.calIndex = 0;
            this.currentDay = this.calendar.days[0];
        }
        addPoints(amount) {
            this.points += amount;
            this.totalPoints += amount;
        }
        nextDay() {
            this.diceValue = null;
            this.diceValues = [];
            this.currentDay.diceValues = this.diceValues;
            this.currentDay.diceValue = this.diceValue;
            // this.diceValues = []
            this.diceValue = null;
            this.calIndex++;
            this.currentDay = this.calendar.days[this.calIndex];
            if (this.currentDay.dayOfWeek == calendar_2.DayOfWeek.Sunday) {
                this.addPoints(BalanceStats.sundayBonus);
            }
        }
        checkWin() {
        }
        addRoll(r) {
            this.diceValue = r;
            // this.diceValues.append(r)
            checkWin();
        }
        rollTheDice() {
            this.addRoll(Math.floor(Math.random() * 6));
        }
        rollPseudoRandom() {
            let rolls = [calendar_2.Roll.ONE, calendar_2.Roll.TWO, calendar_2.Roll.THREE, calendar_2.Roll.FOUR, calendar_2.Roll.FIVE, calendar_2.Roll.SIX];
            let possibleRolls = [];
            for (let i = 0; i < rolls.length; i++) {
                if (!this.diceValues.includes(rolls[i])) {
                    possibleRolls.push(rolls[i]);
                }
            }
            let l = possibleRolls.length;
            if (l > 0) {
                let index = Math.floor(Math.random() * l);
                this.addRoll(possibleRolls[index]);
            }
        }
    }
    exports.CalenGame = CalenGame;
});
//     func rollTheDicePseudorandomly() {
//         var possibleValues = [1, 2, 3, 4, 5, 6]
//         for rolled in currentDay.rolledNumbers {
//             if let index = possibleValues.firstIndex(of: rolled) {
//                 possibleValues.remove(at: index)
//             }
//         }
//         if talents.contains(Talent.teaMaster) && currentDay.date.isTeaDay && self.diceValue != nil {
//             if possibleValues.count > 1 {
//                 possibleValues = [possibleValues.randomElement() ?? neededScore, neededScore]
//             }
//         }
//         guard possibleValues.isEmpty == false else { return }
//         self.diceValue = possibleValues.randomElement() ?? Int.random(in: 1...6)
//         self.diceValues = nil
//         checkWin()
//         checkCardCount()
//     }
//     func rollTwoDices() {
//         let v1 = Int.random(in: 1...6)
//         let v2 = Int.random(in: 1...6)
//         self.diceValues = [v1, v2]
//         self.diceValue = nil
//         checkWin()
//         checkCardCount()
//     }
//     func upwardRoll() {
//         if let diceValue = diceValue, diceValue < 6 {
//             self.diceValue = Int.random(in: (diceValue + 1)...6)
//             self.diceValues = nil
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last, min(v1, v2) < 6 {
//             self.diceValue = Int.random(in: (min(v1, v2) + 1)...6 )
//             self.diceValues = nil
//             checkWin()
//         }
//         checkCardCount()
//     }
//     func downwardRoll() {
//         if let diceValue = diceValue, diceValue > 1 {
//             self.diceValue = Int.random(in: 1...diceValue - 1)
//             self.diceValues = nil
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last, max(v1, v2) > 1 {
//             self.diceValue = Int.random(in: 1...max(v1, v2) - 1)
//             self.diceValues = nil
//             checkWin()
//         }
//         checkCardCount()
//     }
//     func upsideDown() {
//         if let diceValue = diceValue {
//             self.diceValue = 7 - diceValue
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last {
//             self.diceValues = [7 - v1, 7 - v2]
//             checkWin()
//         }
//         checkCardCount()
//     }
//     var neededScore: Int {
//         let dayName = self.currentDay.date.formatted(.day)
//         switch dayName {
//         case "Monday":
//             return 1
//         case "Tuesday":
//             return 2
//         case "Wednesday":
//             return 3
//         case "Thursday":
//             return 4
//         case "Friday":
//             return 5
//         case "Saturday":
//             return 6
//         default:
//             return 0
//         }
//     }
//     func checkWin() {
//         if let diceValue = diceValue {
//             self.currentDay.rolledNumbers.append(diceValue)
//             if diceValue == neededScore {
//                 win()
//             }
//         } else if let diceValues = diceValues {
//             guard let v1 = diceValues.first, let v2 = diceValues.last else { return }
//             if v1 == neededScore || v2 == neededScore || v1 + v2 == neededScore {
//                 win()
//             }
//         }
//     }
//     func win() {
//         if currentDay.isWin == false {
//             self.currentDay.isWin = true
//             if talents.contains(Talent.compulsiveHoarder) {
//                 points += BalanceStats.win / 2
//                 totalPoints += BalanceStats.win / 2
//                 powerUps.append(PowerUpItem(type: PowerUp.all.randomElement() ?? PowerUp.reroll))
//             } else {
//                 points += BalanceStats.win
//                 totalPoints += BalanceStats.win
//             }
//             Haptic.play(.win)
//         }
//         if pastDays.count >= 5 {
//             let count = pastDays.suffix(5).filter({ $0.isWin }).count
//             if count == 5 {
//                 //it's streak!
//                 points += BalanceStats.winStreak
//                 totalPoints += BalanceStats.winStreak
//             }
//         }
//     }
//     func countOfBoughtPowerUpsOfType(_ up: PowerUp) -> Int {
//         return Game.shared.powerUps.filter({ $0.type == up }).count
//     }
//     func usePowerUp(_ powerUp: PowerUp) {
//         guard let index = powerUps.firstIndex(where: ({ $0.type == powerUp})) else { return }
//         powerUps.remove(at: index)
//         switch powerUp {
//         case .reroll:
//             rollTheDice()
//         case .pseudorandomReroll:
//             rollTheDicePseudorandomly()
//         case .twoDices:
//             rollTwoDices()
//         case .upwardReroll:
//             upwardRoll()
//         case .downwardReroll:
//             downwardRoll()
//         case .upsideDown:
//             upsideDown()
//         }
//     }
//     func isDateWasWon(date: Date) -> Bool {
//         guard let day = pastDays.first(where: { Calendar.current.isDate(date, inSameDayAs: $0.date) }) else { return false }
//         return day.isWin
//     }
//     var talentsToChoose: [Talent] {
//         var possibleTalents = Talent.all
//         for t in talents {
//             if let index = possibleTalents.firstIndex(of: t) {
//                 possibleTalents.remove(at: index)
//             }
//         }
//         return Array(possibleTalents.shuffled().prefix(3))
//     }
// }
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