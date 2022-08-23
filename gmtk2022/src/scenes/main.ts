import { Dice } from '../game/dice'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = false
const minSide = 13
const maxSide = 13


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

    private dice: Dice

    private score: number = 0

    public textScore?: Phaser.GameObjects.BitmapText
    public textHigh?: Phaser.GameObjects.BitmapText
    // public textDice?: Phaser.GameObjects.BitmapText

    constructor(
        sceneConfig: object
    ) {
        super({key: 'main'})
        // super(sceneConfig)

        this.x = minSide
        this.y = maxSide

        this.isVertical = gameWidth < gameHeight;
        if (this.isVertical) {
            this.cellSize = gameWidth / (this.x + 4)
            this.offsetX = this.cellSize * 2
            this.offsetY = this.cellSize * 5
        } else {
            this.cellSize = gameHeight / (this.y + 7)
            this.offsetX = halfWidth - this.cellSize * 6.5
            this.offsetY = this.cellSize * 5
        }
    }

    private music?: Phaser.Sound.BaseSound

    addScore(i: number) {

        if (i == -42) {
            this.scene.stop('main')
            this.scene.start('endgame')
            return
        }

        this.score += i
        this.textScore.text = this.score
        window.SCORE = this.score
        
        if (this.score > window.HIGHSCORE) {
            window.HIGHSCORE = this.score
            this.textHigh.text = window.HIGHSCORE
        }

        // console.log('score is ', this.score)
    }

    create() {
        this.cameras.main.setBackgroundColor('#959F7D');

        let rectangle: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D }})

        this.setupText()

        this.setupEvents()

        // this.music = this.sound.add('music')
        // this.music.play()

        this.score = 0

        this.dice = new Dice({
            cellSize: this.cellSize,
            x: this.x,
            y: this.y,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            physics: this.physics,
            rectangle: rectangle,
            addScore: this.addScore.bind(this)
        })

        // this.time.addEvent({
        //     delay: 1000,
        //     loop: true,
        //     callback: this.tetris.moveDown,
        //     callbackScope: this.tetris
        // })

        this.time.timeScale = 1;

        console.log('Game Created', this.x, this.y)

        // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
        this.input.keyboard.on('keydown', (event: any) => {
            if ([ Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A ].includes(event.keyCode)) {
                this.dice.moveLeft()

                event.stopPropagation()
            }
            if ([ Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D ].includes(event.keyCode)) {
                this.dice.moveRight()

                event.stopPropagation()
            }

            if ([Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.SPACE].includes(event.keyCode)) {
                this.dice.moveUp()

                event.preventDefault()
                event.stopPropagation()
            }

            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                this.dice.moveDown()

                event.preventDefault()
                event.stopPropagation()
            }

            if ([Phaser.Input.Keyboard.KeyCodes.M].includes(event.keyCode)) {
                event.preventDefault()
                event.stopPropagation()
                this.game.sound.mute = !this.game.sound.mute
            }
        });

        this.input.keyboard.on('keyup', (event: any) => {
            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                event.stopPropagation()
                this.time.timeScale = 1
            }
        })
        
        let buttonScale = this.isVertical ? gameWidth/10 : gameHeight/20
        if (this.sys.game.device.os.desktop == false) {
            let sprite = this.physics.add.sprite(0, 0, 'button_left').setInteractive()
            this.scaleSprite(sprite, buttonScale)
            sprite.setDepth(100)
            sprite.x = buttonScale * 2
            sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale
            sprite.on('pointerdown', (pointer: any) => {
                this.dice.moveLeft()
                // this.textDice.text = this.dice.currentDiceTop
            })

            sprite = this.physics.add.sprite(0, 0, 'button_right').setInteractive()
            this.scaleSprite(sprite, buttonScale)
            sprite.setDepth(100)
            sprite.x = buttonScale * 4
            sprite.y = this.isVertical ? gameHeight - buttonScale * 3 : halfHeight + buttonScale
            sprite.body.x = sprite.body.x + 100
            sprite.on('pointerdown', (pointer: any) => {
                this.dice.moveRight()
                // this.textDice.text = this.dice.currentDiceTop
            })

            sprite = this.physics.add.sprite(0, 0, 'button_down').setInteractive()
            this.scaleSprite(sprite, buttonScale)
            sprite.setDepth(100)
            sprite.x = buttonScale * 3
            sprite.y = this.isVertical ? gameHeight - buttonScale * 2 : halfHeight + buttonScale*2
            sprite.on('pointerdown', (pointer: any) => {
                this.dice.moveDown()
                // this.textDice.text = this.dice.currentDiceTop
            })
            sprite.on('pointerup', (pointer: any) => {
                this.dice.moveUp()
                // this.textDice.text = this.dice.currentDiceTop
            })

            sprite = this.physics.add.sprite(0, 0, 'button_action').setInteractive()
            this.scaleSprite(sprite, buttonScale*1.5)
            sprite.setDepth(100)
            sprite.x = gameWidth - buttonScale*2.5
            sprite.y = this.isVertical ? gameHeight - buttonScale*2.5 : halfHeight + buttonScale
            sprite.on('pointerdown', (pointer: any) => {
                // this.tetris.rotate()
            })
        }

        if (debug) {
            this.debugDrawGrid()
        }

    }

    update() {
        this.dice.update()
    }

    setupEvents() {
    }

    setupText() {
        this.add.bitmapText(gameWidth / 4, this.cellSize * 1, 'gamefont', 'SCORE', this.cellSize /2)
        this.textScore = this.add.bitmapText(gameWidth / 4, this.cellSize * 2, 'gamefont', '0', this.cellSize /2)

        this.add.bitmapText(gameWidth / 2, this.cellSize * 1, 'gamefont', 'HIGH', this.cellSize /2)
        this.textHigh = this.add.bitmapText(gameWidth / 2, this.cellSize * 2, 'gamefont', window.HIGHSCORE, this.cellSize /2)

        this.add.bitmapText(3 * gameWidth / 4, this.cellSize * 1, 'gamefont', "M TO", this.cellSize /2)
        this.add.bitmapText(3 * gameWidth / 4, this.cellSize * 2, 'gamefont', "MUTE", this.cellSize /2)
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }

    preload() {
        this.load.image('one', 'images/cell_full_one.png')
        this.load.image('two', 'images/cell_full_two.png')
        this.load.image('three', 'images/cell_full_three.png')
        this.load.image('four', 'images/cell_full_four.png')
        this.load.image('five', 'images/cell_full_five.png')
        this.load.image('six', 'images/cell_full_six.png')

        this.load.image('cell_available_one', 'images/cell_available_one.png')
        this.load.image('cell_available_two', 'images/cell_available_two.png')
        this.load.image('cell_available_three', 'images/cell_available_three.png')
        this.load.image('cell_available_four', 'images/cell_available_four.png')
        this.load.image('cell_available_five', 'images/cell_available_five.png')
        this.load.image('cell_available_six', 'images/cell_available_six.png')
        
        this.load.image('visited', 'images/cell_visited.png')
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
        this.load.image('button_sound', 'images/button_sound.png')
        this.load.image('button_reset', 'images/button_reset.png')
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
