import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	private ball: any
	private blocks
	private platform: any

	private platformPosition: number = 3

	constructor(config: any) {
		super(config)

		console.log(this)

		this.setupBall();
		this.setupPlatform()
		this.setupWalls();
		this.setupBlocks();

		console.log('Arcanoid', this.config)
	}

	public update() {
		super.update()
	}

	public moveLeft() {
		if (this.platformPosition < 2) {
			return
		}

		this.platformPosition--;
		this.platform.x -= this.cellSize;
	}

	public moveRight() {
		if (this.platformPosition > 6) {
			return
		}

		this.platformPosition++;
		this.platform.x += this.cellSize;
	}

	public setupPlatform() {
		let cellPosition = this.getCellCenter({x: this.platformPosition, y: 17})
		let platform = this.physics.add.image(cellPosition.x + this.cellSize / 2, cellPosition.y, 'platform').setImmovable();
		this.scaleSprite(platform, 4 * this.cellSize)
		this.physics.add.collider(platform, this.ball, this.platformHit)
		this.physics.add.overlap(platform, this.ball, this.platformOverlap.bind(this))
	    this.platform = platform
	}

	public setupBall() {
		let cellPosition = this.getCellCenter({x: 4, y: 16})
		this.ball = this.physics.add.image(cellPosition.x, cellPosition.y, 'ball');
		this.ball.setCircle()
		this.scaleSprite(this.ball, this.cellSize / 2);
		this.ball.setCollideWorldBounds(false);
		this.ball.setBounce(1);
		this.ball.body.stopVelocityOnCollide = false;
		this.ball.setVelocity(this.cellSize * 5, -(this.cellSize * 5))

		this.ball.setMaxVelocity(this.ball.body.velocity.x * 2, -(this.ball.body.velocity.y * 2))
	}

	public speedUp() {
		this.ball.setVelocity(this.ball.body.velocity.x * 2, this.ball.body.velocity.y * 2)	
	}

	public slowDown() {
	  this.ball.setVelocity(this.ball.body.velocity.x / 2, this.ball.body.velocity.y / 2)	
	}

	private createBlock(pos) {
		let cellPosition = this.getCellCenter(pos)
		let block = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(100).setImmovable()
		this.scaleSprite(block, this.cellSize * 0.9)
		this.physics.add.collider(block, this.ball, this.onBallBlock, null, this)	
		this.blocks.push(block)
	}

	private setupBlocks() {
		this.blocks = []
		const FULL_LINES = 5
		for (let x = 0; x < this.x; x++) {
			for (let y = 0; y < FULL_LINES; y++) {
				this.createBlock({x: x, y: y})
			}
		}
	}

	private onBallBlock(block, ball) {
		console.log('ball hit')
		this.addScore(10)
		//js delete from array
		let i = this.blocks.indexOf(block)
		this.blocks.splice(i, 1)
		block.destroy()
	}

	public spawnLine() {
		for (let block of this.blocks) {
			block.y = block.y + this.cellSize
			if (block.y >= (this.offsetY + (this.y-1)*this.cellSize) {
				this.addScore(-42)
			}
		}

		for (let x = 0; x < this.x; x++) {
			this.createBlock({x: x, y: 0})
		}
	}

	public setupWalls() {
		let alpha = 0

		this.setupHorizontalWalls(alpha)
		this.setupVerticalWalls(alpha)
	}

	public setupHorizontalWalls(alpha: number) {
		let cellPosition = this.getCellCenter({x: 5, y: -1})
		let wall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(wall, this.cellSize * 12)
		this.physics.add.collider(wall, this.ball, this.wallHit)	

		cellPosition = this.getCellCenter({x: 5, y: 18})
		wall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(wall, this.cellSize * 12)
		this.physics.add.collider(wall, this.ball, this.wallHit)	
	}
	
	public setupVerticalWalls(alpha: number) {
		let cellPosition = this.getCellCenter({x: -1, y: 9})
		let wall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(wall, this.cellSize)
		this.physics.add.collider(wall, this.ball, this.wallHit)	

		cellPosition = this.getCellCenter({x: 10, y: 9})
		wall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(wall, this.cellSize)
		this.physics.add.collider(wall, this.ball, this.wallHit)	

	}
	
	platformOverlap(platform: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
		if (ball.body.velocity.y > 0) {
			ball.y = (this.getCellCenter({x: 0, y: 16}).y + ball.y) / 2
			ball.body.velocity.x *= -1
			ball.body.velocity.y *= -1
		}
    }

	platformHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }

	wallHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }
}