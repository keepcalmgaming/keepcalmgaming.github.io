import { Game } from '../game/game'
import { 
    LevelInfo, 
    LevelSetup, 
    LevelsSettings,
    Direction,
    DriverInput
} from '../game/utils'
import { Car } from '../game/car'
import { Driver, SimpleDriver } from '../game/driver'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
const minSide = 8
const maxSide = 9

type Cell = {
    x: number,
    y: number
}

type Position = {
    x: number,
    y: number
}

export class LevelScene extends Phaser.Scene {
    private isVertical: boolean

    private rectSize: number
    private offsetX: number = 0
    private offsetY: number = 0
    private x: number
    private y: number

    public towergame: Game

    private mfGroup?: Phaser.Physics.Arcade.StaticGroup
    private mainframe?: Phaser.GameObjects.Sprite

    public textLives?: Phaser.GameObjects.Text
    public textScore?: Phaser.GameObjects.Text

    constructor(
        sceneConfig: object
    ) {
        super({key: 'Level'})
        // super(sceneConfig)

        this.isVertical = gameHeight > gameWidth

        if (this.isVertical) {
            this.x = minSide
            this.y = maxSide
        } else {
            this.x = maxSide
            this.y = minSide
        }

        let rw = gameWidth / (this.x * 3 + 1)
		let rh = gameHeight / (this.y * 3 + 1)
        this.rectSize = rh < rw ? rh : rw
        this.offsetX = (gameWidth - this.rectSize * (this.x * 3 + 1)) / 2
        this.offsetY = (gameHeight - this.rectSize * (this.y * 3 + 1)) / 2

        this.towergame = new Game(this.x, this.y, this.isVertical)

        console.log('Game Created', this.x, this.y, this.towergame)
    }

    private music?: Phaser.Sound.BaseSound

    create() {
        this.loadLevel()
        console.log('Create()', window.a)
        this.cameras.main.setBackgroundColor('#FFFFFF');

        this.setupHouses()

        this.setupText()

        this.setupEvents()

        this.music = this.sound.add('music')
        this.music.play()
    }


    levelInfo: LevelInfo = LevelsSettings[0]
    car: Car = new Car()
    driver: Driver = new SimpleDriver()

    loadLevel(): void {
        let li: LevelInfo = (<any>window).LevelSetup
        this.levelInfo = li
        this.car = new Car()
        this.driver = li.driverConstructor()
        this.car.setDriver(this.driver)

        // TODO: set start/finish/flags from here
        let ls = li.level
    }

    update() {
        this.input.on('pointerup', () => {
            if (!this.towergame.active()) {
                if (this.music) { this.music.destroy() }

              this.towergame = new Game(this.x, this.y, this.isVertical)
              this.scene.restart();
            }
        });
    }

    setupHouses() {
		let rows = 9
		let cols = 8
		
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 }})
		
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				field.fillRect(this.offsetX + this.rectSize * (3 * i + 1), this.offsetY + this.rectSize * (3 * j + 1), this.rectSize * 2, this.rectSize * 2);
				
			}
		}
    }

    setupEvents() {
        if (!this.mainframe || !this.mfGroup) return
    }

    setupText() {
        this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
        this.textScore = this.add.text(gameWidth - 120, 20, `SCORE: ${this.towergame.score}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }

    getMFC(): Position {
        let mf = this.towergame.mainframe
        return this.getC({ x: mf.x + 1, y: mf.y + 1 })
    }

    getC(c: Cell): Position {
        return {
            x: this.getCX(c.x),
            y: this.getCY(c.y)
        }
    }

    getCX(x: number): number { return this.offsetX + x*this.rectSize }

    getCY(y: number): number { return this.offsetY + y*this.rectSize }


    preload() {
        this.load.image('bullet', 'images/bullet2.png')
        this.load.image('mainframe', 'images/mainframe.png')
        this.load.image('monster', 'images/monster.png')
        this.load.image('monsterplace', 'images/monsterplace.png')
        this.load.image('tower', 'images/tower.png')
        this.load.image('towerplace', 'images/towerplace.png')
        this.load.image('wallbrick', 'images/wallbrick.png')

        this.load.audio('music', 'sounds/GameOST.mp3')
    }
}
