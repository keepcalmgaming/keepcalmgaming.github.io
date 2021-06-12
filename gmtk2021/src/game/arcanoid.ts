import { BaseGame } from './base_game'

export class Arcanoid extends BaseGame {
	constructor(config) {
		super(config)
		console.log('Arcanoid', this.config)
	}

	public update() {
		super.update()
	}
}