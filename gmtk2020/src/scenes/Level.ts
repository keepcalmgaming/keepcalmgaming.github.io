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


export class LevelScene extends Phaser.Scene {
    private isVertical: boolean

    private rectSize: number
    private offsetX: number = 0
    private offsetY: number = 0
    private x: number
    private y: number

    private carX: number = 0
    private carY: number = 0

    public towergame: Game

    private carSprite?: Phaser.GameObjects.Sprite

    private crossroads?: Phaser.Physics.Arcade.Group
	

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
        this.cameras.main.setBackgroundColor('#FFFFFF');

        this.setupHouses()
        this.setupCrossRoads()

        this.setupEvents()

        // this.music = this.sound.add('music')
        // this.music.play()
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

        this.carSprite = this.physics.add.sprite(this.offsetX + this.rectSize * 0.5, this.offsetY + this.rectSize * 0.5, 'car')
        this.scaleSprite(this.carSprite, this.rectSize * 0.5)

        this.setupControls()

        // TODO: set start/finish/flags from here
        let ls = li.level
        
    }

    setupControls() {
        let sprite = this.physics.add.sprite(0, 0, 'arrow_right').setInteractive()
        sprite.x = gameWidth - 50
        sprite.y = gameHeight - 50
        sprite.on('pointerdown', (pointer: any) => {
            this.processInput(DriverInput.Right)
        })
    }

    processInput(d: DriverInput) {
        console.log('LEVEL SCENE, PROCESS INPUT', d)
        // TODO: Draw bubbles here
        this.driver.input(d)
    }

    update() {
        console.log('update()')
        this.input.on('pointerup', () => {
            if (!this.towergame.active()) {
                if (this.music) { this.music.destroy() }

              this.towergame = new Game(this.x, this.y, this.isVertical)
              this.scene.restart();
            }
        });
    }

    setupHouses() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 }})
		
		for (let i = 0; i < maxSide; i++) {
			for (let j = 0; j < minSide; j++) {
				field.fillRect(this.offsetX + this.rectSize * (3 * i + 1), this.offsetY + this.rectSize * (3 * j + 1), this.rectSize * 2, this.rectSize * 2);
			}
		}
    }

    setupEvents() {
        if (!this.crossroads || !this.carSprite) return
        this.physics.add.collider(this.crossroads, this.carSprite, this.crossroadHit)

        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: this.moveCar,
            callbackScope: this
        })
    }

    crossroadHit(car: Phaser.GameObjects.GameObject, crossroad: Phaser.GameObjects.GameObject) {

    }

    moveCar() {
        if (!this.car || !this.carSprite) return

        // switch (this.car.getNextStep) {
        //     case Direction.Forward
        // }
        this.physics.moveTo(this.carSprite, this.carSprite.x + this.car.speed, this.carSprite.y)
    }

    setupCrossRoads() {
        this.crossroads = this.physics.add.group()
		for (let i = 0; i <= maxSide; i++) {
			for (let j = 0; j <= minSide; j++) {
                let crossroad = this.crossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace')
                // crossroad.alpha = 0
                this.scaleSprite(crossroad, this.rectSize * 2)
			}
		}
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }

    preload() {
        this.load.image('car', 'images/car.png')
        this.load.image('arrow_left', 'images/arrow_left.png')
        this.load.image('arrow_right', 'images/arrow_right.png')
        this.load.image('arrow_up', 'images/arrow_up.png')
        this.load.image('arrow_down', 'images/arrow_down.png')
        this.load.image('bubble_left', 'images/bubble_left.png')
        this.load.image('bubble_right', 'images/bubble_right.png')
        this.load.image('bubble_up', 'images/bubble_up.png')
        this.load.image('bubble_down', 'images/bubble_down.png')
        this.load.image('towerplace', 'images/towerplace.png')

        // this.load.audio('music', 'sounds/NavigatorOST.mp3')
    }
}
