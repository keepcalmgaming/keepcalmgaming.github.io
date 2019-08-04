type Cell = {
    x: number,
    y: number
}

const labs = [
    [
        [ 2, 0, 0, 0, 0 ],
        [ 1, 3, 1, 1, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 4 ]
    ]
]

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
        this.map = this.generateMap();

        this.createSpawns(this.NUM_SPAWNS)
        this.createTowerSpawns(this.NUM_TOWER_SPAWNS)

        this.mainframe = {
            x: Math.floor(this.X / 2) - 1,
            y: Math.floor(this.Y / 2) - 1
        }
    }

    generateMap() {
      // TODO refactor this, first working version was approved
      let clone = Object.create(labs)
      let upLeft = clone[0]
      let result = []
      for(var i=0;i<8;i++){
        let t = Object.create(upLeft[i])
        result[i] = upLeft[i].concat(t.reverse().flat())
      }

      let downLeft = Object.create(upLeft).reverse()
      for(var i=8; i<16; i++){
        let t = Object.create(downLeft[i-8])
        result[i] = downLeft[i-8].concat(t.reverse().flat())
      }

      return result
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
