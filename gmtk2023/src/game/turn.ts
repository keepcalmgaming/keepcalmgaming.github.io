import { BaseGame } from './base_game'

export class Turn extends BaseGame {

	private turnSprite?: Phaser.GameObjects.Sprite
	private turnGroup?: Phaser.Physics.Arcade.Group

	private onTurnClicked: function

	constructor(config: any) {
		super(config)
		this.turnGroup = this.physics.add.group()
		console.log('Turn', this.config)
		this.onTurnClicked = this.config.onTurnClicked

		let pos = {x: 9, y: 6}
		this.spawnTurn(pos)
		this.hide()
	}

	private spawnTurn(pos) {
		this.turnSprite = this.spawnTurnBlock(pos)
		this.turnGroup.add(this.turnSprite)
	}


	private spawnTurnBlock(pos): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let turnTexture = 'turn'
		let block = this.physics.add.image(coords.x, coords.y, turnTexture).setInteractive()
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)

        block.on('pointerdown', (pointer: any) => {
        	this.onTurnClicked()
        })

		return block
	}

	public hide() {
		this.turnSprite.visible = false
	}

	public show() {
		this.turnSprite.visible = true
	}
}