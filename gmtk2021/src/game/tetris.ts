import { BaseGame } from './base_game'

export class Tetris extends BaseGame {
	private blocks?: Phaser.Physics.Arcade.Group

	constructor(config: any) {
		super(config)
		this.blocks = this.physics.add.group()
		this.movingBlocks = this.physics.add.group()
		console.log('Tetris', this.config)

		this.spawnFigure()
	}

	private spawnFigure() {
		let point = this.getCellCenter({x: Math.floor(Math.random() * this.x), y: 0})

		let block = this.physics.add.image(point.x, point.y, 'block')
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)

		this.blocks.add(block)
		this.movingBlocks.add(block)
	}

	private moveDown() {
		// Check if can move. If not - stop, check, spawn next

		for (let block of this.movingBlocks.getChildren()) {
			block.y = block.y + this.cellSize
		}
	}

	public update() {
		super.update()
	}
}