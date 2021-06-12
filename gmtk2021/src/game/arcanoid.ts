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

		let platform = this.physics.add.image(platformOffsetX, platformOffsetY, 'cell_full');
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
		this.platform.x -= this.cellSize;
		console.log('left')
	}

	public moveRight() {
		this.platform.x += this.cellSize;
		console.log('right');
	}

	public stopPlatform() {
		console.log('stop');
	}
}