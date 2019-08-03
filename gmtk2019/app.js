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
define("scenes/main", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    class MainScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'main' });
            if (gameHeight > gameWidth) {
                this.isVertical = true;
                this.rectSize = gameWidth;
            }
            else {
                this.isVertical = false;
                this.rectSize = gameHeight;
            }
            this.cellW = this.rectSize / 5;
            this.cellH = this.rectSize / 5;
        }
        preload() {
            this.load.image('token', 'images/token.png');
        }
        create() {
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 } });
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let offsetX = i * this.cellW;
                    let offsetY = j * this.cellH;
                    field.strokeRect(offsetX, offsetY, this.cellH, this.cellW);
                }
            }
            field.strokePath();
            this.objects = this.physics.add.group();
            this.physics.add.sprite(halfWidth, halfHeight, 'token');
        }
        getC(x, y) {
            return {
                x: this.getCX(x),
                y: this.getCY(y)
            };
        }
        getCX(x) { return (x + 0.5) * this.cellW; }
        getCY(y) { return (y + 0.5) * this.cellH; }
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
                debug: true
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
//# sourceMappingURL=app.js.map