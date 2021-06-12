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
	}

	public update() {

	}

	private getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
		return dim / sprite.width
	}

	private scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
		sprite.setScale(this.getScale(sprite, dim))
	}
}