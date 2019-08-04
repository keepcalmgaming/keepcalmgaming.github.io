type Cell = {
    x: number,
    y: number
}

export class Game {
    private LIVES = 20
    private NUM_SPAWNS = 3
    private NUM_TOWER_SPAWNS = 7

    public isVertical: boolean
    public score: number = 0
    public lives: number
    public X: number
    public Y: number

    public spawns: Cell[] = []
    public towerSpawns: Cell[] = []

    public mainframe: Cell

    constructor(x: number, y: number, isVertical: boolean) {
        this.isVertical = isVertical
        this.lives = this.LIVES
        this.X = x
        this.Y = y

        this.createSpawns(this.NUM_SPAWNS)
        this.createTowerSpawns(this.NUM_TOWER_SPAWNS)

        this.mainframe = {
            x: Math.floor(this.X / 2) - 1,
            y: Math.floor(this.Y / 2) - 1
        }
    }

    active(): boolean {
        return this.lives > 0
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

    randomCoords(): Cell {
        let spawnX = this.getRandNum(this.X);
        let spawnY = this.getRandNum(this.Y);
        return {x: spawnX, y: spawnY}
    }

    getRandNum(n: number) {
        return Math.floor(Math.random() * Math.floor(n));
    }
}
