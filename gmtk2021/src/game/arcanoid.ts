import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	private ball: any

	constructor(config: any) {
		super(config)

		console.log(this)

		let ball = this.physics.add.image(this.offsetX, this.offsetY, 'ball');
    ball.setScale(0.3);
    ball.setCircle(120);
    ball.setCollideWorldBounds(false);
    ball.setBounce(0.1);
    ball.body.stopVelocityOnCollide = false;
    ball.setMass(2);

    this.ball = ball

		console.log('Arcanoid', this.config)
	}

	public update() {
		super.update()
	}
}