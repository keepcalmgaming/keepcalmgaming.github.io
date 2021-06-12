import { BaseGame } from './base_game'

const TETRAMINOS = [
	[[0, 0], [0, 1], [0, 2], [0, 3]], // palka
	[[0, 0], [1, 0], [2, 0], [1, 1]], //T
	[[0, 0], [0, 1], [1, 1], [1, 2]], //Z
	[[1, 0], [1, 1], [0, 1], [0, 2]] //J
]

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
		for (let block of this.movingBlocks.getChildren()) {
			this.blocks.add(block)
		}
		this.movingBlocks.clear()

		let tetramino = TETRAMINOS[Math.floor(Math.random() * TETRAMINOS.length)]
		let startX = Math.floor(Math.random() * (this.x - 2))

		for (let point of tetramino) {
			let coords = this.getCellCenter({x: startX + point[0], y: point[1]})

			let block = this.physics.add.image(coords.x, coords.y, 'block')
			block.setOrigin(0.5)
			this.scaleSprite(block, this.cellSize * 0.9)
			this.movingBlocks.add(block)
		}
	}

	public moveLeft() {
		for (let block of this.movingBlocks.getChildren()) {
			if (this.getSpritePosition(block).x <= 0) {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x - this.cellSize
		}

		this.checkFullLines()
	}

	public moveRight() {
		for (let block of this.movingBlocks.getChildren()) {
			if (this.getSpritePosition(block).x >= this.x - 1) {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x + this.cellSize
		}

		this.checkFullLines()
	}

	public moveDown() {
		// TODO: Check if can move. If not - stop, check, spawn next
		for (let block of this.movingBlocks.getChildren()) {
			let blockX = this.getSpritePosition(block).x
			let blockY = this.getSpritePosition(block).y
			if blockY >= this.y - 1 {
				this.spawnFigure()
				return
			}

			for (let staticBlock of this.blocks.getChildren()) {
				if blockY >= this.getSpritePosition(staticBlock).y - 1 && blockX == this.getSpritePosition(staticBlock).x {
					this.spawnFigure()
					return
				}
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.y = block.y + this.cellSize
		}

		this.checkFullLines()
	}

	private checkFullLines() {
		var shouldFallDown = false

		for (let i = 0; i < this.y; i++) {
			let line = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y == i)
			if line.length == this.x {
				shouldFallDown = true
				for (let block of line) {
					// this.blocks.remove(block)
					block.destroy()
				}
			}
		}

		if shouldFallDown {
			for (let block of this.blocks.getChildren()) {
				let blockY = this.getSpritePosition(block).y
				if blockY < this.y - 1 {
					block.y = block.y + this.cellSize
				}
			}
		}
	}

	public update() {
		super.update()
	}
}