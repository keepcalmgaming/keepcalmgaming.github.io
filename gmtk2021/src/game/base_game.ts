export class BaseGame {
	protected config: any

	protected x: number
	protected y: number
	protected cellSize: number
	protected offsetX: number
	protected offsetY: number
	protected physics: any
	protected rectangle: any
	protected addScore: function

	constructor(config: any) {
		this.config = config
		this.x = this.config.x
		this.y = this.config.y
		this.cellSize = this.config.cellSize
		this.offsetX = this.config.offsetX
		this.offsetY = this.config.offsetY
		this.physics = this.config.physics
		this.rectangle = this.config.rectangle
		this.addScore = this.config.addScore

		console.log(this.config)

		this.setupBackgroundCells()
		this.setupRectangle()
	}

	public update() {
		
	}

	private setupBackgroundCells() {
		let startOffset = 0

        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                let cell = this.physics.add.image(0, 0, 'cell')
                cell.x = this.offsetX + this.cellSize / 2 + startOffset + this.cellSize * i
                cell.y = this.offsetY + this.cellSize / 2 + startOffset + this.cellSize * j
                cell.setOrigin(0.5)
                this.scaleSprite(cell, this.cellSize * 0.9)
            }
        }
    }

    private setupRectangle() {
    	this.rectangle.strokeRect(this.offsetX - this.cellSize / 4, this.offsetY - this.cellSize / 4, 
        	this.cellSize * (this.x + 1) - this.cellSize / 2, this.cellSize * (this.y + 1) - this.cellSize / 2)
    }

	private getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
		return dim / sprite.width
	}

	private scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
		sprite.setScale(this.getScale(sprite, dim))
	}

	public getCellCenter(position: Position) {
		let x = this.offsetX + this.cellSize / 2 + this.cellSize * position.x
		let y = this.offsetY + this.cellSize / 2 + this.cellSize * position.y
		return {x: x, y: y}
	}

	public getSpritePosition(sprite: Sprite) {
		let positionX = (sprite.x - this.offsetX - this.cellSize / 2) / this.cellSize
		let positionY = (sprite.y - this.offsetY - this.cellSize / 2) / this.cellSize
		let x = positionX.toFixed()
		let y = positionY.toFixed()
		return {x: x, y: y}
	}
}