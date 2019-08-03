import { Game } from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
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
    // private isVertical: boolean
    private rectSize: number
    private cellH: number
    private cellW: number
    private x: number
    private y: number

    private objects: any

    private towergame: Game

    constructor(
        sceneConfig: object
    ) {
        // super({key: 'main'})
        super(sceneConfig)

        console.log('starting constructor')

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

    debugDrawSpawns() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0xffffff }})
        for(let i = 0; i < this.towergame.spawns.length; i++) {
            let spawn = this.towergame.spawns[i]
            field.fillRect(this.getCX(spawn.x), this.getCY(spawn.y), this.cellW, this.cellH);
        }
    }

    private mainframe?: Phaser.GameObjects.Sprite
    private tower?: Phaser.GameObjects.Sprite
    private towerSpawns?: Phaser.GameObjects.Sprite[]

    create() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.setupMainframe()

        this.setupTowerSpawns()
        this.setupTower()

        this.drawSpawns()

        if (debug) {
            this.debugDrawGrid()
            // this.debugDrawSpawns()
        }
    }

    setupMainframe() {
        this.mainframe = this.physics.add.sprite(0, 0, 'mainframe')
        this.scaleSpriteTo(this.mainframe, this.rectSize*2)

        this.mainframe.setOrigin(0)

        let position = this.getC(this.mainframeCoords())
        this.mainframe.x = position.x
        this.mainframe.y = position.y
    }

    setupTower() {
        this.tower = this.physics.add.sprite(0, 0, 'tower')
        this.scaleSpriteTo(this.tower, this.rectSize)

        this.tower.setOrigin(0)

        let position = this.getC({x: 1, y: 2})
        this.tower.x = position.x
        this.tower.y = position.y
    }

    setupTowerSpawns() {
        this.towerSpawns = []

        for (let i=0; i<this.towergame.towerSpawns.length; i++) {
            let towerSpawn = this.towergame.towerSpawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'towerplace')
            this.scaleSpriteTo(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(towerSpawn)
            sprite.x = position.x
            sprite.y = position.y

            this.towerSpawns.push(sprite)
        }
    }

    drawSpawns() {
        for (let i=0; i<this.towergame.spawns.length; i++) {
            let spawn = this.towergame.spawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
            this.scaleSpriteTo(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(spawn)
            sprite.x = position.x
            sprite.y = position.y
        }
    }

    mainframeCoords(): Cell {
        return {
            x: Math.floor(this.x / 2) - 1,
            y: Math.floor(this.y / 2) - 1
        }
    }

    scaleSpriteTo(sprite: Phaser.GameObjects.Sprite, dim: number) {
        let scale = dim / sprite.width
        sprite.setScale(scale)
    }

    getC(c: Cell): Position {
        return {
            x: this.getCX(c.x),
            y: this.getCY(c.y)
        }
    }

    getCX(x: number): number {return (x)*this.cellW }

    getCY(y: number): number { return (y)*this.cellH }
}
