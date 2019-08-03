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
    const spawnsCount = 3;
    class Game {
        constructor(x, y) {
            this.LIVES = 20;
            this.lives = this.LIVES;
            this.X = x;
            this.Y = y;
        }
        getSpawnCoors() {
            let spawnX = this.getRandNum(this.X);
            let spawnY = this.getRandNum(this.Y);
            return [spawnX, spawnY];
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
    const debug = true;
    const minSide = 10;
    const spawnsCount = 3;
    class MainScene extends Phaser.Scene {
        constructor(sceneConfig) {
            // super({key: 'main'})
            super(sceneConfig);
            console.log('starting constructor');
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
            console.log('constructor finished', this.x, this.y, this.towergame);
        }
        preload() {
            this.load.image('token', 'images/token.png');
        }
        debugDrawGrid() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    field.strokeRect(this.getCX(i), this.getCY(j), this.cellW, this.cellH);
                }
            }
        }
        setSpawns() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0xffffff } });
            for (let i = 0; i < spawnsCount; i++) {
                field.fillRect(this.getCX(this.towergame.getRandNum(this.x)), this.getCY(this.towergame.getRandNum(this.y)), this.cellW, this.cellH);
            }
        }
        create() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            this.setupMainframe();
            if (debug) {
                this.debugDrawGrid();
                this.setSpawns();
            }
        }
        setupMainframe() {
            this.mainframe = this.physics.add.sprite(halfWidth, halfHeight, 'token');
            this.scaleSpriteTo(this.mainframe, this.rectSize * 2);
            this.mainframe.setOrigin(0);
            let position = this.getC(this.mainframeCoords());
            this.mainframe.x = position.x;
            this.mainframe.y = position.y;
            console.log(this.mainframe);
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
                debug: true
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