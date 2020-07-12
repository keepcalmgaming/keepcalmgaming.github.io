import { Game } from '../game/game'
import { 
    LevelInfo, 
    LevelSetup, 
    LevelsSettings,
    LevelConfig,
    LevelResults,
    Direction,
    DriverInput,
    HeroSceneInfo,
    Movement
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

    private stars: number = 1

    private carSprite: Phaser.GameObjects.Sprite

    private bigCrossroads?: Phaser.Physics.Arcade.Group
    private smallCrossroads?: Phaser.Physics.Arcade.Group
	

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

        console.log('Game Created', this.x, this.y)
    }

    private music?: Phaser.Sound.BaseSound

    create() {
        this.loadLevel()
        this.cameras.main.setBackgroundColor('#FFFFFF');

        this.setupHouses()
        this.setupCrossRoads()

        this.setupEvents()

        this.load.once('complete', () => {
            // let music = this.sound.add('music')
            // music.play()
        }, this);
        this.load.audio('music', 'sounds/NavigatorOST.mp3')
        this.load.start();
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
        this.carSprite.setDepth(20)
        this.carSprite.setAngle(90)
        console.log(this.carSprite.width, this.carSprite.height)
        this.scaleSprite(this.carSprite, this.rectSize * 0.5)
        console.log(this.carSprite.width, this.carSprite.height)

        this.setupControls()

        // TODO: set start/finish/flags from here
        let ls = li.level

        let startSprite = this.physics.add.sprite(this.getX(ls.start.x), this.getY(ls.start.y), 'start')
        startSprite.setOrigin(0.5)
        this.scaleSprite(startSprite, this.rectSize)
        startSprite.setDepth(15)

        let finishSprite = this.physics.add.sprite(this.getX(ls.finish.x), this.getY(ls.finish.y), 'finish')
        finishSprite.setOrigin(0.5)
        this.scaleSprite(finishSprite, this.rectSize)
        finishSprite.setDepth(15)

        this.physics.add.collider(
            finishSprite,
            this.carSprite,
            () => {
                this.time.addEvent({
                    delay: 600,
                    loop: false,
                    callback: () => {
                        this.finishLevel();
                    }
                })
            }
        )

        for (let flag of ls.flags) {
            let flagSprite = this.physics.add.sprite(this.getX(flag.x), this.getY(flag.y), 'flag_ready')
            flagSprite.setOrigin(0.5)
            this.scaleSprite(flagSprite, this.rectSize)
            flagSprite.setDepth(15)
        }
    }

    setupControls() {
        let mapping = [
            {
                keys: [ Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.W ],
                value: DriverInput.Cool
            },
            {
                keys: [ Phaser.Input.Keyboard.KeyCodes.DOWN, Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.SPACE, Phaser.Input.Keyboard.KeyCodes.ENTER ],
                value: DriverInput.Crap
            },
            {
                keys: [ Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.A ],
                value: DriverInput.Left
            },
            {
                keys: [ Phaser.Input.Keyboard.KeyCodes.RIGHT, Phaser.Input.Keyboard.KeyCodes.D ],
                value: DriverInput.Right
            }
        ]

        // this.input.keyboard.on('keydown-SPACE', () => console.log('hello'))
        this.input.keyboard.on('keydown', (event: any) => {
            for (let data of mapping) {
                for (let key of data.keys) {
                    if (event.keyCode === key) {
                        event.stopPropagation()
                        this.processInput(data.value);
                    }
                }
            }
            console.log(event)
        });

        let sprite = this.physics.add.sprite(0, 0, 'arrow_right').setInteractive()
        sprite.setDepth(100)
        sprite.x = gameWidth - 50
        sprite.y = gameHeight - 50
        sprite.on('pointerdown', (pointer: any) => {
            this.processInput(DriverInput.Right)
        })

        sprite = this.physics.add.sprite(0, 0, 'arrow_down').setInteractive()
        sprite.setDepth(100)
        sprite.x = gameWidth - 50 - 60
        sprite.y = gameHeight - 50
        sprite.on('pointerdown', (pointer: any) => {
            this.processInput(DriverInput.Crap)
        })

        sprite = this.physics.add.sprite(0, 0, 'arrow_left').setInteractive()
        sprite.setDepth(100)
        sprite.x = gameWidth - 50 - 120
        sprite.y = gameHeight - 50
        sprite.on('pointerdown', (pointer: any) => {
            this.processInput(DriverInput.Left)
        })

        sprite = this.physics.add.sprite(0, 0, 'arrow_up').setInteractive()
        sprite.setDepth(100)
        sprite.x = gameWidth - 50 - 60
        sprite.y = gameHeight - 50 - 60
        sprite.on('pointerdown', (pointer: any) => {
            this.processInput(DriverInput.Cool)
        })
    }

    showBubble(d: DriverInput) {
        if (!this.carSprite) { return }

        let s = '', a = '';

        switch(d) {
            case DriverInput.Left:
                s = 'bubble_left'
                a = 'left'
                break
            case DriverInput.Right:
                s = 'bubble_right'
                a = 'right'
                break
            case DriverInput.Crap:
                s = 'bubble_down'
                a = 'crap'
                break
            case DriverInput.Cool:
                s = 'bubble_up'
                a = 'cool'
                break
        }

        let bubble = this.physics.add.sprite(this.carSprite.x + 10, this.carSprite.y - 10, s);
        this.scaleSprite(bubble, this.rectSize * 2)
        bubble.setOrigin(0, 1)
        bubble.setDepth(30)

        bubble.setScale(0.1)

        this.tweens.addCounter({
            from: 0.1,
            to: 1,
            duration: 300,
            onUpdate: (tween: any) => {
                let value = tween.getValue();
                bubble.setScale(value);
            }
        })

        this.tweens.addCounter({
            from: 1,
            to: 0.1,
            delay: 700,
            duration: 200,
            onUpdate: (tween: any) => {
                let value = tween.getValue();
                bubble.setScale(value);
            }
        })

        this.tweens.addCounter({
            duration: 1000,
            onUpdate: (tween: any) => {
                bubble.x = this.carSprite.x + 10
                bubble.y = this.carSprite.y -10
            }
        })

        this.time.addEvent({
            delay: 900,
            loop: false,
            callback: () => { bubble.destroy() }
        })

        let audio = this.sound.add(a)
        audio.play()
    }

    processInput(d: DriverInput) {
        console.log('LEVEL SCENE, PROCESS INPUT', d)
        // TODO: Draw bubbles here
        this.driver.input(d)
        this.showBubble(d)
    }

    update() {
        // console.log('update()')
        // this.input.on('pointerup', () => {
        //     if (!this.towergame.active()) {
        //         if (this.music) { this.music.destroy() }

        //       this.towergame = new Game(this.x, this.y, this.isVertical)
        //       this.scene.restart();
        //     }
        // });
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
        if (!this.bigCrossroads || !this.smallCrossroads || !this.carSprite) return
        this.physics.add.collider(this.bigCrossroads, this.carSprite, this.bigCrossroadHit.bind(this))
        this.physics.add.overlap(this.smallCrossroads, this.carSprite, this.smallCrossroadHit.bind(this))

        this.time.addEvent({
            delay: 16,
            loop: true,
            callback: this.moveCar,
            callbackScope: this
        })
    }

    private prevBigCrossRoad?: Phaser.GameObjects.GameObject
    private prevSmallCrossRoad?: Phaser.GameObjects.GameObject
    private currentNextStep?: Direction

    bigCrossroadHit(carSprite: Phaser.GameObjects.GameObject, crossroad: Phaser.GameObjects.GameObject) {
        if (crossroad === this.prevBigCrossRoad) return

        this.prevBigCrossRoad = crossroad;

        let angle = (<any>carSprite).angle

        this.car.speed

        let angleChange = 0;
        this.currentNextStep = this.car.getNextStep();
        switch(this.car.getNextStep()) {
            case Direction.Left:
                angleChange = -90;
                break;
            case Direction.Right:
                angleChange = 90;
                break;
        }
        this.tweens.addCounter({
            from: angle,
            to: angle + angleChange,
            delay: 400,
            duration: 600,
            onUpdate: (tween: any) => {
                let value = tween.getValue();
                (<any>carSprite).setAngle(value);
            }
        })
    }

    smallCrossroadHit(carSprite: Phaser.GameObjects.GameObject, crossroad: Phaser.GameObjects.GameObject) {
        if (crossroad === this.prevSmallCrossRoad) return

        let duration = 600

        let verticalCounter = {
            from: this.carSprite.y,
            to: crossroad.y,
            duration: duration,
            onUpdate: (tween: any) => {
                this.carSprite.y = tween.getValue();
            }
        }

        let horizontalCounter = {
            from: this.carSprite.x,
            to: crossroad.x,
            duration: duration,
            onUpdate: (tween: any) => {
                this.carSprite.x = tween.getValue();
            }
        }

        this.prevSmallCrossRoad = crossroad;
        switch (this.currentNextStep) {
            case Direction.Left:
                if (this.car.verticalSpeed > 0) {
                    this.car.verticalSpeed = 0;
                    this.car.horizontalSpeed = 1;

                    this.tweens.addCounter(verticalCounter)
                } else if (this.car.verticalSpeed < 0) {
                    this.car.verticalSpeed = 0;
                    this.car.horizontalSpeed = -1;

                    this.tweens.addCounter(verticalCounter)
                } else {
                    if (this.car.horizontalSpeed > 0) {
                        this.car.verticalSpeed = -1;
                        this.car.horizontalSpeed = 0;

                        this.tweens.addCounter(horizontalCounter)
                    } else {
                        this.car.verticalSpeed = 1;
                        this.car.horizontalSpeed = 0;

                        this.tweens.addCounter(horizontalCounter)
                    }
                }
                this.driver.input(DriverInput.Right)
                break;
            case Direction.Right:
                if (this.car.verticalSpeed > 0) {
                    this.car.verticalSpeed = 0;
                    this.car.horizontalSpeed = -1;

                    this.tweens.addCounter(verticalCounter)
                } else if (this.car.verticalSpeed < 0) {
                    this.car.verticalSpeed = 0;
                    this.car.horizontalSpeed = 1;

                    this.tweens.addCounter(verticalCounter)
                } else {
                    if (this.car.horizontalSpeed > 0) {
                        this.car.verticalSpeed = 1;
                        this.car.horizontalSpeed = 0;

                        this.tweens.addCounter(horizontalCounter)
                    } else {
                        this.car.verticalSpeed = -1;
                        this.car.horizontalSpeed = 0;

                        this.tweens.addCounter(horizontalCounter)
                    }
                }
                this.driver.input(DriverInput.Left)
                break;
            }
    }

    moveCar() {
        if (!this.car || !this.carSprite) return

        console.log('moving car')
        this.carSprite.x = this.carSprite.x + this.car.horizontalSpeed;
        this.carSprite.y = this.carSprite.y + this.car.verticalSpeed;
    }

    setupCrossRoads() {
        this.bigCrossroads = this.physics.add.group()
		for (let i = 0; i <= maxSide; i++) {
			for (let j = 0; j <= minSide; j++) {
                let crossroad = this.bigCrossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace')
                crossroad.alpha = 0
                this.scaleSprite(crossroad, this.rectSize * 2)
                if (!this.prevBigCrossRoad) {
                    this.prevBigCrossRoad = crossroad
                }
			}
		}

        this.smallCrossroads = this.physics.add.group()
		for (let i = 0; i <= maxSide; i++) {
			for (let j = 0; j <= minSide; j++) {
                let crossroad = this.smallCrossroads.create(this.offsetX + this.rectSize * (3 * i + 0.5), this.offsetY + this.rectSize * (3 * j + 0.5), 'towerplace')
                crossroad.alpha = 0
                this.scaleSprite(crossroad, this.rectSize * 0.75)
                if (!this.prevSmallCrossRoad) {
                    this.prevSmallCrossRoad = crossroad
                }
			}
		}
    }

    getX(i: number): number {
        return this.offsetX + this.rectSize * (3 * i + 0.5)
    }

    getY(i: number): number {
        return this.offsetY + this.rectSize * (3 * i + 0.5)
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }

    finishLevel() {
        window.Result = {
            stars: this.stars,
            name: this.levelInfo.name
        }
        let heroInfo: HeroSceneInfo = Object.assign({}, LevelConfig[this.levelInfo.name].heroOutro)

        if (this.stars == 0) {
            heroInfo.text = 'You finished the level! Get at least one flag to get to know your driver better.'
        }
        window.HeroSettings = heroInfo

        this.scene.stop('Level')

        this.scene.switch('hero')
    }

    preload() {
        this.load.image('car', 'images/monster.png')
        this.load.image('arrow_left', 'images/arrow_left.png')
        this.load.image('arrow_right', 'images/arrow_right.png')
        this.load.image('arrow_up', 'images/arrow_up.png')
        this.load.image('arrow_down', 'images/arrow_down.png')
        this.load.image('bubble_left', 'images/bubble_left.png')
        this.load.image('bubble_right', 'images/bubble_right.png')
        this.load.image('bubble_up', 'images/bubble_up.png')
        this.load.image('bubble_down', 'images/bubble_down.png')
        this.load.image('towerplace', 'images/towerplace.png')

        this.load.audio('left', 'sounds/left.mp3')
        this.load.audio('right', 'sounds/right.mp3')
        this.load.audio('cool', 'sounds/nice.mp3')
        this.load.audio('crap', 'sounds/crap.mp3')

        this.load.image('start', 'images/start.png')
        this.load.image('finish', 'images/finish.png')
        this.load.image('flag_ready', 'images/flag_ready.png')
        this.load.image('flag_empty', 'images/flag_empty.png')

        // this.load.audio('music', 'sounds/NavigatorOST.mp3')
    }
}
