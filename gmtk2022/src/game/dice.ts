import { BaseGame } from './base_game'

export class Dice extends BaseGame {

    //TODO generate random top?
    public currentDiceTop: number = 1
    //TODO generate random south
    public currentDiceSouth: number = 4
    //TODO find a way to calculate
    public currentDiceEast: number = 2

	private diceSprite?: Phaser.GameObjects.Sprite
	private diceGroup?: Phaser.Physics.Arcade.Group

	private diceVisitedGroup?: Phaser.Physics.Arcade.Group
	private diceAvailableGroup?: Phaser.Physics.Arcade.Group
	
	constructor(config: any) {
		super(config)
		this.diceGroup = this.physics.add.group()
		this.diceVisitedGroup = this.physics.add.group()
		this.diceAvailableGroup = this.physics.add.group()
		console.log('Dice', this.config)

		this.spawnDice()
		this.showAvailable()
	}

	private spawnDice() {
		let pos = {x: 6, y: 6}
		this.diceSprite = this.spawnDiceBlock(pos)
		this.diceGroup.add(this.diceSprite)
	}

	public moveLeft() {
		let position = this.getSpritePosition(this.diceSprite)
		let step = this.currentDiceTop
		let newPosition = {x: +position.x - step, y: position.y}

		if (this.isPositionFull(newPosition)) {
			return
		}
		
		this.diceVisitedGroup.add(this.spawnVisitedBlock(position))

        let prevDiceTop = this.currentDiceTop

        this.currentDiceTop = 7 - this.currentDiceEast
        this.currentDiceEast = prevDiceTop        

		if (this.diceSprite.x > 0) {
			this.diceSprite.x = this.diceSprite.x - step * this.cellSize
		}
		this.showAvailable()
		this.redrawDice()

		this.addScore(1)
	}

	public moveRight() {
		let position = this.getSpritePosition(this.diceSprite)
		let step = this.currentDiceTop
		let newPosition = {x: +position.x + step, y: position.y}

		if (this.isPositionFull(newPosition)) {
			return
		}
		
		this.diceVisitedGroup.add(this.spawnVisitedBlock(position))

        let prevDiceTop = this.currentDiceTop

        this.currentDiceTop = this.currentDiceEast
        this.currentDiceEast = 7 - prevDiceTop

		if (this.diceSprite.x > 0) {
			this.diceSprite.x = this.diceSprite.x + step * this.cellSize
		}
		this.showAvailable()
		this.redrawDice()

		this.addScore(1)
	}

	public moveDown() {
		let position = this.getSpritePosition(this.diceSprite)
		let step = this.currentDiceTop
		let newPosition = {x: position.x, y: +position.y + step}

		if (this.isPositionFull(newPosition)) {
			return
		}

		this.diceVisitedGroup.add(this.spawnVisitedBlock(position))

        let prevDiceTop = this.currentDiceTop

        this.currentDiceTop = this.currentDiceSouth
        this.currentDiceSouth = 7 - prevDiceTop

		if (this.diceSprite.x > 0) {
			this.diceSprite.y = this.diceSprite.y + step * this.cellSize
		}
		this.showAvailable()
		this.redrawDice()

		this.addScore(1)
	}

	public moveUp() {
		let position = this.getSpritePosition(this.diceSprite)
		let step = this.currentDiceTop
		let newPosition = {x: position.x, y: +position.y - step}

		if (this.isPositionFull(newPosition)) {
			return
		}
		
		this.diceVisitedGroup.add(this.spawnVisitedBlock(position))

        let prevDiceTop = this.currentDiceTop

        this.currentDiceTop = 7 - this.currentDiceSouth
        this.currentDiceSouth = prevDiceTop

		if (this.diceSprite.x > 0) {
			this.diceSprite.y = this.diceSprite.y - step * this.cellSize
		}
		this.showAvailable()
		this.redrawDice()

		this.addScore(1)
	}

	private spawnDiceBlock(pos): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let block = this.physics.add.image(coords.x, coords.y, 'one')
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)
		return block
	}

	private spawnVisitedBlock(pos): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let block = this.physics.add.image(coords.x, coords.y, 'visited')
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)
		return block
	}

	private spawnAvailableBlock(pos, value): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let block: Any
		if (value == 1) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_one')
		} else if (value == 2) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_two')
		} else if (value == 3) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_three')
		} else if (value == 4) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_four')
		} else if (value == 5) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_five')
		} else if (value == 6) {
			block = this.physics.add.image(coords.x, coords.y, 'cell_available_six')			
		}
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)
		return block
	}

	private spawnTopAvailableBlock(pos): Phaser.GameObjects.Sprite {
		let coords = this.getCellCenter(pos)
		let block = this.physics.add.image(coords.x, coords.y, 'available')
		block.setOrigin(0.5)
		this.scaleSprite(block, this.cellSize * 0.9)
		return block
	}
	

	private isPositionFull(position: Position) {
		if (position.x < 0 || position.y < 0 || position.x >= this.x || position.y >= this.y) {
			return true
		}

		for (let block of this.diceVisitedGroup.getChildren()) {
			let blockPosition = this.getSpritePosition(block)
			console.log(blockPosition, block, blockPosition.x)
			if ((blockPosition.x == position.x) && (blockPosition.y == position.y)) {
				return true
			}
		}

		return false
	}

	private showAvailable() {
		this.diceAvailableGroup.clear(false, true)

		let position = this.getSpritePosition(this.diceSprite)
		let step = this.currentDiceTop

		let newLeftPosition = {x: +position.x - step, y: position.y}
		let isLeftPositionAvailable = !this.isPositionFull(newLeftPosition)
		if (isLeftPositionAvailable) {
			this.diceAvailableGroup.add(this.spawnAvailableBlock(newLeftPosition, 7 - this.currentDiceEast))
		}

		let newRightPosition = {x: +position.x + step, y: position.y}
		let isRightPositionAvailable = !this.isPositionFull(newRightPosition)
		if (isRightPositionAvailable) {
			this.diceAvailableGroup.add(this.spawnAvailableBlock(newRightPosition, this.currentDiceEast))
		}

		let newDownPosition = {x: position.x, y: +position.y + step}
		let isDownPositionAvailable = !this.isPositionFull(newDownPosition)
		if (isDownPositionAvailable) {
			this.diceAvailableGroup.add(this.spawnAvailableBlock(newDownPosition, this.currentDiceSouth))
		}

		let newUpPosition = {x: position.x, y: +position.y - step}
		let isUpPositionAvailable = !this.isPositionFull(newUpPosition)
		if (isUpPositionAvailable) {
			this.diceAvailableGroup.add(this.spawnAvailableBlock(newUpPosition, 7 - this.currentDiceSouth))
		}

		if (!isLeftPositionAvailable && !isRightPositionAvailable && !isDownPositionAvailable && !isUpPositionAvailable) {
			this.addScore(-42)
		}
	}

	private redrawDice() {
		if (this.currentDiceTop == 1) {
			this.diceSprite.setTexture('one')
		} else if (this.currentDiceTop == 2) {
			this.diceSprite.setTexture('two')
		} else if (this.currentDiceTop == 3) {
			this.diceSprite.setTexture('three')
		} else if (this.currentDiceTop == 4) {
			this.diceSprite.setTexture('four')
		} else if (this.currentDiceTop == 5) {
			this.diceSprite.setTexture('five')
		} else if (this.currentDiceTop == 6) {
			this.diceSprite.setTexture('six')
		}
	}

	public update() {
		super.update()
	}
}