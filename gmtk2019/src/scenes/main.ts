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

    constructor(
        sceneConfig: object
    ) {
        super({key: 'main'})

        if (gameHeight > gameWidth) {
            this.isVertical = true
            this.rectSize = gameWidth
        } else {
            this.isVertical = false
            this.rectSize = gameHeight
        }

        this.cellW = this.rectSize/5
        this.cellH = this.rectSize/5
    }

    preload() {
        this.load.image('token', 'images/token.png')
    }

    create() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})
        for (let i=0; i<5; i++) {
            for (let j=0; j<5; j++) {
                let offsetX = i*this.cellW;
                let offsetY = j*this.cellH;
                field.strokeRect(offsetX, offsetY, this.cellH, this.cellW)
            }
        }
        field.strokePath()
        this.objects = this.physics.add.group()

        this.physics.add.sprite(halfWidth, halfHeight, 'token')
    }

    getC(x: number, y: number): { x: number, y: number } {
        return {
            x: this.getCX(x),
            y: this.getCY(y)
        }
    }

    getCX(x: number): number {return (x + 0.5)*this.cellW }

    getCY(y: number): number { return (y + 0.5)*this.cellH }
}
