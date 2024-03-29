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
                "ROLL THE WAY",
                "You have a game field 13x13. You start in the center. You play as a dice. Top value of the dice shows the amount of rotations you can do in any of possible directions. Rotating changes your top value.",
                "You can’t finish your move on the cell you were located previously.",
                "Your goal is too step on as much cells as possible before you don’t have opportunity to move.",
                "Good luck.",
                "",
                "https://keepcalmgaming.github.io"
            ];
            this.cameras.main.setBackgroundColor('#959F7D');
            var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#0F110D', wordWrap: { width: gameWidth - 100 } });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            this.load.once('complete', () => {
                let music = this.sound.add('music');
                music.play();
            }, this);
            this.load.audio('music', 'sounds/track.mp3');
            this.load.start();
            let clicked = false;
            if (!window.SaveState) {
                window.SaveState = {};
            }
            this.input.on('pointerdown', () => {
                if (!clicked) {
                    console.log('greeting pointerdown');
                    this.scene.switch('main');
                    clicked = true;
                }
            });
            this.input.keyboard.on('keydown', (event) => {
                event.preventDefault();
                if (!clicked) {
                    console.log('greeting keydown');
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
        spawnBlock(pos) {
            let coords = this.getCellCenter(pos);
            let block = this.physics.add.image(coords.x, coords.y, 'block');
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            return block;
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
define("game/dice", ["require", "exports", "game/base_game"], function (require, exports, base_game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Dice extends base_game_1.BaseGame {
        constructor(config) {
            super(config);
            //TODO generate random top?
            this.currentDiceTop = 1;
            //TODO generate random south
            this.currentDiceSouth = 4;
            //TODO find a way to calculate
            this.currentDiceEast = 2;
            this.diceGroup = this.physics.add.group();
            this.diceVisitedGroup = this.physics.add.group();
            this.diceAvailableGroup = this.physics.add.group();
            console.log('Dice', this.config);
            this.spawnDice();
            this.showAvailable();
        }
        spawnDice() {
            let pos = { x: 6, y: 6 };
            this.diceSprite = this.spawnDiceBlock(pos);
            this.diceGroup.add(this.diceSprite);
        }
        moveLeft() {
            let position = this.getSpritePosition(this.diceSprite);
            let step = this.currentDiceTop;
            let newPosition = { x: +position.x - step, y: position.y };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            this.diceVisitedGroup.add(this.spawnVisitedBlock(position));
            let prevDiceTop = this.currentDiceTop;
            this.currentDiceTop = 7 - this.currentDiceEast;
            this.currentDiceEast = prevDiceTop;
            if (this.diceSprite.x > 0) {
                this.diceSprite.x = this.diceSprite.x - step * this.cellSize;
            }
            this.showAvailable();
            this.redrawDice();
            this.addScore(1);
        }
        moveRight() {
            let position = this.getSpritePosition(this.diceSprite);
            let step = this.currentDiceTop;
            let newPosition = { x: +position.x + step, y: position.y };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            this.diceVisitedGroup.add(this.spawnVisitedBlock(position));
            let prevDiceTop = this.currentDiceTop;
            this.currentDiceTop = this.currentDiceEast;
            this.currentDiceEast = 7 - prevDiceTop;
            if (this.diceSprite.x > 0) {
                this.diceSprite.x = this.diceSprite.x + step * this.cellSize;
            }
            this.showAvailable();
            this.redrawDice();
            this.addScore(1);
        }
        moveDown() {
            let position = this.getSpritePosition(this.diceSprite);
            let step = this.currentDiceTop;
            let newPosition = { x: position.x, y: +position.y + step };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            this.diceVisitedGroup.add(this.spawnVisitedBlock(position));
            let prevDiceTop = this.currentDiceTop;
            this.currentDiceTop = this.currentDiceSouth;
            this.currentDiceSouth = 7 - prevDiceTop;
            if (this.diceSprite.x > 0) {
                this.diceSprite.y = this.diceSprite.y + step * this.cellSize;
            }
            this.showAvailable();
            this.redrawDice();
            this.addScore(1);
        }
        moveUp() {
            let position = this.getSpritePosition(this.diceSprite);
            let step = this.currentDiceTop;
            let newPosition = { x: position.x, y: +position.y - step };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            this.diceVisitedGroup.add(this.spawnVisitedBlock(position));
            let prevDiceTop = this.currentDiceTop;
            this.currentDiceTop = 7 - this.currentDiceSouth;
            this.currentDiceSouth = prevDiceTop;
            if (this.diceSprite.x > 0) {
                this.diceSprite.y = this.diceSprite.y - step * this.cellSize;
            }
            this.showAvailable();
            this.redrawDice();
            this.addScore(1);
        }
        spawnDiceBlock(pos) {
            let coords = this.getCellCenter(pos);
            let block = this.physics.add.image(coords.x, coords.y, 'one');
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            return block;
        }
        spawnVisitedBlock(pos) {
            let coords = this.getCellCenter(pos);
            let block = this.physics.add.image(coords.x, coords.y, 'visited');
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            return block;
        }
        spawnAvailableBlock(pos, value) {
            let coords = this.getCellCenter(pos);
            let block;
            if (value == 1) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_one');
            }
            else if (value == 2) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_two');
            }
            else if (value == 3) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_three');
            }
            else if (value == 4) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_four');
            }
            else if (value == 5) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_five');
            }
            else if (value == 6) {
                block = this.physics.add.image(coords.x, coords.y, 'cell_available_six');
            }
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            return block;
        }
        spawnTopAvailableBlock(pos) {
            let coords = this.getCellCenter(pos);
            let block = this.physics.add.image(coords.x, coords.y, 'available');
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            return block;
        }
        isPositionFull(position) {
            if (position.x < 0 || position.y < 0 || position.x >= this.x || position.y >= this.y) {
                return true;
            }
            for (let block of this.diceVisitedGroup.getChildren()) {
                let blockPosition = this.getSpritePosition(block);
                console.log(blockPosition, block, blockPosition.x);
                if ((blockPosition.x == position.x) && (blockPosition.y == position.y)) {
                    return true;
                }
            }
            return false;
        }
        showAvailable() {
            this.diceAvailableGroup.clear(false, true);
            let position = this.getSpritePosition(this.diceSprite);
            let step = this.currentDiceTop;
            let newLeftPosition = { x: +position.x - step, y: position.y };
            let isLeftPositionAvailable = !this.isPositionFull(newLeftPosition);
            if (isLeftPositionAvailable) {
                this.diceAvailableGroup.add(this.spawnAvailableBlock(newLeftPosition, 7 - this.currentDiceEast));
            }
            let newRightPosition = { x: +position.x + step, y: position.y };
            let isRightPositionAvailable = !this.isPositionFull(newRightPosition);
            if (isRightPositionAvailable) {
                this.diceAvailableGroup.add(this.spawnAvailableBlock(newRightPosition, this.currentDiceEast));
            }
            let newDownPosition = { x: position.x, y: +position.y + step };
            let isDownPositionAvailable = !this.isPositionFull(newDownPosition);
            if (isDownPositionAvailable) {
                this.diceAvailableGroup.add(this.spawnAvailableBlock(newDownPosition, this.currentDiceSouth));
            }
            let newUpPosition = { x: position.x, y: +position.y - step };
            let isUpPositionAvailable = !this.isPositionFull(newUpPosition);
            if (isUpPositionAvailable) {
                this.diceAvailableGroup.add(this.spawnAvailableBlock(newUpPosition, 7 - this.currentDiceSouth));
            }
            if (!isLeftPositionAvailable && !isRightPositionAvailable && !isDownPositionAvailable && !isUpPositionAvailable) {
                this.addScore(-42);
            }
        }
        redrawDice() {
            if (this.currentDiceTop == 1) {
                this.diceSprite.setTexture('one');
            }
            else if (this.currentDiceTop == 2) {
                this.diceSprite.setTexture('two');
            }
            else if (this.currentDiceTop == 3) {
                this.diceSprite.setTexture('three');
            }
            else if (this.currentDiceTop == 4) {
                this.diceSprite.setTexture('four');
            }
            else if (this.currentDiceTop == 5) {
                this.diceSprite.setTexture('five');
            }
            else if (this.currentDiceTop == 6) {
                this.diceSprite.setTexture('six');
            }
        }
        update() {
            super.update();
        }
    }
    exports.Dice = Dice;
});
define("scenes/main", ["require", "exports", "game/dice"], function (require, exports, dice_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = false;
    const minSide = 13;
    const maxSide = 13;
    class MainScene extends Phaser.Scene {
        // public textDice?: Phaser.GameObjects.BitmapText
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
                this.cellSize = gameWidth / (this.x + 4);
                this.offsetX = this.cellSize * 2;
                this.offsetY = this.cellSize * 5;
            }
            else {
                this.cellSize = gameHeight / (this.y + 7);
                this.offsetX = halfWidth - this.cellSize * 6.5;
                this.offsetY = this.cellSize * 5;
            }
        }
        addScore(i) {
            if (i == -42) {
                this.scene.stop('main');
                this.scene.start('endgame');
                return;
            }
            this.score += i;
            this.textScore.text = this.score;
            window.SCORE = this.score;
            if (this.score > window.HIGHSCORE) {
                window.HIGHSCORE = this.score;
                this.textHigh.text = window.HIGHSCORE;
            }
            // console.log('score is ', this.score)
        }
        create() {
            this.cameras.main.setBackgroundColor('#959F7D');
            let rectangle = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D } });
            this.setupText();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
            this.score = 0;
            this.dice = new dice_1.Dice({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this)
            });
            // this.time.addEvent({
            //     delay: 1000,
            //     loop: true,
            //     callback: this.tetris.moveDown,
            //     callbackScope: this.tetris
            // })
            this.time.timeScale = 1;
            console.log('Game Created', this.x, this.y);
            // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
            this.input.keyboard.on('keydown', (event) => {
                if ([Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A].includes(event.keyCode)) {
                    this.dice.moveLeft();
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D].includes(event.keyCode)) {
                    this.dice.moveRight();
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.SPACE].includes(event.keyCode)) {
                    this.dice.moveUp();
                    event.preventDefault();
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                    this.dice.moveDown();
                    event.preventDefault();
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.M].includes(event.keyCode)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.game.sound.mute = !this.game.sound.mute;
                }
            });
            this.input.keyboard.on('keyup', (event) => {
                if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                    event.stopPropagation();
                    this.time.timeScale = 1;
                }
            });
            let buttonScale = this.isVertical ? gameWidth / 10 : gameHeight / 20;
            if (this.sys.game.device.os.desktop == false) {
                let sprite = this.physics.add.sprite(0, 0, 'button_left').setInteractive();
                this.scaleSprite(sprite, buttonScale);
                sprite.setDepth(100);
                sprite.x = buttonScale * 2;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale;
                sprite.on('pointerdown', (pointer) => {
                    this.dice.moveLeft();
                    // this.textDice.text = this.dice.currentDiceTop
                });
                sprite = this.physics.add.sprite(0, 0, 'button_right').setInteractive();
                this.scaleSprite(sprite, buttonScale);
                sprite.setDepth(100);
                sprite.x = buttonScale * 4;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale;
                sprite.body.x = sprite.body.x + 100;
                sprite.on('pointerdown', (pointer) => {
                    this.dice.moveRight();
                    // this.textDice.text = this.dice.currentDiceTop
                });
                sprite = this.physics.add.sprite(0, 0, 'button_down').setInteractive();
                this.scaleSprite(sprite, buttonScale);
                sprite.setDepth(100);
                sprite.x = buttonScale * 3;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 2 : halfHeight + buttonScale * 2;
                sprite.on('pointerdown', (pointer) => {
                    this.dice.moveDown();
                    // this.textDice.text = this.dice.currentDiceTop
                });
                sprite.on('pointerup', (pointer) => {
                    this.dice.moveUp();
                    // this.textDice.text = this.dice.currentDiceTop
                });
                sprite = this.physics.add.sprite(0, 0, 'button_action').setInteractive();
                this.scaleSprite(sprite, buttonScale * 1.5);
                sprite.setDepth(100);
                sprite.x = gameWidth - buttonScale * 2.5;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 2.5 : halfHeight + buttonScale;
                sprite.on('pointerdown', (pointer) => {
                    // this.tetris.rotate()
                });
            }
            if (debug) {
                this.debugDrawGrid();
            }
        }
        update() {
            this.dice.update();
        }
        setupEvents() {
        }
        setupText() {
            this.add.bitmapText(gameWidth / 4, this.cellSize * 1, 'gamefont', 'SCORE', this.cellSize / 2);
            this.textScore = this.add.bitmapText(gameWidth / 4, this.cellSize * 2, 'gamefont', '0', this.cellSize / 2);
            this.add.bitmapText(gameWidth / 2, this.cellSize * 1, 'gamefont', 'HIGH', this.cellSize / 2);
            this.textHigh = this.add.bitmapText(gameWidth / 2, this.cellSize * 2, 'gamefont', window.HIGHSCORE, this.cellSize / 2);
            this.add.bitmapText(3 * gameWidth / 4, this.cellSize * 1, 'gamefont', "M TO", this.cellSize / 2);
            this.add.bitmapText(3 * gameWidth / 4, this.cellSize * 2, 'gamefont', "MUTE", this.cellSize / 2);
        }
        getScale(sprite, dim) {
            return dim / sprite.width;
        }
        scaleSprite(sprite, dim) {
            sprite.setScale(this.getScale(sprite, dim));
        }
        preload() {
            this.load.image('one', 'images/cell_full_one.png');
            this.load.image('two', 'images/cell_full_two.png');
            this.load.image('three', 'images/cell_full_three.png');
            this.load.image('four', 'images/cell_full_four.png');
            this.load.image('five', 'images/cell_full_five.png');
            this.load.image('six', 'images/cell_full_six.png');
            this.load.image('cell_available_one', 'images/cell_available_one.png');
            this.load.image('cell_available_two', 'images/cell_available_two.png');
            this.load.image('cell_available_three', 'images/cell_available_three.png');
            this.load.image('cell_available_four', 'images/cell_available_four.png');
            this.load.image('cell_available_five', 'images/cell_available_five.png');
            this.load.image('cell_available_six', 'images/cell_available_six.png');
            this.load.image('visited', 'images/cell_visited.png');
            this.load.image('cell', 'images/cell_empty.png');
            this.load.image('block', 'images/cell_full.png');
            this.load.image('ball', 'images/ball.png');
            this.load.image('bullet', 'images/bullet.png');
            this.load.image('vertical_wall', 'images/vertical_wall.png');
            this.load.image('horizontal_wall', 'images/horizontal_wall.png');
            this.load.image('button_left', 'images/left_button.png');
            this.load.image('button_right', 'images/right_button.png');
            this.load.image('button_down', 'images/button_down.png');
            this.load.image('button_action', 'images/action_button.png');
            this.load.image('button_sound', 'images/button_sound.png');
            this.load.image('button_reset', 'images/button_reset.png');
            this.load.image('platform', 'images/platform.png');
            this.load.image('particle', 'images/particle.png');
            this.load.bitmapFont('gamefont', 'font/gamefont.png', 'font/gamefont.fnt');
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
define("scenes/endgame", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfHeight = gameHeight / 2;
    const halfWidth = gameWidth / 2;
    class EndgameScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'endgame' });
        }
        create() {
            var content = [
                "Congrats!",
                "You score is " + window.SCORE + " points!",
                "Highscore is " + window.HIGHSCORE + " points!",
                "",
                "Thank you for playing!",
                "",
                "(Click to restart)",
            ];
            this.cameras.main.setBackgroundColor('#959F7D');
            var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#0F110D', wordWrap: { width: gameWidth - 100 } });
            var bounds = text.getBounds();
            text.x = halfWidth - bounds.width / 2;
            text.y = halfHeight - bounds.height / 2;
            let clicked = false;
            if (!window.SaveState) {
                window.SaveState = {};
            }
            this.input.on('pointerdown', () => {
                if (!clicked || true) {
                    this.scene.stop('endgame');
                    this.scene.switch('main');
                    clicked = true;
                }
            });
            this.input.keyboard.on('keydown', (event) => {
                event.preventDefault();
                if (!clicked || true) {
                    this.scene.switch('main');
                    clicked = true;
                }
            });
        }
    }
    exports.EndgameScene = EndgameScene;
});
define("app", ["require", "exports", "scenes/greeting", "scenes/main", "scenes/endgame"], function (require, exports, greeting_1, main_1, endgame_1) {
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
        scene: [greeting_1.GreetingScene, main_1.MainScene, endgame_1.EndgameScene]
    };
    class App {
        constructor() {
            this.isDebug = true;
        }
        start() {
            this.log('Generating game...');
            window.HIGHSCORE = 0;
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
define("game/arcanoid", ["require", "exports", "game/base_game"], function (require, exports, base_game_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Arcanoid extends base_game_2.BaseGame {
        constructor(config) {
            super(config);
            this.isBallMoving = false;
            this.platformPosition = 3;
            console.log(this);
            this.bullets = [];
            this.setupPlatform();
            this.setupBlocks();
            this.setupWalls();
            this.setupBall(3, 16);
            console.log('Arcanoid', this.config);
        }
        update() {
            super.update();
        }
        moveLeft() {
            if (this.platformPosition < 2) {
                return;
            }
            if (!this.isBallMoving) {
                this.ball.x -= this.cellSize;
            }
            this.platformPosition--;
            this.platform.x -= this.cellSize;
        }
        moveRight() {
            if (this.platformPosition > 6) {
                return;
            }
            if (!this.isBallMoving) {
                this.ball.x += this.cellSize;
            }
            this.platformPosition++;
            this.platform.x += this.cellSize;
        }
        fire() {
            if (!this.isBallMoving) {
                this.ball.setVelocity(this.cellSize * 5, -(this.cellSize * 5));
                this.ball.setMaxVelocity(this.ball.body.velocity.x * 2, -(this.ball.body.velocity.y * 2));
                this.isBallMoving = true;
            }
            if (this.prevShot) {
                if ((new Date().getTime() - this.prevShot) < 1000) {
                    return;
                }
            }
            let leftBulletCellPosition = this.getCellCenter({ x: this.platformPosition - 1, y: 17 });
            let leftBullet = this.physics.add.image(leftBulletCellPosition.x, leftBulletCellPosition.y, 'bullet');
            let rightBulletCellPosition = this.getCellCenter({ x: this.platformPosition + 2, y: 17 });
            let rightBullet = this.physics.add.image(rightBulletCellPosition.x, rightBulletCellPosition.y, 'bullet');
            for (let block of this.blocks) {
                this.physics.add.collider(block, leftBullet, this.onBulletBlock, null, this);
                this.physics.add.collider(block, rightBullet, this.onBulletBlock, null, this);
            }
            this.bullets.push(leftBullet, rightBullet);
            this.prevShot = new Date().getTime();
        }
        moveBullet() {
            let firstRowY = this.getCellCenter({ x: this.platformPosition, y: 1 });
            for (let bullet of this.bullets) {
                if (bullet.y > firstRowY.y) {
                    bullet.y -= this.cellSize;
                }
                else {
                    bullet.destroy();
                }
            }
        }
        setupPlatform() {
            let cellPosition = this.getCellCenter({ x: this.platformPosition, y: 17 });
            let platform = this.physics.add.image(cellPosition.x + this.cellSize / 2, cellPosition.y, 'platform').setImmovable();
            this.scaleSprite(platform, 4 * this.cellSize);
            this.platform = platform;
        }
        setupBall(x, y) {
            let cellPosition = this.getCellCenter({ x, y });
            this.ball = this.physics.add.image(cellPosition.x, cellPosition.y, 'ball');
            this.ball.setCircle();
            this.ball.setOrigin(0.5);
            this.scaleSprite(this.ball, this.cellSize / 2);
            this.ball.setCollideWorldBounds(false);
            this.ball.setBounce(1);
            this.ball.body.stopVelocityOnCollide = false;
            this.physics.add.collider(this.platform, this.ball, this.platformHit);
            this.physics.add.overlap(this.platform, this.ball, this.platformOverlap.bind(this));
            this.physics.add.collider(this.leftVerticalWall, this.ball, this.wallHit);
            this.physics.add.collider(this.rightVerticalWall, this.ball, this.wallHit);
            this.physics.add.collider(this.topHorizontalWall, this.ball, this.wallHit);
            this.physics.add.collider(this.bottomHorizontalWall, this.ball, this.floorHit.bind(this));
            for (let block of this.blocks) {
                this.physics.add.collider(block, this.ball, this.onBallBlock, null, this);
            }
            this.ball.setVelocity(0, 0);
        }
        speedUp() {
            this.ball.setVelocity(this.ball.body.velocity.x * 2, this.ball.body.velocity.y * 2);
        }
        slowDown() {
            this.ball.setVelocity(this.ball.body.velocity.x / 2, this.ball.body.velocity.y / 2);
        }
        createBlock(pos) {
            let cellPosition = this.getCellCenter(pos);
            let block = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(100).setImmovable();
            this.physics.add.collider(block, this.ball, this.onBallBlock, null, this);
            this.scaleSprite(block, this.cellSize * 0.9);
            this.blocks.push(block);
        }
        setupBlocks() {
            this.blocks = [];
            const FULL_LINES = 5;
            for (let x = 0; x < this.x; x++) {
                for (let y = 0; y < FULL_LINES; y++) {
                    this.createBlock({ x: x, y: y });
                }
            }
        }
        onBallBlock(block, ball) {
            console.log('ball hit');
            this.addScore(10);
            //js delete from array
            let i = this.blocks.indexOf(block);
            this.blocks.splice(i, 1);
            block.destroy();
        }
        onBulletBlock(block, bullet) {
            console.log('bullet hit');
            this.addScore(10);
            //js delete from array
            let i = this.blocks.indexOf(block);
            this.blocks.splice(i, 1);
            block.destroy();
            bullet.destroy();
        }
        spawnLine() {
            for (let block of this.blocks) {
                block.y = block.y + this.cellSize;
                if (block.y >= (this.offsetY + (this.y - 1) * this.cellSize)) {
                    this.addScore(-42);
                }
            }
            for (let x = 0; x < this.x; x++) {
                this.createBlock({ x: x, y: 0 });
            }
        }
        setupWalls() {
            let alpha = 0;
            this.setupHorizontalWalls(alpha);
            this.setupVerticalWalls(alpha);
        }
        setupHorizontalWalls(alpha) {
            let cellPosition = this.getCellCenter({ x: 5, y: -1 });
            this.topHorizontalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable();
            this.scaleSprite(this.topHorizontalWall, this.cellSize * 12);
            cellPosition = this.getCellCenter({ x: 5, y: 18 });
            this.bottomHorizontalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable();
            this.scaleSprite(this.bottomHorizontalWall, this.cellSize * 12);
        }
        setupVerticalWalls(alpha) {
            let cellPosition = this.getCellCenter({ x: -1, y: 9 });
            this.leftVerticalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable();
            this.scaleSprite(this.leftVerticalWall, this.cellSize);
            cellPosition = this.getCellCenter({ x: 10, y: 9 });
            this.rightVerticalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable();
            this.scaleSprite(this.rightVerticalWall, this.cellSize);
        }
        platformOverlap(platform, ball) {
            if (ball.body.velocity.y > 0) {
                ball.y = (this.getCellCenter({ x: 0, y: 16 }).y + ball.y) / 2;
                ball.body.velocity.x *= -1;
                ball.body.velocity.y *= -1;
            }
        }
        floorHit(cell, ball) {
            this.addScore(-84);
            this.isBallMoving = false;
            ball.destroy();
            this.setupBall(this.platformPosition, 16);
        }
        platformHit(cell, ball) {
        }
        wallHit(cell, ball) {
        }
    }
    exports.Arcanoid = Arcanoid;
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
        l: {
            b: [[0, 0], [0, 1], [0, 2], [1, 2]],
            next: 'lr'
        },
        lr: {
            b: [[0, 1], [1, 1], [2, 1], [2, 0]],
            next: 'lu'
        },
        lu: {
            b: [[0, 0], [1, 0], [1, 1], [1, 2]],
            next: 'll'
        },
        ll: {
            b: [[0, 1], [0, 0], [1, 0], [2, 0]],
            next: 'l'
        },
        j: {
            b: [[0, 2], [1, 2], [1, 1], [1, 0]],
            next: 'jr'
        },
        jr: {
            b: [[0, 0], [1, 0], [2, 0], [2, 1]],
            next: 'ju'
        },
        ju: {
            b: [[0, 2], [0, 1], [0, 0], [1, 0]],
            next: 'jl'
        },
        jl: {
            b: [[0, 0], [0, 1], [1, 1], [2, 1]],
            next: 'j'
        }
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
define("game/tetris", ["require", "exports", "game/base_game", "game/tetraminos"], function (require, exports, base_game_3, tetraminos_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Tetris extends base_game_3.BaseGame {
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
                let block = this.spawnBlock(pos);
                this.movingBlocks.add(block);
            }
            if (!this.canSpawn(blocks, { shiftX: 0, shiftY: 0 })) {
                this.addScore(-42);
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
            for (let block of blocks) {
                if (this.isPositionFull({ x: this.tx + block[0] + a.shiftX, y: this.ty + block[1] + a.shiftY })) {
                    return false;
                }
            }
            return true;
        }
        rotate() {
            let next = tetraminos_1.TGenerator.next(this.tname);
            let nextT = tetraminos_1.TGenerator.get(next);
            if (nextT === undefined) {
                return;
            }
            let adjustment = this.getAdjustment(nextT.b);
            if (true /*this.canSpawn(nextT.b, adjustment)*/) {
                this.tx += adjustment.shiftX;
                this.ty += adjustment.shiftY;
                this.tname = next;
                this.movingBlocks.destroy(true);
                this.movingBlocks = this.physics.add.group();
                for (let point of nextT.b) {
                    let pos = { x: this.tx + point[0], y: this.ty + point[1] };
                    let block = this.spawnBlock(pos);
                    this.movingBlocks.add(block);
                }
            }
            else {
                console.log('cannot rotate');
            }
        }
        spawnStupidLine() {
            for (let block of this.blocks.getChildren()) {
                block.y = block.y - this.cellSize;
                if (block.y <= (this.offsetY + this.cellSize)) {
                    this.addScore(-42);
                }
            }
            for (let x = 0; x < this.x; x++) {
                if (Math.random() > 0.3) {
                    let block = this.spawnBlock({ x: x, y: this.y - 1 });
                    this.blocks.add(block);
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
            for (let i = 0; i < this.y; i++) {
                let line = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y == i);
                if (line.length == this.x) {
                    this.addScore(this.scoreFullLine);
                    for (let block of line) {
                        this.blocks.remove(block);
                        block.destroy();
                    }
                    let blocksToFall = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y < i);
                    for (let block of blocksToFall) {
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
//# sourceMappingURL=app.js.map