export class BaseGame {
	protected config: any

	protected x: number
	protected y: number
	protected cellSize: number
	protected offsetX: number
	protected offsetY: number
	protected physics: any

	constructor(config: any) {
		this.config = config
		this.x = this.config.x
		this.y = this.config.y
		this.cellSize = this.config.cellSize
		this.offsetX = this.config.offsetX
		this.offsetY = this.config.offsetY
		this.physics = this.config.physics

		this.setupBackgroundCells()
	}

	public update() {
		
	}

	private setupBackgroundCells() {
		console.log('create background cells', this.x, this.y, this.cellSize)

		let startOffset = this.cellSize * 2

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                let cell = this.physics.add.image(0, 0, 'cell')
                cell.x = this.offsetX + startOffset + this.cellSize * i
                cell.y = startOffset + this.cellSize * j
                cell.setOrigin(0.5)
                this.scaleSprite(cell, this.cellSize * 0.9)
            }
        }
    }

	private getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
		return dim / sprite.width
	}

	private scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
		sprite.setScale(this.getScale(sprite, dim))
	}
}