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
            this.rectangle = this.config.rectangle;
            this.addScore = this.config.addScore;
            console.log(this.config);
            this.setupBackgroundCells();
            this.setupRectangle();
        }
        update() {
        }
        setupBackgroundCells() {
            let startOffset = 0;
            for (let i = 0; i < this.x; i++) {
                for (let j = 0; j < this.y; j++) {
                    let cell = this.physics.add.image(0, 0, 'cell');
                    cell.x = this.offsetX + this.cellSize / 2 + startOffset + this.cellSize * i;
                    cell.y = this.offsetY + this.cellSize / 2 + startOffset + this.cellSize * j;
                    cell.setOrigin(0.5);
                    this.scaleSprite(cell, this.cellSize * 0.9);
                }
            }
        }
        setupRectangle() {
            this.rectangle.strokeRect(this.offsetX - this.cellSize / 4, this.offsetY - this.cellSize / 4, this.cellSize * (this.x + 1) - this.cellSize / 2, this.cellSize * (this.y + 1) - this.cellSize / 2);
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        getCellCenter(position) {
            let x = this.offsetX + this.cellSize / 2 + this.cellSize * position.x;
            let y = this.offsetY + this.cellSize / 2 + this.cellSize * position.y;
            return { x: x, y: y };
        }
        getSpritePosition(sprite) {
            let positionX = (sprite.x - this.offsetX - this.cellSize / 2) / this.cellSize;
            let positionY = (sprite.y - this.offsetY - this.cellSize / 2) / this.cellSize;
            let x = positionX.toFixed();
            let y = positionY.toFixed();
            return { x: x, y: y };
        }
    }
    exports.BaseGame = BaseGame;
});
define("game/tetraminos", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const TETRAMINOS = {
        palka: {
            b: [[0, 0], [0, 1], [0, 2], [0, 3]],
            next: 'horpalka'
        },
        horpalka: {
            b: [[0, 0], [1, 0], [2, 0], [3, 0]],
            next: 'palka'
        },
        t: {
            b: [[0, 0], [1, 0], [2, 0], [1, 1]],
            next: 'tr'
        },
        tr: {
            b: [[0, 0], [0, 1], [1, 1], [0, 2]],
            next: 'tu'
        },
        tu: {
            b: [[0, 1], [1, 0], [1, 1], [2, 1]],
            next: 'tl'
        },
        tl: {
            b: [[1, 0], [1, 1], [0, 1], [1, 2]],
            next: 't'
        },
        z: {
            b: [[0, 0], [0, 1], [1, 1], [1, 2]],
            next: 'horz'
        },
        horz: {
            b: [[0, 1], [1, 1], [1, 0], [2, 0]],
            next: 'z'
        },
        n: {
            b: [[1, 0], [1, 1], [0, 1], [0, 2]],
            next: 'horn'
        },
        horn: {
            b: [[0, 0], [1, 0], [1, 1], [2, 1]],
            next: 'n'
        },
        square: {
            b: [[0, 0], [0, 1], [1, 0], [1, 1]],
            next: 'square'
        },
    };
    class TGenerator {
        static get(name) {
            return TETRAMINOS[name];
        }
        static next(name) {
            if (TETRAMINOS[name] == undefined) {
                console.error('next tetramino not found', name);
                return undefined;
            }
            return TETRAMINOS[name].next;
        }
        static random() {
            let keys = Object.keys(TETRAMINOS);
            return keys[keys.length * Math.random() << 0];
        }
    }
    exports.TGenerator = TGenerator;
});
define("game/tetris", ["require", "exports", "game/base_game", "game/tetraminos"], function (require, exports, base_game_1, tetraminos_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Tetris extends base_game_1.BaseGame {
        constructor(config) {
            super(config);
            this.scoreFullLine = 100;
            this.tx = 0;
            this.ty = 0;
            this.tname = 'none';
            this.blocks = this.physics.add.group();
            this.movingBlocks = this.physics.add.group();
            console.log('Tetris', this.config);
            this.spawnFigure();
        }
        spawnFigure() {
            for (let block of this.movingBlocks.getChildren()) {
                this.blocks.add(block);
            }
            this.movingBlocks.clear();
            this.tname = tetraminos_1.TGenerator.random();
            let tetramino = tetraminos_1.TGenerator.get(this.tname);
            let blocks = tetramino.b;
            this.tx = Math.floor(Math.random() * (this.x - 3));
            this.ty = 0;
            for (let point of blocks) {
                let pos = { x: this.tx + point[0], y: point[1] };
                let coords = this.getCellCenter(pos);
                let block = this.physics.add.image(coords.x, coords.y, 'block');
                block.setOrigin(0.5);
                this.scaleSprite(block, this.cellSize * 0.9);
                this.movingBlocks.add(block);
            }
        }
        getAdjustment(blocks) {
            let shiftX = 0;
            let shiftY = 0;
            for (let block of blocks) {
                if ((this.tx + block[0]) >= this.x) {
                    let diff = this.x - (this.tx + block[0] + 1);
                    if (diff < shiftX) {
                        shiftX = diff;
                    }
                }
            }
            return { shiftX, shiftY };
        }
        canSpawn(blocks, a) {
            // for (let block of blocks) {
            // 	if (this.isPositionFull({x: this.tx + block[0] + a.shiftX, y: this.ty + block[1] + y.shiftY})) {
            // 		return false
            // 	}
            // }
            return true;
        }
        rotate() {
            let next = tetraminos_1.TGenerator.next(this.tname);
            let nextT = tetraminos_1.TGenerator.get(next);
            if (nextT === undefined) {
                return;
            }
            let adjustment = this.getAdjustment(nextT.b);
            if (this.canSpawn(nextT.b, adjustment)) {
                this.tx += adjustment.shiftX;
                this.ty += adjustment.shiftY;
                this.tname = next;
                this.movingBlocks.destroy(true);
                this.movingBlocks = this.physics.add.group();
                for (let point of nextT.b) {
                    let pos = { x: this.tx + point[0], y: this.ty + point[1] };
                    let coords = this.getCellCenter(pos);
                    let block = this.physics.add.image(coords.x, coords.y, 'block');
                    block.setOrigin(0.5);
                    this.scaleSprite(block, this.cellSize * 0.9);
                    this.movingBlocks.add(block);
                }
            }
        }
        moveLeft() {
            for (let block of this.movingBlocks.getChildren()) {
                if (this.getSpritePosition(block).x <= 0) {
                    return;
                }
                if (this.isPositionFull({ x: this.getSpritePosition(block).x - 1, y: this.getSpritePosition(block).y })) {
                    return;
                }
            }
            for (let block of this.movingBlocks.getChildren()) {
                block.x = block.x - this.cellSize;
            }
            this.tx -= 1;
            this.checkFullLines();
        }
        moveRight() {
            for (let block of this.movingBlocks.getChildren()) {
                if (this.getSpritePosition(block).x >= this.x - 1) {
                    return;
                }
                let newX = ++this.getSpritePosition(block).x;
                if (this.isPositionFull({ x: newX, y: this.getSpritePosition(block).y })) {
                    return;
                }
            }
            for (let block of this.movingBlocks.getChildren()) {
                block.x = block.x + this.cellSize;
            }
            this.tx += 1;
            this.checkFullLines();
        }
        moveDown() {
            // TODO: Check if can move. If not - stop, check, spawn next
            for (let block of this.movingBlocks.getChildren()) {
                let blockX = this.getSpritePosition(block).x;
                let blockY = this.getSpritePosition(block).y;
                if (blockY >= this.y - 1) {
                    this.spawnFigure();
                    return;
                }
                for (let staticBlock of this.blocks.getChildren()) {
                    if (blockY >= this.getSpritePosition(staticBlock).y - 1 && blockX == this.getSpritePosition(staticBlock).x) {
                        this.spawnFigure();
                        return;
                    }
                }
            }
            for (let block of this.movingBlocks.getChildren()) {
                block.y = block.y + this.cellSize;
            }
            this.ty += 1;
            this.checkFullLines();
        }
        checkFullLines() {
            var shouldFallDown = false;
            for (let i = 0; i < this.y; i++) {
                let line = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y == i);
                if (line.length == this.x) {
                    shouldFallDown = true;
                    this.addScore(this.scoreFullLine);
                    for (let block of line) {
                        // this.blocks.remove(block)
                        block.destroy();
                    }
                }
            }
            if (shouldFallDown) {
                for (let block of this.blocks.getChildren()) {
                    let blockY = this.getSpritePosition(block).y;
                    if (blockY < this.y - 1) {
                        block.y = block.y + this.cellSize;
                    }
                }
            }
        }
        isBlocksAreOnTheSameLine(block1, block2) {
            return this.getSpritePosition(block1).y == this.getSpritePosition(block2).y;
        }
        isPositionFull(position) {
            for (let block of this.blocks.getChildren()) {
                let blockPosition = this.getSpritePosition(block);
                // console.log(blockPosition, block, blockPosition.x)
                if ((blockPosition.x == position.x) && (blockPosition.y == position.y)) {
                    return true;
                }
            }
            return false;
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
            this.setupBall();
            this.setupWalls();
            // start of most left block 
            let platformOffsetX = this.offsetX + ((this.cellSize / 2) * 9);
            let platformOffsetY = (this.offsetY + (this.cellSize * 18) - (this.cellSize / 2));
            let platform = this.physics.add.image(platformOffsetX, platformOffsetY, 'block');
            this.platform = platform;
            console.log('Arcanoid', this.config);
        }
        update() {
            super.update();
        }
        moveLeft() {
            if (this.getSpritePosition(this.platform).x <= 0) {
                return;
            }
            this.platform.x -= this.cellSize;
        }
        moveRight() {
            if (this.getSpritePosition(this.platform).x > this.x - 2) {
                return;
            }
            this.platform.x += this.cellSize;
        }
        stopPlatform() {
        }
        setupBall() {
            this.ball = this.physics.add.image(this.offsetX + 100, this.offsetY + 100, 'ball');
            this.ball.setScale(1);
            this.ball.setCollideWorldBounds(false);
            this.ball.setBounce(1);
            this.ball.body.stopVelocityOnCollide = false;
            this.ball.setVelocity(-200, -200);
        }
        setupWalls() {
            let cellPosition = this.getCellCenter({ x: -1, y: -1 });
            let cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable();
            this.physics.add.collider(cell, this.ball, this.wallHit);
            for (let i = 0; i < 12; i++) {
                let cell2 = this.physics.add.image(cell.x + i * cell.height, cellPosition.y, 'block').setAlpha(0).setImmovable();
                this.physics.add.collider(cell2, this.ball, this.wallHit);
            }
            for (let i = 0; i < 22; i++) {
                let cell2 = this.physics.add.image(cell.x, cellPosition.y + i * cell.height, 'block').setAlpha(0).setImmovable();
                this.physics.add.collider(cell2, this.ball, this.wallHit);
            }
            cellPosition = this.getCellCenter({ x: 10, y: -1 });
            cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable();
            this.physics.add.collider(cell, this.ball, this.wallHit);
            for (let i = 0; i < 22; i++) {
                let cell2 = this.physics.add.image(cell.x, cellPosition.y + i * cell.height, 'block').setAlpha(0).setImmovable();
                this.physics.add.collider(cell2, this.ball, this.wallHit);
            }
            cellPosition = this.getCellCenter({ x: -1, y: 18 });
            cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable();
            this.physics.add.collider(cell, this.ball, this.wallHit);
            for (let i = 0; i < 12; i++) {
                let cell2 = this.physics.add.image(cell.x + i * cell.height, cellPosition.y, 'block').setAlpha(0).setImmovable();
                this.physics.add.collider(cell2, this.ball, this.wallHit);
            }
        }
        wallHit(cell, ball) {
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
    const maxSide = 18;
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
            this.score = 0;
            // super(sceneConfig)
            this.x = minSide;
            this.y = maxSide;
            this.isVertical = gameWidth < gameHeight;
            if (this.isVertical) {
                this.cellSize = gameWidth / (this.x * 2 + 8);
                this.offsetX = this.cellSize * 2;
                this.offsetY = this.cellSize * 2;
            }
            else {
                this.cellSize = gameHeight / (this.y + 4);
                this.offsetX = halfWidth - this.cellSize * (this.x + 2);
                this.offsetY = this.cellSize * 2;
            }
        }
        addScore(i) {
            this.score += i;
            console.log('score is ', this.score);
        }
        create() {
            this.cameras.main.setBackgroundColor('#959F7D');
            let rectangle = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D } });
            this.setupText();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
            this.tetris = new tetris_1.Tetris({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this)
            });
            this.arcanoid = new arcanoid_1.Arcanoid({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX + this.cellSize * (this.x + 4),
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this)
            });
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: this.tetris.moveDown,
                callbackScope: this.tetris
            });
            this.time.timeScale = 1;
            console.log('Game Created', this.x, this.y);
            // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
            this.input.keyboard.on('keydown', (event) => {
                if ([Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.tetris.moveLeft();
                    this.arcanoid.moveLeft();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.tetris.moveRight();
                    this.arcanoid.moveRight();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.SPACE].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.tetris.rotate();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.time.timeScale = 15.5;
                }
            });
            this.input.keyboard.on('keyup', (event) => {
                if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.time.timeScale = 1;
                }
            });
            if (this.isVertical) {
                console.log(this.isVertical);
                let sprite = this.physics.add.sprite(0, 0, 'cell').setInteractive();
                sprite.setDepth(100);
                sprite.x = 50;
                sprite.y = gameHeight - 100;
                sprite.on('pointerdown', (pointer) => {
                    this.tetris.moveLeft();
                    this.arcanoid.moveLeft();
                });
                sprite = this.physics.add.sprite(0, 0, 'cell').setInteractive();
                sprite.setDepth(100);
                sprite.x = 150;
                sprite.y = gameHeight - 100;
                sprite.on('pointerdown', (pointer) => {
                    this.tetris.moveRight();
                    this.arcanoid.moveRight();
                });
                sprite = this.physics.add.sprite(0, 0, 'cell').setInteractive();
                sprite.setDepth(100);
                sprite.x = 100;
                sprite.y = gameHeight - 50;
                sprite.on('pointerdown', (pointer) => {
                    this.time.timeScale = 15.5;
                });
                sprite.on('pointerup', (pointer) => {
                    this.time.timeScale = 1;
                });
            }
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
            this.arcanoid.update();
            this.tetris.update();
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
            this.load.image('block', 'images/cell_full.png');
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
            console.log('drawing field');
            let field = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 }, fillStyle: { color: 0x000000 } });
            field.strokeRect(this.offsetX, this.offsetY, this.cellSize * this.x, this.cellSize * this.y);
            field.strokeRect(this.offsetX + this.cellSize * (this.x + 4), this.offsetY, this.cellSize * this.x, this.cellSize * this.y);
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