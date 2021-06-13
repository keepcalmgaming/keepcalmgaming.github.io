import { BaseGame } from './base_game'

const START_BLOCKS = [
	{x: 0, y: 1},
	{x: 0, y: 5},
	{x: 3, y: 1},
	{x: 2, y: 2},
	{x: 8, y: 2},
]


export class Arcanoid extends BaseGame {
	private ball: any
	private blocks?: Phaser.Physics.Arcade.Group

	constructor(config: any) {
		super(config)

		console.log(this)

		this.setupBall();
		this.setupWalls();
		this.setupBlocks();

		// start of most left block 
		let platformOffsetX = this.offsetX + ((this.cellSize / 2) * 9);
		let platformOffsetY = (this.offsetY + (this.cellSize * 18) - (this.cellSize / 2));

		let platform = this.physics.add.image(platformOffsetX, platformOffsetY, 'block').setImmovable();
		this.scaleSprite(platform, this.cellSize * 0.9)
		this.physics.add.collider(platform, this.ball, this.platformHit)
	    this.platform = platform

		console.log('Arcanoid', this.config)
	}

	public update() {
		super.update()
	}

	public moveLeft() {
		if this.getSpritePosition(this.platform).x <= 0 {
			return
		}

		this.platform.x -= this.cellSize;
	}

	public moveRight() {
		if this.getSpritePosition(this.platform).x > this.x - 2 {
			return
		}

		this.platform.x += this.cellSize;
	}

	public stopPlatform() {
	}

	public setupBall() {
		let cellPosition = this.getCellCenter({x: 4, y: 16})
		this.ball = this.physics.add.image(cellPosition.x, cellPosition.y, 'ball');
		this.ball.setCircle()
		this.scaleSprite(this.ball, this.cellSize / 2);
		this.ball.setCollideWorldBounds(false);
		this.ball.setBounce(1);
		this.ball.body.stopVelocityOnCollide = false;
		this.ball.setVelocity(200, -200)
	}

	private setupBlocks() {
		for (let pos of START_BLOCKS) {
			let cellPosition = this.getCellCenter(pos)
			let block = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(100).setImmovable()
			this.physics.add.collider(block, this.ball, this.onBallBlock)	
		}
	}

	private onBallBlock(block, ball) {
		console.log('ball hit')
		block.destroy()
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

	platformHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
   }

	wallHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }
}