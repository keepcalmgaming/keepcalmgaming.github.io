define("scenes/greeting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class GreetingScene extends Phaser.Scene {
        create() {
            var content = [
                "A Hero, A Sword and A Pit",
                "",
                "This is GMTK Game Jam 2019 submission.",
                "Only one.",
                "",
                "Have fun and thanks for playing!",
                "",
                "https://keepcalmgaming.github.io"
            ];
            var text = this.add.text(0, 0, content, { align: 'center' });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            this.input.on('pointerdown', () => {
                this.scene.switch('main');
            });
        }
    }
    exports.GreetingScene = GreetingScene;
});
define("game/game", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        constructor(x, y) {
            this.LIVES = 20;
            this.NUM_SPAWNS = 3;
            this.NUM_TOWER_SPAWNS = 7;
            this.lives = this.LIVES;
            this.X = x;
            this.Y = y;
            this.createSpawns(this.NUM_SPAWNS);
            this.createTowerSpawns(this.NUM_TOWER_SPAWNS);
        }
        createTowerSpawns(num) {
            this.towerSpawns = [];
            for (let i = 0; i < num; i++) {
                this.towerSpawns.push(this.randomCoords());
            }
        }
        createSpawns(num) {
            this.spawns = [];
            for (let i = 0; i < num; i++) {
                this.spawns.push(this.randomCoords());
            }
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
define("scenes/main", ["require", "exports", "game/game"], function (require, exports, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = false;
    const minSide = 10;
    class MainScene extends Phaser.Scene {
        constructor(sceneConfig) {
            // super({key: 'main'})
            super(sceneConfig);
            let biggerSide = gameHeight > gameWidth ? gameWidth : gameHeight;
            this.rectSize = biggerSide / minSide;
            if (biggerSide == gameWidth) {
                this.x = minSide;
                this.y = Math.floor(gameHeight / this.rectSize);
            }
            else {
                this.x = Math.floor(gameWidth / this.rectSize);
                this.y = minSide;
            }
            this.cellW = gameWidth / this.x;
            this.cellH = gameHeight / this.y;
            this.towergame = new game_1.Game(this.x, this.y);
            console.log('Game Created', this.x, this.y, this.towergame);
        }
        preload() {
            this.load.image('bullet', 'images/bullet.png');
            this.load.image('mainframe', 'images/mainframe.png');
            this.load.image('monster', 'images/monster.png');
            this.load.image('monsterplace', 'images/monsterplace.png');
            this.load.image('tower', 'images/tower.png');
            this.load.image('towerplace', 'images/towerplace.png');
        }
        debugDrawGrid() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(this.getCX(i), this.getCY(j), this.cellW, this.cellH);
                }
            }
        }
        create() {
            this.cameras.main.setBackgroundColor('#ffffff');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupMainframe();
            this.setupTowerSpawns();
            this.setupTower();
            this.drawSpawns();
            this.setupText();
            if (debug) {
                this.debugDrawGrid();
            }
        }
        setupMainframe() {
            this.mainframe = this.physics.add.sprite(0, 0, 'mainframe');
            this.scaleSpriteTo(this.mainframe, this.rectSize * 2);
            this.mainframe.setOrigin(0);
            let position = this.getC(this.mainframeCoords());
            this.mainframe.x = position.x;
            this.mainframe.y = position.y;
        }
        setupTower() {
            this.tower = this.physics.add.sprite(0, 0, 'tower');
            this.scaleSpriteTo(this.tower, this.rectSize);
            this.tower.setOrigin(0);
            let coord = this.towergame.towerSpawns ? this.towergame.towerSpawns[0] : { x: 0, y: 0 };
            let position = this.getC(coord);
            this.tower.x = position.x;
            this.tower.y = position.y;
        }
        setupTowerSpawns() {
            this.towerSpawns = [];
            if (!this.towergame.towerSpawns)
                return;
            for (let i = 0; i < this.towergame.towerSpawns.length; i++) {
                let towerSpawn = this.towergame.towerSpawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive();
                this.scaleSpriteTo(sprite, this.rectSize);
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
        drawSpawns() {
            if (!this.towergame.spawns)
                return;
            for (let i = 0; i < this.towergame.spawns.length; i++) {
                let spawn = this.towergame.spawns[i];
                let sprite = this.physics.add.sprite(0, 0, 'monsterplace');
                this.scaleSpriteTo(sprite, this.rectSize);
                sprite.setOrigin(0);
                let position = this.getC(spawn);
                sprite.x = position.x;
                sprite.y = position.y;
            }
        }
        setupText() {
            this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' });
        }
        mainframeCoords() {
            return {
                x: Math.floor(this.x / 2) - 1,
                y: Math.floor(this.y / 2) - 1
            };
        }
        scaleSpriteTo(sprite, dim) {
            let scale = dim / sprite.width;
            sprite.setScale(scale);
        }
        getC(c) {
            return {
                x: this.getCX(c.x),
                y: this.getCY(c.y)
            };
        }
        getCX(x) { return (x) * this.cellW; }
        getCY(y) { return (y) * this.cellH; }
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