import { Game } from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
const minSide = 10

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
                let offsetX = i*this.cellW;
                let offsetY = j*this.cellH;
                field.strokeRect(offsetX, offsetY, this.cellH, this.cellW)
            }
        }
    }

    create() {
        console.log('hello', this.x, this.y, this.towergame)

        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.physics.add.sprite(halfWidth, halfHeight, 'token')

        if (debug) {
            this.debugDrawGrid()
        }
    }
}
