const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
const minSide = 10
const maxSide = 16

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

    private rectSize: number
    private offsetX: number = 0
    private offsetY: number = 0
    private x: number
    private y: number

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

        this.isVertical = gameHeight > gameWidth

        if (this.isVertical) {
            this.x = minSide
            this.y = maxSide
        } else {
            this.x = maxSide
            this.y = minSide
        }

        let rw = gameWidth / this.x, rh = gameHeight / this.y
        this.rectSize = rh < rw ? rh : rw
        this.offsetX = (gameWidth - this.rectSize * this.x) / 2
        this.offsetY = (gameHeight - this.rectSize * this.y) / 2

        // this.towergame = new Game(this.x, this.y, this.isVertical)

        console.log('Game Created', this.x, this.y, this.towergame)
    }

    private music?: Phaser.Sound.BaseSound

    create() {
        this.cameras.main.setBackgroundColor('#E8745A');

        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.setupText()

        this.setupEvents()

        // this.music = this.sound.add('music')
        // this.music.play()

        if (debug) {
            this.debugDrawGrid()
        }
    }

    update() {
        // this.input.on('pointerup', () => {
        //     if (!this.towergame.active()) {
        //         if (this.music) { this.music.destroy() }

        //       this.towergame = new Game(this.x, this.y, this.isVertical)
        //       this.scene.restart();
        //     }
        // });
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
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 }})

        for (let i=0; i<this.x; i++) {
            for (let j=0; j<this.y; j++) {
                field.strokeRect(i*10, j*10, this.rectSize, this.rectSize)
            }
        }
    }
}
