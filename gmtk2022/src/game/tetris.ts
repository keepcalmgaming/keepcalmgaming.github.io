import { BaseGame } from './base_game'
import { Tetramino, TGenerator } from './tetraminos'

type Adjustment = {
	shiftX: number,
	shiftY: number
}

export class Tetris extends BaseGame {
	private blocks?: Phaser.Physics.Arcade.Group

	private let scoreFullLine: number = 100
	private tx: number = 0
	private ty: number = 0
	private tname: string = 'none'

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

		this.tname = TGenerator.random()
		let tetramino: Tetramino = TGenerator.get(this.tname)
		let blocks = tetramino.b

		this.tx = Math.floor(Math.random() * (this.x - 3))
		this.ty = 0

		for (let point of blocks) {
			let pos = {x: this.tx + point[0], y: point[1]}
			let block = this.spawnBlock(pos)
			this.movingBlocks.add(block)
		}

		if (!this.canSpawn(blocks, {shiftX: 0, shiftY: 0})) {
			this.addScore(-42)
		}
	}

	private getAdjustment(blocks): Adjustment {
		let shiftX = 0
		let shiftY = 0
		for (let block of blocks) {
			if ((this.tx + block[0]) >= this.x) {
				let diff = this.x - (this.tx + block[0] + 1)
				if (diff < shiftX) {
					shiftX = diff
				}
			}
		}

		return {shiftX, shiftY}
	}

	private canSpawn(blocks, a: Adjustment): boolean {
		for (let block of blocks) {
			if (this.isPositionFull({x: this.tx + block[0] + a.shiftX, y: this.ty + block[1] + a.shiftY})) {
				return false
			}
		}
		return true
	}

	public rotate() {
		let next = TGenerator.next(this.tname)
		let nextT = TGenerator.get(next)

		if (nextT === undefined) { return }

		let adjustment = this.getAdjustment(nextT.b)
		if (true /*this.canSpawn(nextT.b, adjustment)*/) {
			this.tx += adjustment.shiftX
			this.ty += adjustment.shiftY
			this.tname = next

			this.movingBlocks.destroy(true)
			this.movingBlocks = this.physics.add.group()

			for (let point of nextT.b) {
				let pos = {x: this.tx + point[0], y: this.ty + point[1]}
				let block = this.spawnBlock(pos)
				this.movingBlocks.add(block)
			}
		} else {
			console.log('cannot rotate')
		}
	}

	public spawnStupidLine() {
		for (let block of this.blocks.getChildren()) {
			block.y = block.y - this.cellSize
			if (block.y <= (this.offsetY + this.cellSize)) {
				this.addScore(-42)
			}
		}

		for (let x = 0; x<this.x; x++) {
			if (Math.random() > 0.3) {
				let block = this.spawnBlock({x: x, y: this.y - 1})
				this.blocks.add(block)
			}
		}
	}

	public moveLeft() {
		for (let block of this.movingBlocks.getChildren()) {
			if (this.getSpritePosition(block).x <= 0) {
				return
			}

			if this.isPositionFull({x: this.getSpritePosition(block).x - 1, y: this.getSpritePosition(block).y}) {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x - this.cellSize
		}
		this.tx -= 1

		this.checkFullLines()
	}

	public moveRight() {
		for (let block of this.movingBlocks.getChildren()) {
			if (this.getSpritePosition(block).x >= this.x - 1) {
				return
			}

			let newX = ++this.getSpritePosition(block).x
			if this.isPositionFull({x: newX, y: this.getSpritePosition(block).y}) {
				return
			}
		}

		for (let block of this.movingBlocks.getChildren()) {
			block.x = block.x + this.cellSize
		}
		this.tx += 1

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
		this.ty += 1

		this.checkFullLines()
	}

	private checkFullLines() {
		for (let i = 0; i < this.y; i++) {
			let line = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y == i)
			if line.length == this.x {
				this.addScore(this.scoreFullLine)
				for (let block of line) {
					this.blocks.remove(block)
					block.destroy()
				}

				let blocksToFall = this.blocks.getChildren().filter(block => this.getSpritePosition(block).y < i)
				for (let block of blocksToFall) {
					block.y = block.y + this.cellSize
				}
			}
		}
	}

	private isBlocksAreOnTheSameLine(block1: any, block2: any) {
		return this.getSpritePosition(block1).y == this.getSpritePosition(block2).y
	}

	private isPositionFull(position: Position) {
		for (let block of this.blocks.getChildren()) {
			let blockPosition = this.getSpritePosition(block)
			// console.log(blockPosition, block, blockPosition.x)
			if ((blockPosition.x == position.x) && (blockPosition.y == position.y)) {
				return true
			}
		}

		return false
	}

	public update() {
		super.update()
	}
}