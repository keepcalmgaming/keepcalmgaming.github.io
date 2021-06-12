import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	private ball: any

	constructor(config: any) {
		super(config)

		console.log(this)

		let ball = this.physics.add.image(this.offsetX, this.offsetY, 'ball');

		// start of most left block 
		let platformOffsetX = this.offsetX + ((this.cellSize / 2) * 9);
		let platformOffsetY = (this.offsetY + (this.cellSize * 18) - (this.cellSize / 2));

		let platform = this.physics.add.image(platformOffsetX, platformOffsetY, 'block');
    ball.setScale(0.3);
    ball.setCircle(120);
    ball.setCollideWorldBounds(false);
    ball.setBounce(0.1);
    ball.body.stopVelocityOnCollide = false;
    ball.setMass(2);

    this.ball = ball
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
}