import { BaseGame } from './base_game'

export class Tetris extends BaseGame {
	constructor(config: any) {
		super(config)
		console.log('Tetris', this.config)
	}

	public update() {
		super.update()
	}
}