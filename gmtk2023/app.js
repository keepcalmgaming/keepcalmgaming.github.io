define("scenes/greeting", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GreetingScene = void 0;
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
                "Resolve",
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
    exports.BaseGame = void 0;
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
            // this.setupBackgroundCells()
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
define("game/card", ["require", "exports", "game/base_game"], function (require, exports, base_game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Card = void 0;
    class Card extends base_game_1.BaseGame {
        constructor(config) {
            super(config);
            this.cardGroup = this.physics.add.group();
            console.log('Card', this.config);
            let pos = { x: this.config.cellX, y: this.config.cellY };
            this.hidden = this.config.hidden;
            this.cardType = this.config.cardType;
            this.player = this.config.player;
            this.onCardPlayed = this.config.onCardPlayed;
            this.spawnCard(pos);
        }
        spawnCard(pos) {
            this.cardSprite = this.spawnCardBlock(pos);
            this.cardGroup.add(this.cardSprite);
        }
        moveLeft() {
            let position = this.getSpritePosition(this.cardSprite);
            let step = 1;
            let newPosition = { x: +position.x - step, y: position.y };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            if (this.cardSprite.x > 0) {
                this.cardSprite.x = this.cardSprite.x - step * this.cellSize;
            }
            this.addScore(1);
        }
        moveRight() {
            let position = this.getSpritePosition(this.cardSprite);
            let step = 1;
            let newPosition = { x: +position.x + step, y: position.y };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            if (this.cardSprite.x > 0) {
                this.cardSprite.x = this.cardSprite.x + step * this.cellSize;
            }
            this.addScore(1);
        }
        moveDown() {
            let position = this.getSpritePosition(this.cardSprite);
            let step = 1;
            let newPosition = { x: position.x, y: +position.y + step };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            if (this.cardSprite.x > 0) {
                this.cardSprite.y = this.cardSprite.y + step * this.cellSize;
            }
            this.addScore(1);
        }
        moveUp() {
            let position = this.getSpritePosition(this.cardSprite);
            let step = 1;
            let newPosition = { x: position.x, y: +position.y - step };
            if (this.isPositionFull(newPosition)) {
                return;
            }
            if (this.cardSprite.x > 0) {
                this.cardSprite.y = this.cardSprite.y - step * this.cellSize;
            }
            this.addScore(1);
        }
        playCard() {
            let position = this.getSpritePosition(this.cardSprite);
            let newPosition = this.getPlayedCardPosition();
            if (this.isPositionFull(newPosition)) {
                return;
            }
            if (this.hidden) {
                this.hidden = false;
            }
            this.redrawCard();
            let coords = this.getCellCenter(newPosition);
            this.cardSprite.x = coords.x;
            this.cardSprite.y = coords.y;
            this.addScore(1);
        }
        spawnCardBlock(pos) {
            let coords = this.getCellCenter(pos);
            let cardTexture = this.getCardTexture();
            let block = this.physics.add.image(coords.x, coords.y, cardTexture).setInteractive();
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            block.on('pointerdown', (pointer) => {
                if (this.player) {
                    this.onCardPlayed(this);
                    // this.hidden = !this.hidden
                    // this.redrawCard()
                }
            });
            return block;
        }
        getPlayedCardPosition() {
            if (this.player) {
                return { x: 5, y: 6 };
            }
            else {
                return { x: 7, y: 6 };
            }
        }
        isPositionFull(position) {
            if (position.x < 0 || position.y < 0 || position.x >= this.x || position.y >= this.y) {
                return true;
            }
            return false;
        }
        getCardTexture() {
            if (this.hidden) {
                return 'card_back';
            }
            else {
                return this.cardType;
            }
        }
        redrawCard() {
            this.cardSprite.setTexture(this.getCardTexture());
        }
        update() {
            super.update();
        }
        hide() {
            this.cardSprite.visible = false;
            this.cardGroup.visible = false;
        }
        show() {
            this.cardSprite.visible = true;
            this.cardGroup.visible = true;
        }
    }
    exports.Card = Card;
});
define("game/turn", ["require", "exports", "game/base_game"], function (require, exports, base_game_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Turn = void 0;
    class Turn extends base_game_2.BaseGame {
        constructor(config) {
            super(config);
            this.turnGroup = this.physics.add.group();
            console.log('Turn', this.config);
            this.onTurnClicked = this.config.onTurnClicked;
            let pos = { x: 9, y: 6 };
            this.spawnTurn(pos);
            this.hide();
        }
        spawnTurn(pos) {
            this.turnSprite = this.spawnTurnBlock(pos);
            this.turnGroup.add(this.turnSprite);
        }
        spawnTurnBlock(pos) {
            let coords = this.getCellCenter(pos);
            let turnTexture = 'turn';
            let block = this.physics.add.image(coords.x, coords.y, turnTexture).setInteractive();
            block.setOrigin(0.5);
            this.scaleSprite(block, this.cellSize * 0.9);
            block.on('pointerdown', (pointer) => {
                this.onTurnClicked();
            });
            return block;
        }
        hide() {
            this.turnSprite.visible = false;
        }
        show() {
            this.turnSprite.visible = true;
        }
    }
    exports.Turn = Turn;
});
define("scenes/main", ["require", "exports", "game/card", "game/turn"], function (require, exports, card_1, turn_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainScene = void 0;
    const gameHeight = window.innerHeight;
    const gameWidth = window.innerWidth;
    const halfWidth = gameWidth / 2;
    const halfHeight = gameHeight / 2;
    const debug = false;
    const minSide = 13;
    const maxSide = 13;
    class MainScene extends Phaser.Scene {
        constructor(sceneConfig) {
            super({ key: 'main' });
            this.offsetX = 0;
            this.offsetY = 0;
            this.enemyCards = [];
            this.playerCards = [];
            this.tableCards = [];
            this.score = 0;
            this.playerCardPlayed = false;
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
            this.statistics = { gold: 0, childs: 0 };
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
        onCardPlayed(card) {
            console.log('onCardPlayed', card);
            if (card.player && !this.playerCardPlayed) {
                this.playerCardPlayed = true;
                card.playCard();
                this.tableCards.push(card);
                this.playEnemyCard();
            }
        }
        playEnemyCard() {
            console.log('playEnemyCard', this.enemyCards);
            let index = 0; //TODO get random
            let card = this.enemyCards[index];
            card.playCard();
            this.tableCards.push(card);
            this.onEnemyCardPlayed();
        }
        onEnemyCardPlayed() {
            console.log('onEnemyCardPlayed');
            this.turn.show();
        }
        resolveTableCards(card1, card2) {
            let isKing = /.+_king$/;
            let isQueen = /.+_queen$/;
            let kingVsKing = (isKing.test(card1.cardType) && isKing.test(card2.cardType));
            let kingVsQueen = (isKing.test(card1.cardType) && isQueen.test(card2.cardType)) || (isKing.test(card2.cardType) && isQueen.test(card1.cardType));
            if (kingVsKing) {
                console.log('gold + 1');
                this.statistics.gold += 1;
            }
            else if (kingVsQueen) {
                console.log('childS + 1');
                this.statistics.childs += 1;
            }
        }
        onTurnClicked() {
            console.log('onTurnClicked');
            this.turn.hide();
            this.resolveTableCards(this.tableCards[0], this.tableCards[1]);
            this.tableCards.forEach(function (card) {
                //TODO remove from playerCards, enemyCards
                card.hide();
            });
            this.playerCards = this.playerCards.filter(card => card !== this.tableCards[0]);
            this.playerCards = this.playerCards.filter(card => card !== this.tableCards[1]);
            this.enemyCards = this.enemyCards.filter(card => card !== this.tableCards[0]);
            this.enemyCards = this.enemyCards.filter(card => card !== this.tableCards[1]);
            if (this.playerCards.length == 0 || this.enemyCards.length == 0) {
                this.addScore(-42);
            }
            this.tableCards = [];
            this.playerCardPlayed = false;
        }
        create() {
            this.cameras.main.setBackgroundColor('#959F7D');
            this.rectangle = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D } });
            this.turn = new turn_1.Turn({
                cellSize: this.cellSize,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: this.rectangle,
                onTurnClicked: this.onTurnClicked.bind(this)
            });
            this.setupText();
            this.setupEvents();
            // this.music = this.sound.add('music')
            // this.music.play()
            this.score = 0;
            this.spawnCards(this.rectangle);
            // this.card = new Card({
            //     cellSize: this.cellSize,
            //     cellX: 6,
            //     cellY: 6,
            //     cardType: 'clubs_jack',
            //     hidden: false,
            //     x: this.x,
            //     y: this.y,
            //     offsetX: this.offsetX,
            //     offsetY: this.offsetY,
            //     physics: this.physics,
            //     rectangle: rectangle,
            //     addScore: this.addScore.bind(this)
            // })
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
                    // this.card.moveLeft()
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D].includes(event.keyCode)) {
                    // this.card.moveRight()
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.SPACE].includes(event.keyCode)) {
                    // this.card.moveUp()
                    event.preventDefault();
                    event.stopPropagation();
                }
                if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                    // this.card.moveDown()
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
                    // this.card.moveLeft()
                });
                sprite = this.physics.add.sprite(0, 0, 'button_right').setInteractive();
                this.scaleSprite(sprite, buttonScale);
                sprite.setDepth(100);
                sprite.x = buttonScale * 4;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale;
                sprite.body.x = sprite.body.x + 100;
                sprite.on('pointerdown', (pointer) => {
                    // this.card.moveRight()
                });
                sprite = this.physics.add.sprite(0, 0, 'button_down').setInteractive();
                this.scaleSprite(sprite, buttonScale);
                sprite.setDepth(100);
                sprite.x = buttonScale * 3;
                sprite.y = this.isVertical ? gameHeight - buttonScale * 2 : halfHeight + buttonScale * 2;
                sprite.on('pointerdown', (pointer) => {
                    // this.card.moveDown()
                });
                sprite.on('pointerup', (pointer) => {
                    // this.card.moveUp()
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
        spawnCards(rectangle) {
            this.spawnEnemyCards(rectangle);
            this.spawnPlayerCards(rectangle);
        }
        spawnEnemyCards(rectangle) {
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 1,
                cellY: 1,
                cardType: CardType.SPADES_ACE,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 3,
                cellY: 1,
                cardType: CardType.SPADES_ACE,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 5,
                cellY: 1,
                cardType: CardType.HEARTS_KING,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 7,
                cellY: 1,
                cardType: CardType.SPADES_ACE,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 9,
                cellY: 1,
                cardType: CardType.HEARTS_KING,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.enemyCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 11,
                cellY: 1,
                cardType: CardType.SPADES_ACE,
                hidden: true,
                player: false,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
        }
        spawnPlayerCards(rectangle) {
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 1,
                cellY: 11,
                cardType: CardType.DIAMONDS_QUEEN,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 3,
                cellY: 11,
                cardType: CardType.HEARTS_KING,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 5,
                cellY: 11,
                cardType: CardType.DIAMONDS_QUEEN,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 7,
                cellY: 11,
                cardType: CardType.SPADES_ACE,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 9,
                cellY: 11,
                cardType: CardType.DIAMONDS_QUEEN,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
            this.playerCards.push(new card_1.Card({
                cellSize: this.cellSize,
                cellX: 11,
                cellY: 11,
                cardType: CardType.HEARTS_KING,
                hidden: false,
                player: true,
                x: this.x,
                y: this.y,
                offsetX: this.offsetX,
                offsetY: this.offsetY,
                physics: this.physics,
                rectangle: rectangle,
                addScore: this.addScore.bind(this),
                onCardPlayed: this.onCardPlayed.bind(this)
            }));
        }
        update() {
            // this.card.update()
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
            this.load.image(CardType.SPADES_ACE, 'images/spades_ace.png');
            this.load.image(CardType.CLUBS_JACK, 'images/clubs_jack.png');
            this.load.image(CardType.HEARTS_KING, 'images/hearts_king.png');
            this.load.image(CardType.DIAMONDS_QUEEN, 'images/diamonds_queen.png');
            this.load.image('turn', 'images/turn.png');
            this.load.image('card_back', 'images/card_back.png');
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
    var CardType;
    (function (CardType) {
        CardType["SPADES_SIX"] = "";
        CardType["SPADES_SEVEN"] = "";
        CardType["SPADES_EIGHT"] = "";
        CardType["SPADES_NINE"] = "";
        CardType["SPADES_TEN"] = "";
        CardType["SPADES_JACK"] = "";
        CardType["SPADES_QUEEN"] = "";
        CardType["SPADES_KING"] = "";
        CardType["SPADES_ACE"] = "spades_ace";
        CardType["CLUBS_SIX"] = "";
        CardType["CLUBS_SEVEN"] = "";
        CardType["CLUBS_EIGHT"] = "";
        CardType["CLUBS_NINE"] = "";
        CardType["CLUBS_TEN"] = "";
        CardType["CLUBS_JACK"] = "clubs_jack";
        CardType["CLUBS_QUEEN"] = "";
        CardType["CLUBS_KING"] = "";
        CardType["CLUBS_ACE"] = "";
        CardType["HEARTS_SIX"] = "";
        CardType["HEARTS_SEVEN"] = "";
        CardType["HEARTS_EIGHT"] = "";
        CardType["HEARTS_NINE"] = "";
        CardType["HEARTS_TEN"] = "";
        CardType["HEARTS_JACK"] = "";
        CardType["HEARTS_QUEEN"] = "";
        CardType["HEARTS_KING"] = "hearts_king";
        CardType["HEARTS_ACE"] = "";
        CardType["DIAMONDS_SIX"] = "";
        CardType["DIAMONDS_SEVEN"] = "";
        CardType["DIAMONDS_EIGHT"] = "";
        CardType["DIAMONDS_NINE"] = "";
        CardType["DIAMONDS_TEN"] = "";
        CardType["DIAMONDS_JACK"] = "";
        CardType["DIAMONDS_QUEEN"] = "diamonds_queen";
        CardType["DIAMONDS_KING"] = "";
        CardType["DIAMONDS_ACE"] = "";
    })(CardType || (CardType = {}));
});
define("scenes/endgame", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndgameScene = void 0;
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
    exports.App = void 0;
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
//# sourceMappingURL=app.js.map