import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	private ball: any
	private blocks
	private platform: any
	private isBallMoving = false

	private leftVerticalWall: any
	private rightVerticalWall: any

	private topHorizontalWall: any
	private bottomHorizontalWall: any

	private platformPosition: number = 3

	constructor(config: any) {
		super(config)

		console.log(this)
	    this.bullets = []
		this.setupPlatform()
		this.setupBlocks();
		this.setupWalls();
		this.setupBall(3, 16);

		console.log('Arcanoid', this.config)
	}

	public update() {
		super.update()
	}

	public moveLeft() {
		if (this.platformPosition < 2) {
			return
		}

		if (!this.isBallMoving) {
			this.ball.x -= this.cellSize
		}

		this.platformPosition--;
		this.platform.x -= this.cellSize;
	}

	public moveRight() {
		if (this.platformPosition > 6) {
			return
		}

		if (!this.isBallMoving) {
			this.ball.x += this.cellSize
		}

		this.platformPosition++;
		this.platform.x += this.cellSize;
	}

	public fire() {
		if (!this.isBallMoving) {
			this.ball.setVelocity(this.cellSize * 5, -(this.cellSize * 5))
			this.ball.setMaxVelocity(this.ball.body.velocity.x * 2, -(this.ball.body.velocity.y * 2))
			this.isBallMoving = true;
		}

    let leftBulletCellPosition = this.getCellCenter({x: this.platformPosition - 1, y: 17})
		let leftBullet = this.physics.add.image(leftBulletCellPosition.x, leftBulletCellPosition.y, 'bullet')

    let rightBulletCellPosition = this.getCellCenter({x: this.platformPosition + 2, y: 17})
		let rightBullet = this.physics.add.image(rightBulletCellPosition.x, rightBulletCellPosition.y, 'bullet')

		for (let block of this.blocks) {
			this.physics.add.collider(block, leftBullet, this.onBulletBlock, null, this)
			this.physics.add.collider(block, rightBullet, this.onBulletBlock, null, this)
		}

		this.bullets.push(leftBullet, rightBullet)

	}

	public moveBullet() {
		let firstRowY = this.getCellCenter({x: this.platformPosition, y: 1})
		for(let bullet of this.bullets) {
			if(bullet.y > firstRowY.y) {
        bullet.y -= this.cellSize
			} else {
				bullet.destroy()
			}
		}
	}

	public setupPlatform() {
		let cellPosition = this.getCellCenter({x: this.platformPosition, y: 17})
		let platform = this.physics.add.image(cellPosition.x + this.cellSize / 2, cellPosition.y, 'platform').setImmovable();
		this.scaleSprite(platform, 4 * this.cellSize)
	  this.platform = platform
	}

	public setupBall(x: number, y: number) {
		let cellPosition = this.getCellCenter({x, y})
		this.ball = this.physics.add.image(cellPosition.x, cellPosition.y, 'ball');
		this.ball.setCircle()
		this.ball.setOrigin(0.5)
		this.scaleSprite(this.ball, this.cellSize / 2);
		this.ball.setCollideWorldBounds(false);
		this.ball.setBounce(1);
		this.ball.body.stopVelocityOnCollide = false;

		this.physics.add.collider(this.platform, this.ball, this.platformHit)
		this.physics.add.overlap(this.platform, this.ball, this.platformOverlap.bind(this))

		this.physics.add.collider(this.leftVerticalWall, this.ball, this.wallHit)	
		this.physics.add.collider(this.rightVerticalWall, this.ball, this.wallHit)	

		this.physics.add.collider(this.topHorizontalWall, this.ball, this.wallHit)	
		this.physics.add.collider(this.bottomHorizontalWall, this.ball, this.floorHit.bind(this))	

		for (let block of this.blocks) {
			this.physics.add.collider(block, this.ball, this.onBallBlock, null, this)
		}

		this.ball.setVelocity(0, 0)
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

	private onBulletBlock(block, bullet) {
		console.log('bullet hit')
		this.addScore(10)
		//js delete from array
		let i = this.blocks.indexOf(block)
		this.blocks.splice(i, 1)
		block.destroy()
		bullet.destroy()
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
		this.topHorizontalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(this.topHorizontalWall, this.cellSize * 12)

		cellPosition = this.getCellCenter({x: 5, y: 18})
		this.bottomHorizontalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'horizontal_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(this.bottomHorizontalWall, this.cellSize * 12)
	}
	
	public setupVerticalWalls(alpha: number) {
		let cellPosition = this.getCellCenter({x: -1, y: 9})
		this.leftVerticalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(this.leftVerticalWall, this.cellSize)

		cellPosition = this.getCellCenter({x: 10, y: 9})
		this.rightVerticalWall = this.physics.add.image(cellPosition.x, cellPosition.y, 'vertical_wall').setAlpha(alpha).setImmovable()
		this.scaleSprite(this.rightVerticalWall, this.cellSize)
	}
	
	platformOverlap(platform: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
		if (ball.body.velocity.y > 0) {
			ball.y = (this.getCellCenter({x: 0, y: 16}).y + ball.y) / 2
			ball.body.velocity.x *= -1
			ball.body.velocity.y *= -1
		}
    }

	floorHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
		this.addScore(-84)

		this.isBallMoving = false;
		ball.destroy()
		this.setupBall(this.platformPosition, 16)
    }

	platformHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }

	wallHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }
}