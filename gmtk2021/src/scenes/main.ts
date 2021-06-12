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

    private tetris: Tetris
    private arcanoid: Arcanoid

    // private mfGroup?: Phaser.Physics.Arcade.StaticGroup
    // private mainframe?: Phaser.GameObjects.Sprite
    // private tower?: Phaser.GameObjects.Sprite
    // private towerSpawns: Phaser.GameObjects.Sprite[] = []
    // private monsterSpawns: Phaser.GameObjects.Sprite[] = []

    // private monsters?: Phaser.Physics.Arcade.Group
    // private bullets?: Phaser.Physics.Arcade.Group

    // public textLives?: Phaser.GameObjects.Text
    // public textScore?: Phaser.GameObjects.Text

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

    create() {
        this.cameras.main.setBackgroundColor('#959F7D');

        let rectangle: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: this.cellSize / 4, color: 0x0F110D }})

        this.setupText()

        this.setupEvents()

        // this.music = this.sound.add('music')
        // this.music.play()

        this.tetris = new Tetris({
            cellSize: this.cellSize,
            x: this.x,
            y: this.y,
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            physics: this.physics,
            rectangle: rectangle
        })

        this.arcanoid = new Arcanoid({
            cellSize: this.cellSize,
            x: this.x,
            y: this.y,
            offsetX: this.offsetX + this.cellSize * (this.x + 4),
            offsetY: this.offsetY,
            physics: this.physics,
            rectangle: rectangle
        })

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.tetris.moveDown,
            callbackScope: this.tetris
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

            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                event.stopPropagation()
                this.time.timeScale = 15.5
            }
        });

        this.input.keyboard.on('keyup', (event: any) => {
            if ([Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S].includes(event.keyCode)) {
                event.stopPropagation()
                this.time.timeScale = 1
            }
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
        console.log('drawing field')
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 }, fillStyle: { color: 0x000000 }})

        field.strokeRect(this.offsetX, this.offsetY, this.cellSize*this.x, this.cellSize*this.y)
        field.strokeRect(this.offsetX + this.cellSize*(this.x+4), this.offsetY, this.cellSize*this.x, this.cellSize*this.y)
    }
}
