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

	public moveLeft() {
		for (let block of this.movingBlocks.getChildren()) {
			if this.getSpritePosition(block).x <= 0 {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x - this.cellSize
		}
	}

	public moveRight() {
		for (let block of this.movingBlocks.getChildren()) {
			if this.getSpritePosition(block).x >= this.x - 1 {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x + this.cellSize
		}
	}

	public moveDown() {
		// TODO: Check if can move. If not - stop, check, spawn next
		for (let block of this.movingBlocks.getChildren()) {
			if this.getSpritePosition(block).y >= this.y - 1 {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.y = block.y + this.cellSize
		}

		this.checkCollisions()
	}

	private checkCollisions() {
		console.log()
		for (let block of this.movingBlocks.getChildren()) {
			console.log(this.getSpritePosition(block))
		}
	}

	public update() {
		super.update()
	}
}