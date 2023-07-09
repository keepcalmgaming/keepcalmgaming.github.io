import { BaseGame } from './base_game'

export class Card extends BaseGame {

	private hidden: false
	private cardType: ''
	private player: false
	protected onCardPlayed: function

	private cardSprite?: Phaser.GameObjects.Sprite
	private cardGroup?: Phaser.Physics.Arcade.Group

	constructor(config: any) {
		super(config)
		this.cardGroup = this.physics.add.group()
		console.log('Card', this.config)

		let pos = {x: this.config.cellX, y: this.config.cellY}
		this.hidden = this.config.hidden
		this.cardType = this.config.cardType
		this.player = this.config.player
		this.onCardPlayed = this.config.onCardPlayed

		this.spawnCard(pos)
	}

	private spawnCard(pos) {
		this.cardSprite = this.spawnCardBlock(pos)
		this.cardGroup.add(this.cardSprite)
	}

	public moveLeft() {
		let position = this.getSpritePosition(this.cardSprite)
		let step = 1
		let newPosition = {x: +position.x - step, y: position.y}

		if (this.isPositionFull(newPosition)) {
			return
		}
		
		if (this.cardSprite.x > 0) {
			this.cardSprite.x = this.cardSprite.x - step * this.cellSize
		}

		this.addScore(1)
	}

	public moveRight() {
		let position = this.getSpritePosition(this.cardSprite)
		let step = 1
		let newPosition = {x: +position.x + step, y: position.y}

		if (this.isPositionFull(newPosition)) {
			return
		}
		
		if (this.cardSprite.x > 0) {
			this.cardSprite.x = this.cardSprite.x + step * this.cellSize
		}

		this.addScore(1)
	}

	public moveDown() {
		let position = this.getSpritePosition(this.cardSprite)
		let step = 1
		let newPosition = {x: position.x, y: +position.y + step}

		if (this.isPositionFull(newPosition)) {
			return
		}

		if (this.cardSprite.x > 0) {
			this.cardSprite.y = this.cardSprite.y + step * this.cellSize
		}

		this.addScore(1)
	}

	public moveUp() {
		let position = this.getSpritePosition(this.cardSprite)
		let step = 1
		let newPosition = {x: position.x, y: +position.y - step}

		if (this.isPositionFull(newPosition)) {
			return
		}

		if (this.cardSprite.x > 0) {
			this.cardSprite.y = this.cardSprite.y - step * this.cellSize
		}

		this.addScore(1)
	}

	public playCard() {
		let position = this.getSpritePosition(this.cardSprite)
		let newPosition = this.getPlayedCardPosition()

		if (this.isPositionFull(newPosition)) {
			return
		}

		if (this.hidden) {
			this.hidden = false
		}
		this.redrawCard()

		let coords = this.getCellCenter(newPosition)
		this.cardSprite.x = coords.x
		this.cardSprite.y = coords.y

		this.addScore(1)
	}

	private spawnCardBlock(pos): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let cardTexture = this.getCardTexture()
		let block = this.physics.add.image(coords.x, coords.y, cardTexture).setInteractive()
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)

        block.on('pointerdown', (pointer: any) => {
        	if (this.player) {
        		this.onCardPlayed(this)
	        	// this.hidden = !this.hidden
	        	// this.redrawCard()
	        }
        })

		return block
	}

	private getPlayedCardPosition(): Position {
		if (this.player) {
			return {x: 5, y: 6}
		} else {
			return {x: 7, y: 6}
		}
	}

	private isPositionFull(position: Position) {
		if (position.x < 0 || position.y < 0 || position.x >= this.x || position.y >= this.y) {
			return true
		}

		return false
	}

	private getCardTexture(): String {
		if (this.hidden) {
			return 'card_back'
		} else {
			return this.cardType
		}
	}

	private redrawCard() {
		this.cardSprite.setTexture(this.getCardTexture())
	}

	public update() {
		super.update()
	}

	public hide() {
		this.cardSprite.visible = false
		this.cardGroup.visible = false
	}

	public show() {
		this.cardSprite.visible = true
		this.cardGroup.visible = true
	}
}