import { Game } from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = false
const minSide = 10

type Cell = {
    x: number,
    y: number
}

type Position = {
    x: number,
    y: number
}

export class MainScene extends Phaser.Scene {
    private rectSize: number
    private cellH: number
    private cellW: number
    private x: number
    private y: number

    public towergame: Game


    private mfGroup?: Phaser.Physics.Arcade.StaticGroup
    private mainframe?: Phaser.GameObjects.Sprite
    private tower?: Phaser.GameObjects.Sprite
    private towerSpawns: Phaser.GameObjects.Sprite[] = []
    private monsterSpawns: Phaser.GameObjects.Sprite[] = []

    private monsters?: Phaser.Physics.Arcade.Group
    private bullets?: Phaser.Physics.Arcade.Group

    public textLives?: Phaser.GameObjects.Text

    constructor(
        sceneConfig: object
    ) {
        // super({key: 'main'})
        super(sceneConfig)

        let biggerSide = gameHeight > gameWidth ? gameWidth : gameHeight
        this.rectSize = biggerSide / minSide
        if (biggerSide == gameWidth) {
            this.x = minSide
            this.y = Math.floor(gameHeight / this.rectSize)
        } else {
            this.x = Math.floor(gameWidth / this.rectSize)
            this.y = minSide
        }

        this.cellW = gameWidth / this.x
        this.cellH = gameHeight / this.y

        this.towergame = new Game(this.x, this.y)

        console.log('Game Created', this.x, this.y, this.towergame)
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.setupMainframe()

        this.setupTowerSpawns()
        this.setupTower()

        this.setupMonsterSpawns()

        this.setupText()

        this.setupEvents()

        if (debug) {
            this.debugDrawGrid()
        }
    }

    setupMainframe() {
        this.mfGroup = this.physics.add.staticGroup()
        this.mainframe = this.mfGroup.create(0, 0, 'mainframe') as Phaser.GameObjects.Sprite
        this.scaleSprite(this.mainframe, this.rectSize*2)

        this.mainframe.setOrigin(0)

        let position = this.getC(this.towergame.mainframe)
        this.mainframe.x = position.x
        this.mainframe.y = position.y

        this.mainframe.refreshBody()
    }

    setupTower() {
        this.tower = this.physics.add.sprite(0, 0, 'tower')
        this.scaleSprite(this.tower, this.rectSize)

        this.tower.setOrigin(0)

        let coord = this.towergame.towerSpawns ? this.towergame.towerSpawns[0] : { x: 0, y: 0 }

        let position = this.getC(coord)
        this.tower.x = position.x
        this.tower.y = position.y
    }

    setupTowerSpawns() {
        this.towerSpawns = []

        for (let i=0; i<this.towergame.towerSpawns.length; i++) {
            let towerSpawn = this.towergame.towerSpawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive()
            this.scaleSprite(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(towerSpawn)
            sprite.x = position.x
            sprite.y = position.y

            sprite.on('pointerdown', (pointer: any) => {
                if (!this.tower) return

                this.tower.x = sprite.x
                this.tower.y = sprite.y
            })

            this.towerSpawns.push(sprite)
        }
    }

    setupMonsterSpawns() {
        this.monsterSpawns = []

        for (let i=0; i<this.towergame.spawns.length; i++) {
            let spawn = this.towergame.spawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
            this.scaleSprite(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(spawn)
            sprite.x = position.x
            sprite.y = position.y

            this.monsterSpawns.push(sprite)
        }
    }

    setupEvents() {
        if (!this.mainframe || !this.mfGroup) return

        this.monsters = this.physics.add.group()
        this.physics.add.collider(this.monsters, this.mfGroup, this.mainframeHit)

        // MONSTER SPAWNS
        for (let monsterSpawn of this.monsterSpawns) {
            this.time.addEvent({
                delay: 3000,
                loop: true,
                callback: this.createMonster,
                callbackScope: this,
                args: [ monsterSpawn ]
            })
        }
    }

    mainframeHit(monster: Phaser.GameObjects.GameObject, mainframe: Phaser.GameObjects.GameObject) {
        console.log('mf hit')
        monster.destroy()

        let scene = mainframe['scene'] as MainScene
        scene.towergame.lives--

        if (!scene.textLives) return
        if (scene.towergame.lives > 0) {
            scene.textLives.setText(`LIVES: ${scene.towergame.lives}`)
        } else {
            scene.textLives.setText('YOU DIED')
        }
    }

    createMonster(spawn: Phaser.GameObjects.Sprite) {
        if (!this.monsters) return;

        let monster = this.monsters.create(0, 0, 'monster')
        this.scaleSprite(monster, this.rectSize)
        monster.setOrigin(0)

        monster.x = spawn.x
        monster.y = spawn.y

        let mfc = this.getMFC()
        this.physics.moveTo(monster, mfc.x, mfc.y, 50)
    }

    setupText() {
        this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        let scale = dim / sprite.width
        sprite.setScale(scale)
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

    getCX(x: number): number { return x*this.cellW }

    getCY(y: number): number { return y*this.cellH }


    preload() {
        this.load.image('bullet', 'images/bullet.png')
        this.load.image('mainframe', 'images/mainframe.png')
        this.load.image('monster', 'images/monster.png')
        this.load.image('monsterplace', 'images/monsterplace.png')
        this.load.image('tower', 'images/tower.png')
        this.load.image('towerplace', 'images/towerplace.png')
    }

    debugDrawGrid() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        for (let i=0; i<this.x; i++) {
            for (let j=0; j<this.y; j++) {
                field.strokeRect(this.getCX(i), this.getCY(j), this.cellW, this.cellH)
            }
        }
    }
}
