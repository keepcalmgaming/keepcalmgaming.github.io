export class BaseGame {
	protected config: any

	protected x: number
	protected y: number
	protected cellSize: number
	protected offsetX: number
	protected offsetY: number
	protected physics: any
	protected rectangle: any

	constructor(config: any) {
		this.config = config
		this.x = this.config.x
		this.y = this.config.y
		this.cellSize = this.config.cellSize
		this.offsetX = this.config.offsetX
		this.offsetY = this.config.offsetY
		this.physics = this.config.physics
		this.rectangle = this.config.rectangle

		console.log(this.config)

		this.setupBackgroundCells()
		this.setupRectangle()
	}

	public update() {
		
	}

	private setupBackgroundCells() {
		let startOffset = this.cellSize

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                let cell = this.physics.add.image(0, 0, 'cell')
                cell.x = this.offsetX + startOffset + this.cellSize * i
                cell.y = this.offsetY + startOffset + this.cellSize * j
                cell.setOrigin(0.5)
                this.scaleSprite(cell, this.cellSize * 0.9)
            }
        }
    }

    private setupRectangle() {
    	console.log('create rectangle')
    	
        // for (let i=0; i<this.x; i++) {
        //     for (let j=0; j<this.y; j++) {
        //         this.rectangle.strokeRect(i*10, j*10, this.cellSize, this.cellSize)
        //     }
        // }

        this.rectangle.strokeRect(this.offsetX + this.cellSize / 4, this.offsetY + this.cellSize / 4, 
        	this.cellSize * (this.x + 1) - this.cellSize / 2, this.cellSize * (this.y + 1) - this.cellSize / 2)

    }

	private getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
		return dim / sprite.width
	}

	private scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
		sprite.setScale(this.getScale(sprite, dim))
	}
}