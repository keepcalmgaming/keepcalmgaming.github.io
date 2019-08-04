type Cell = {
    x: number,
    y: number
}

const labs = [
    [
        [ 2, 0, 0, 0, 0 ],
        [ 1, 1, 1, 3, 0 ],
        [ 0, 0, 0, 1, 0 ],
        [ 0, 3, 0, 1, 0 ],
        [ 0, 1, 0, 3, 0 ],
        [ 0, 1, 0, 0, 0 ],
        [ 0, 3, 1, 1, 1 ],
        [ 0, 0, 0, 0, 4 ]
    ]
]

export class Game {
    private LIVES = 20

    public isVertical: boolean
    public score: number = 0
    public lives: number
    public X: number
    public Y: number
    public map: number[][]

    public spawns: Cell[] = []
    public towerSpawns: Cell[] = []
    public walls: Cell[] = []

    public mainframe: Cell

    constructor(x: number, y: number, isVertical: boolean) {
        this.isVertical = isVertical
        this.lives = this.LIVES
        this.X = x
        this.Y = y
        this.map = this.generateMap()

        this.createEntities()

        this.mainframe = {
            x: Math.floor(this.X / 2) - 1,
            y: Math.floor(this.Y / 2) - 1
        }
    }

    generateMap() {
      let clone = Object.create(labs)
      let upLeft = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], false, false)
      let upRight = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], true, false)
      let downLeft = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], false, true)
      let downRight = this.generateQuorter(clone[this.getRandNum(labs.length - 1)], true, true)
      let result = []

      for(var i=0;i<8;i++){
        result[i] = upLeft[i].concat(upRight[i].flat())
      }

      for(var i=8; i<16; i++){
        result[i] = downLeft[i-8].concat(downRight[i-8].flat())
      }

      if (!this.isVertical) {
          result = this.rotateMap(result)
      }

      return result
    }

    generateQuorter(upLeft: number[], flipX: boolean, flipY: boolean) {
        let quorter = []

        if (!flipX && !flipY) {
            quorter = Object.create(upLeft)
        }

        if(flipX && !flipY) {
            for(var i=0;i<8;i++){
              let t = Object.create(upLeft[i])
              quorter[i] = t.reverse().flat()
            }
        }

        if(!flipX && flipY) {
            quorter = Object.create(upLeft).reverse()
        }

        if(flipX && flipY) {
            let downLeft = Object.create(upLeft).reverse()
            for(var i=0; i<8; i++){
              let t = Object.create(downLeft[i])
              quorter[i] = t.reverse()
            }
        }


        return quorter
    }

    rotateMap(map: number[][]) {
        let rotatedMap = []

        for (let y = 0; y<this.Y; y++) {
            let row = []
            for (let x = 0; x<this.X; x++) {
                row.push(map[x][y])
            }
            rotatedMap.push(row)
        }

        return rotatedMap
    }

    active(): boolean {
        return this.lives > 0
    }

    createEntities() {
        for (let i = 0; i<this.map.length; i++) {
            let row = this.map[i]
            for (let j = 0; j<row.length; j++) {
                switch (row[j]) {
                    case 1: // wall
                        this.walls.push({x: j, y: i})
                        break;
                    case 2: // monster spawn
                        this.spawns.push({x: j, y: i})
                        break;
                    case 3: // tower spawn
                        this.towerSpawns.push({x: j, y: i})
                        break;
                }
            }
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
