import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	private ball: any

	constructor(config: any) {
		super(config)

		console.log(this)

		this.setupBall();
		this.setupWalls();

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
		this.scaleSprite(this.ball, this.cellSize / 2);
		this.ball.setCollideWorldBounds(false);
		this.ball.setBounce(1);
		this.ball.body.stopVelocityOnCollide = false;
		this.ball.setVelocity(200, -200)
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