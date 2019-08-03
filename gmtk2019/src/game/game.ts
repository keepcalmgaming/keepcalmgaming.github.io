export class Game {
    private LIVES = 20
    private NUM_SPAWNS = 3

    public lives: number
    public X: number
    public Y: number

    public spawns?: {x: number, y: number}[]

    constructor(x: number, y: number) {
        this.lives = this.LIVES
        this.X = x
        this.Y = y

        this.createSpawns(this.NUM_SPAWNS)
    }

    createSpawns(numSpawns: number) {
        this.spawns = []
        for (let i=0; i<numSpawns; i++) {
            this.spawns.push(this.randomCoords())
        }
    }

    randomCoords(): { x: number, y: number } {
        let spawnX = this.getRandNum(this.X);
        let spawnY = this.getRandNum(this.Y);
        return {x: spawnX, y: spawnY}
    }

    getRandNum(n: number) {
        return Math.floor(Math.random() * Math.floor(n));
    }
}
