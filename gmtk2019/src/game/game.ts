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
        this.createMonsterPass(labs[0])

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

      if (!this.isVertical) {
          let newResult = []

          for (let y = 0; y<this.Y; y++) {
              let row = []
              for (let x = 0; x<this.X; x++) {
                  row.push(result[x][y])
              }
              newResult.push(row)
          }

          console.log('result', result)
          console.log('newResult', newResult)
          result = newResult
      }

      return result
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

    createMonsterPass(maze: number[][]): Cell[] {
    	let spawnX = 0, spawnY = 0 
    	let currX, currY
    	let prevX, prevY
    	let path = []
    	for (let i = 0; i < maze.length; i++) {
	    	for (let j = 0; j < maze[0].length; j++) {
	    		if (maze[i][j]==2) {
	    			spawnX = i
	    			spawnY = j
	    			break
	    		}
	    	}
    	}
    	currX = spawnX
    	currY = spawnY
    	prevX = currX
    	prevY = currY
    	path.push({ x: currX, y: currY })
    	while (maze[currX][currY] != 4) {
	    	if (currX - 1 >= 0 && currX - 1 != prevX && (maze[currX - 1][currY] == 0 || maze[currX - 1][currY] == 4)) {
		    	prevX = currX
		    	prevY = currY
		    	currX = currX - 1
		    	path.push({ x: currX, y: currY })
	    	} else if (currX + 1 < maze.length && currX + 1 != prevX && (maze[currX + 1][currY] == 0 || maze[currX + 1][currY] == 4)) {
		    	prevX = currX
		    	prevY = currY
		    	currX = currX + 1
		    	path.push({ x: currX, y: currY })
	    	} else if (currY - 1 >= 0 && currY - 1 != prevY && (maze[currX][currY - 1] == 0 || maze[currX][currY - 1] == 4)) {
		    	prevX = currX
		    	prevY = currY
		    	currY = currY - 1
		    	path.push({ x: currX, y: currY })
	    	} else if (currY + 1 < maze[0].length && currY + 1 != prevY && (maze[currX][currY + 1] == 0 || maze[currX][currY + 1] == 4)) {
		    	prevX = currX
		    	prevY = currY
		    	currY = currY + 1
		    	path.push({ x: currX, y: currY })
	    	}
	    }
    	return path
    }
}
