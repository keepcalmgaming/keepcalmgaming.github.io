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

		let platform = this.physics.add.image(platformOffsetX, platformOffsetY, 'block');
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
		this.ball = this.physics.add.image(this.offsetX + 100, this.offsetY + 100, 'ball');
		this.ball.setScale(1);
		this.ball.setCollideWorldBounds(false);
		this.ball.setBounce(1);
		this.ball.body.stopVelocityOnCollide = false;
		this.ball.setVelocity(-200, -200)
	}

	public setupWalls() {
		let cellPosition = this.getCellCenter({x: -1, y: -1})
		let cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable()
		this.physics.add.collider(cell, this.ball, this.wallHit)
		for (let i = 0; i < 12; i++) {
			let cell2 = this.physics.add.image(cell.x + i * cell.height, cellPosition.y, 'block').setAlpha(0).setImmovable()
			this.physics.add.collider(cell2, this.ball, this.wallHit)	
		}

		for (let i = 0; i < 22; i++) {
			let cell2 = this.physics.add.image(cell.x, cellPosition.y + i * cell.height, 'block').setAlpha(0).setImmovable()
			this.physics.add.collider(cell2, this.ball, this.wallHit)
		}

		cellPosition = this.getCellCenter({x: 10, y: -1})
		cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable()
		this.physics.add.collider(cell, this.ball, this.wallHit)
		for (let i = 0; i < 22; i++) {
			let cell2 = this.physics.add.image(cell.x, cellPosition.y + i * cell.height, 'block').setAlpha(0).setImmovable()
			this.physics.add.collider(cell2, this.ball, this.wallHit)
		}

		cellPosition = this.getCellCenter({x: -1, y: 18})
		cell = this.physics.add.image(cellPosition.x, cellPosition.y, 'block').setAlpha(0).setImmovable()
		this.physics.add.collider(cell, this.ball, this.wallHit)
		for (let i = 0; i < 12; i++) {
			let cell2 = this.physics.add.image(cell.x + i * cell.height, cellPosition.y, 'block').setAlpha(0).setImmovable()
			this.physics.add.collider(cell2, this.ball, this.wallHit)	
		}
	}

	wallHit(cell: Phaser.GameObjects.GameObject, ball: Phaser.GameObjects.GameObject) {
    }
}