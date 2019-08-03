import Game from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

export class MainScene extends Phaser.Scene {
    private isVertical: boolean
    private rectSize: number
    private cellH: number
    private cellW: number

    private objects: any

    private game: Game

    constructor(
        sceneConfig: object
    ) {
        super({key: 'main'})
        this.game = new Game(10, 10)
    }

    preload() {
        this.load.image('token', 'images/token.png')
    }

    create() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.physics.add.sprite(halfWidth, halfHeight, 'token')
    }
}
