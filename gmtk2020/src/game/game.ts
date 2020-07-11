export class Game {
    public isVertical: boolean
    public X: number
    public Y: number
    public map: number[][]


    constructor(x: number, y: number, isVertical: boolean) {
        this.isVertical = isVertical
        this.X = x
        this.Y = y
        this.map = this.generateMap()
    }

    randomLabs(): number[][] {
        return labs[0]
    }

    generateMap() {
      let result = []

      if (!this.isVertical && false) {
          result = this.rotateMap(result)
      }

      return result
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
        return true
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
