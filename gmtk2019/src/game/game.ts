type Cell = {
    x: number,
    y: number
}

export class Game {
    private LIVES = 20
    private NUM_SPAWNS = 3
    private NUM_TOWER_SPAWNS = 10

    public lives: number
    public X: number
    public Y: number

    public spawns?: Cell[]
    public towerSpawns?: Cell[]

    constructor(x: number, y: number) {
        this.lives = this.LIVES
        this.X = x
        this.Y = y

        this.createSpawns(this.NUM_SPAWNS)
        this.createTowerSpawns(this.NUM_TOWER_SPAWNS)
    }

    createTowerSpawns(num: number) {
        this.towerSpawns = []
        for (let i=0; i<num; i++) {
            this.towerSpawns.push(this.randomCoords())
        }
    }

    createSpawns(num: number) {
        this.spawns = []
        for (let i=0; i<num; i++) {
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
