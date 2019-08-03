const spawnsCount = 3

export class Game {
    private LIVES = 20

    public lives: number
    public X: number
    public Y: number

    constructor(x: number, y: number) {
        this.lives = this.LIVES
        this.X = x
        this.Y = y
    }

    getSpawnCoors() {
		let spawnX = this.getRandNum(this.X);
		let spawnY = this.getRandNum(this.Y);
    	return [spawnX, spawnY]
    }

    getRandNum(n: number) {
        return Math.floor(Math.random() * Math.floor(n));
    }
}
