import { Game } from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
const minSide = 10

const spawnsCount = 3

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

        console.log('constructor finished', this.x, this.y, this.towergame)
    }

    preload() {
        this.load.image('token', 'images/token.png')
    }

    debugDrawGrid() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})
        
        for (let i=0; i<this.x; i++) {
            for (let j=0; j<this.y; j++) {
                field.strokeRect(this.getCX(i), this.getCY(j), this.cellW, this.cellH)
            }
        }
    }

    setSpawns() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0xffffff }})
        for(let i = 0; i < spawnsCount; i++) {
            field.fillRect(this.getCX(this.towergame.getRandNum(this.x)), this.getCY(this.towergame.getRandNum(this.y)), this.cellW, this.cellH); 
        }
    }

    private mainframe: Phaser.GameObjects.Sprite

    create() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.setupMainframe()

        if (debug) {
            this.debugDrawGrid()
            this.setSpawns()
        }
    }

    setupMainframe() {
        this.mainframe = this.physics.add.sprite(halfWidth, halfHeight, 'token')

        this.scaleSpriteTo(this.mainframe, this.rectSize*2)
        this.mainframe.setOrigin(0)

        let position = this.getC(this.mainframeCoords())
        this.mainframe.x = position.x
        this.mainframe.y = position.y

        console.log(this.mainframe)
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
