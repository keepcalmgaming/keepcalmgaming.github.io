import { Tetris } from '../game/tetris'
import { Arcanoid } from '../game/arcanoid'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = false
const minSide = 10
const maxSide = 18

type Cell = {
    x: number,
    y: number
}

type Position = {
    x: number,
    y: number
}

export class MainScene extends Phaser.Scene {
    private isVertical: boolean

    private cellSize: number
    private offsetX: number = 0
    private offsetY: number = 0
    private x: number
    private y: number

    private particles: any

    private tetris: Tetris
    private arcanoid: Arcanoid

    private score: number = 0

    public textScore?: Phaser.GameObjects.BitmapText
    public textHigh?: Phaser.GameObjects.BitmapText

    constructor(
        sceneConfig: object
    ) {
        super({key: 'main'})
        // super(sceneConfig)

        this.x = minSide
        this.y = maxSide

        this.isVertical = gameWidth < gameHeight;
        if (this.isVertical) {
            this.cellSize = gameWidth / (this.x*2 + 8)
            this.offsetX = this.cellSize * 2
            this.offsetY = this.cellSize * 2
        } else {
            this.cellSize = gameHeight / (this.y+4)
            this.offsetX = halfWidth - this.cellSize * (this.x + 2)
            this.offsetY = this.cellSize * 2
        }
    }

    private music?: Phaser.Sound.BaseSound

    addScore(i: number) {
        if (i == -84) {
            let emitter = this.particles.createEmitter({
                x: this.arcanoid.ball.x,
                y: this.arcanoid.ball.y,
                speed: 100,
                blendMode: 'ADD',
                lifespan: 800,
                frames: 10
            });
            emitter.explode()
            this.tetris.spawnStupidLine()

            return
        }

        if (i == -42) {
            this.scene.stop('main')
            this.scene.start('endgame')
            return
        }

        this.score += i
        this.textScore.text = this.score

        if (this.score > window.HIGHSCORE) {
            window.HIGHSCORE = this.score
            this.textHigh.text = window.HIGHSCORE
        }

        if (i > 42) {
            this.arcanoid.spawnLine()
        }
        console.log('score is ', this.score)
    }

    create() {
        this.cameras.main.setBackgroundColor('#959F7D');

        let rectangle: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D }})

        this.setupText()

        this.setupEvents()

        // this.music = this.sound.add('music')
        // this.music.play()

        this.score = 0

        this.particles = this.add.particles('particle');

        this.tetris = new Tetris({
            cellSize: this.cellSize,
            x: this.x,
            y: this.y,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            physics: this.physics,
            rectangle: rectangle,
            addScore: this.addScore.bind(this)
        })

        this.arcanoid = new Arcanoid({
            cellSize: this.cellSize,
            x: this.x,
            y: this.y,
            offsetX: this.offsetX + this.cellSize * (this.x + 4),
            offsetY: this.offsetY,
            physics: this.physics,
            rectangle: rectangle,
            addScore: this.addScore.bind(this)
        })

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.tetris.moveDown,
            callbackScope: this.tetris
        })

        this.time.addEvent({
            delay: 100000,
            loop: true,
            callback: this.arcanoid.spawnLine,
            callbackScope: this.arcanoid
        })

        this.time.timeScale = 1;

        console.log('Game Created', this.x, this.y)

        // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
        this.input.keyboard.on('keydown', (event: any) => {
            if ([ Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A ].includes(event.keyCode)) {
                event.stopPropagation()
                this.tetris.moveLeft()
                this.arcanoid.moveLeft()
            }
            if ([ Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D ].includes(event.keyCode)) {
                event.stopPropagation()
                this.tetris.moveRight()
                this.arcanoid.moveRight()
            }

            if ([Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.SPACE].includes(event.keyCode)) {
                event.preventDefault()
                event.stopPropagation()
                this.tetris.rotate()
                this.arcanoid.fire()
            }

            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                event.preventDefault()
                event.stopPropagation()
                this.time.timeScale = 15.5
                this.arcanoid.speedUp();
            }
        });

        this.input.keyboard.on('keyup', (event: any) => {
            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                event.stopPropagation()
                this.time.timeScale = 1
                this.arcanoid.slowDown();
            }
        })
        
        let buttonScale = this.isVertical ? gameWidth/10 : gameHeight/20

        let sprite = this.physics.add.sprite(0, 0, 'button_left').setInteractive()
        this.scaleSprite(sprite, buttonScale*1.3)
        sprite.setDepth(100)
        sprite.x = buttonScale * 2
        sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale
        sprite.on('pointerdown', (pointer: any) => {
            this.tetris.moveLeft()
            this.arcanoid.moveLeft()
        })

        sprite = this.physics.add.sprite(0, 0, 'button_right').setInteractive()
        this.scaleSprite(sprite, buttonScale*1.3)
        sprite.setDepth(100)
        sprite.x = buttonScale * 4
        sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale
        sprite.body.x = sprite.body.x + 100
        sprite.on('pointerdown', (pointer: any) => {
            this.tetris.moveRight()
            this.arcanoid.moveRight()
        })

        sprite = this.physics.add.sprite(0, 0, 'button_down').setInteractive()
        this.scaleSprite(sprite, buttonScale*1.3)
        sprite.setDepth(100)
        sprite.x = buttonScale * 3
        sprite.y = this.isVertical ? gameHeight - buttonScale * 2 : halfHeight + buttonScale*2
        sprite.on('pointerdown', (pointer: any) => {
            this.time.timeScale = 15.5
            this.arcanoid.speedUp();
        })
        sprite.on('pointerup', (pointer: any) => {
            this.time.timeScale = 1
            this.arcanoid.slowDown();
        })

        sprite = this.physics.add.sprite(0, 0, 'button_action').setInteractive()
        this.scaleSprite(sprite, buttonScale*1.5)
        sprite.setDepth(100)
        sprite.x = gameWidth - buttonScale*2.5
        sprite.y = this.isVertical ? gameHeight - buttonScale*2.5 : halfHeight + buttonScale
        sprite.on('pointerdown', (pointer: any) => {
            this.tetris.rotate()
            this.arcanoid.fire()
        })

        if (debug) {
            this.debugDrawGrid()
        }

    }

    update() {
        this.arcanoid.update()
        this.tetris.update()
    }

    setupEvents() {
    }

    setupText() {
        this.add.bitmapText(halfWidth - this.cellSize, this.cellSize * 3, 'gamefont', 'SCORE', this.cellSize /2)
        this.textScore = this.add.bitmapText(halfWidth - this.cellSize, this.cellSize * 4, 'gamefont', '0', this.cellSize /2)

        this.add.bitmapText(halfWidth - this.cellSize, this.cellSize * 6, 'gamefont', 'HIGH', this.cellSize /2)
        this.textHigh = this.add.bitmapText(halfWidth - this.cellSize, this.cellSize * 7, 'gamefont', window.HIGHSCORE, this.cellSize /2)
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }

    preload() {
        this.load.image('cell', 'images/cell_empty.png')
        this.load.image('block', 'images/cell_full.png')
        this.load.image('ball', 'images/ball.png')
        this.load.image('bullet', 'images/bullet.png')
        this.load.image('vertical_wall', 'images/vertical_wall.png')
        this.load.image('horizontal_wall', 'images/horizontal_wall.png')
        this.load.image('button_left', 'images/left_button.png')
        this.load.image('button_right', 'images/right_button.png')
        this.load.image('button_down', 'images/button_down.png')
        this.load.image('button_action', 'images/action_button.png')
        this.load.image('platform', 'images/platform.png')
        this.load.image('particle', 'images/particle.png')

        this.load.bitmapFont('gamefont', 'font/gamefont.png', 'font/gamefont.fnt');
    }

    debugDrawGrid() {
        console.log('drawing field')
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 }, fillStyle: { color: 0x000000 }})

        field.strokeRect(this.offsetX, this.offsetY, this.cellSize*this.x, this.cellSize*this.y)
        field.strokeRect(this.offsetX + this.cellSize*(this.x+4), this.offsetY, this.cellSize*this.x, this.cellSize*this.y)
    }
}
