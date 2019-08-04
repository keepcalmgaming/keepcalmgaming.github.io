import { Game } from '../game/game'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfWidth = gameWidth / 2
const halfHeight = gameHeight / 2

const debug = true
const minSide = 10
const maxSide = 16

type Cell = {
    x: number,
    y: number
}

type Position = {
    x: number,
    y: number
}

export class MainScene extends Phaser.Scene {
    private isVertical: boolean

    private rectSize: number
    private offsetX: number = 0
    private offsetY: number = 0
    private x: number
    private y: number

    public towergame: Game

    private mfGroup?: Phaser.Physics.Arcade.StaticGroup
    private mainframe?: Phaser.GameObjects.Sprite
    private tower?: Phaser.GameObjects.Sprite
    private towerSpawns: Phaser.GameObjects.Sprite[] = []
    private monsterSpawns: Phaser.GameObjects.Sprite[] = []

    private monsters?: Phaser.Physics.Arcade.Group
    private bullets?: Phaser.Physics.Arcade.Group

    public textLives?: Phaser.GameObjects.Text
    public textScore?: Phaser.GameObjects.Text

    constructor(
        sceneConfig: object
    ) {
        // super({key: 'main'})
        super(sceneConfig)

        this.isVertical = gameHeight > gameWidth

        if (this.isVertical) {
            this.x = minSide
            this.y = maxSide
        } else {
            this.x = maxSide
            this.y = minSide
        }

        let rw = gameWidth / this.x, rh = gameHeight / this.y
        this.rectSize = rh < rw ? rh : rw
        this.offsetX = (gameWidth - this.rectSize * this.x) / 2
        this.offsetY = (gameHeight - this.rectSize * this.y) / 2

        this.towergame = new Game(this.x, this.y, this.isVertical)

        console.log('Game Created', this.x, this.y, this.towergame)
    }

    create() {
        this.cameras.main.setBackgroundColor('#E8745A');

        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xffffff }, fillStyle: { color: 0x000000 }})

        this.setupMainframe()
        this.setupWalls()

        this.setupTowerSpawns()
        this.setupTower()

        this.setupMonsterSpawns()

        this.setupText()

        this.setupEvents()

        // let music = this.sound.add('music')
        // music.play()

        if (debug) {
            this.debugDrawGrid()
        }
    }

    update() {
        this.input.on('pointerup', () => {
            if (!this.towergame.active()) {
              this.towergame = new Game(this.x, this.y, this.isVertical)
              this.scene.restart();
            }
        });
    }

    setupMainframe() {
        this.mfGroup = this.physics.add.staticGroup()
        this.mainframe = this.mfGroup.create(0, 0, 'mainframe') as Phaser.Physics.Arcade.Sprite
        this.scaleSprite(this.mainframe, this.rectSize*2)

        this.mainframe.setOrigin(0)

        let position = this.getC(this.towergame.mainframe)
        this.mainframe.x = position.x;
        this.mainframe.y = position.y;

        (this.mainframe as any)['refreshBody'].call(this.mainframe)
    }

    setupWalls() {
        for (let i=0; i<this.towergame.walls.length; i++) {
            let wall = this.towergame.walls[i]

            let sprite = this.physics.add.sprite(0, 0, 'wallbrick')
            this.scaleSprite(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(wall)
            sprite.x = position.x
            sprite.y = position.y
        }
    }

    setupTower() {
        this.tower = this.physics.add.sprite(0, 0, 'tower')
        this.scaleSprite(this.tower, this.rectSize)

        this.tower.setOrigin(0)

        let coord = this.towergame.towerSpawns ? this.towergame.towerSpawns[0] : { x: 0, y: 0 }

        let position = this.getC(coord)
        this.tower.x = position.x
        this.tower.y = position.y
    }

    setupTowerSpawns() {
        this.towerSpawns = []

        for (let i=0; i<this.towergame.towerSpawns.length; i++) {
            let towerSpawn = this.towergame.towerSpawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive()
            this.scaleSprite(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(towerSpawn)
            sprite.x = position.x
            sprite.y = position.y

            sprite.on('pointerdown', (pointer: any) => {
                if (!this.tower) return

                this.tower.x = sprite.x
                this.tower.y = sprite.y
            })

            this.towerSpawns.push(sprite)
        }
    }

    setupMonsterSpawns() {
        this.monsterSpawns = []

        for (let i=0; i<this.towergame.spawns.length; i++) {

            let spawn = this.towergame.spawns[i]

            let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
            this.scaleSprite(sprite, this.rectSize)
            sprite.setOrigin(0)

            let position = this.getC(spawn)
            sprite.x = position.x;
            sprite.y = position.y;

            (sprite as any)['spawn'] = spawn

            this.monsterSpawns.push(sprite)
        }
    }

    setupEvents() {
        if (!this.mainframe || !this.mfGroup) return

        this.monsters = this.physics.add.group()
        this.physics.add.collider(this.monsters, this.mfGroup, this.mainframeHit)

        this.bullets = this.physics.add.group()
        this.physics.add.collider(this.monsters, this.bullets, this.bulletHit)

        // MONSTER SPAWNS
        for (let monsterSpawn of this.monsterSpawns) {
            this.time.addEvent({
                delay: 3000,
                loop: true,
                callback: this.createMonster,
                callbackScope: this,
                args: [ monsterSpawn ]
            })
        }

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.towerShoot,
            callbackScope: this
        })
    }


    towerShoot() {
        if (!this.tower || !this.monsters || !this.bullets) return

        let minDistance = 999999
        let closestMonster: Phaser.GameObjects.Sprite | null = null
        for (let monster of this.monsters.getChildren()) {
            let distance = Phaser.Math.Distance.Between(this.tower.x, this.tower.y, (monster as Phaser.GameObjects.Sprite).x, (monster as Phaser.GameObjects.Sprite).y)
            if (distance < minDistance) {
                minDistance = distance
                closestMonster = monster as Phaser.GameObjects.Sprite
            }
        }

        if (closestMonster && minDistance < this.rectSize*3) {
            let bullet = this.bullets.create(this.tower.x + this.rectSize / 2, this.tower.y + this.rectSize / 2, 'bullet')
            let scale = this.getScale(bullet, this.rectSize)
            bullet.setScale(scale)
            bullet.setOrigin(0.5)
            bullet.setCircle(20 * scale, bullet.width / 2, bullet.height / 2)
            this.physics.moveTo(bullet, closestMonster.x + this.rectSize / 2, closestMonster.y + this.rectSize / 2, this.rectSize*4)
        }
    }

    bulletHit(o1: Phaser.GameObjects.GameObject, o2: Phaser.GameObjects.GameObject) {
        let scene = o1['scene'] as MainScene

        o1.destroy()
        o2.destroy()

        if (scene.towergame.active()) {
            scene.towergame.score++

            if (!scene.textScore) return
            scene.textScore.setText(`SCORE: ${scene.towergame.score}`)
        }
    }

    mainframeHit(monster: Phaser.GameObjects.GameObject, mainframe: Phaser.GameObjects.GameObject) {
        monster.destroy()

        let scene = mainframe['scene'] as MainScene
        scene.towergame.lives--

        if (!scene.textLives) return
        if (scene.towergame.lives > 0) {
            scene.textLives.setText(`LIVES: ${scene.towergame.lives}`)
        } else {
            scene.textLives.setText('YOU DIED')
        }
    }

    createMonster(spawn: Phaser.GameObjects.Sprite) {
        if (!this.monsters) return
        if (!this.towergame) return
        if (!this.towergame.active()) return


        let mfc = this.getMFC()

        let spawnpoint: Cell = (spawn as any)['spawn']

        let path = this.buildPath(this.towergame.createMonsterPass(spawnpoint))

        let monster = this.add.follower(path, spawn.x, spawn.y, 'monster')
        this.monsters.add(monster)
        this.scaleSprite(monster, this.rectSize)
        monster.setOrigin(0)

        monster.x = spawn.x
        monster.y = spawn.y

        monster.startFollow({
            duration: 15000,
            from: 0,
            to: 1
        })
    }

    buildPath(cells: Cell[]): Phaser.Curves.Path {
        console.log('building path for', cells)
        let start = this.getC(cells[0])
        let path = this.add.path(start.x, start.y)

        for (let i=1; i<cells.length; i++) {
            let pos1 = this.getC(cells[i-1])
            let pos2 = this.getC(cells[i])

            let p1 = new Phaser.Math.Vector2(pos1.x, pos1.y)
            let p2 = new Phaser.Math.Vector2(pos2.x, pos2.y)
            path.add(new Phaser.Curves.Line(p1, p2))
        }

        return path
    }

    setupText() {
        this.textLives = this.add.text(20, 20, `LIVES: ${this.towergame.lives}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
        this.textScore = this.add.text(gameWidth - 120, 20, `SCORE: ${this.towergame.score}`, { fontFamily: 'Verdana', fontSize: 20, color: '#4C191B', align: 'center' })
    }

    getScale(sprite: Phaser.GameObjects.Sprite, dim: number) {
        return dim / sprite.width
    }

    scaleSprite(sprite: Phaser.GameObjects.Sprite, dim: number) {
        sprite.setScale(this.getScale(sprite, dim))
    }


    getMFC(): Position {
        let mf = this.towergame.mainframe
        return this.getC({ x: mf.x + 1, y: mf.y + 1 })
    }

    getC(c: Cell): Position {
        return {
            x: this.getCX(c.x),
            y: this.getCY(c.y)
        }
    }

    getCX(x: number): number { return this.offsetX + x*this.rectSize }

    getCY(y: number): number { return this.offsetY + y*this.rectSize }


    preload() {
        this.load.image('bullet', 'images/bullet2.png')
        this.load.image('mainframe', 'images/mainframe.png')
        this.load.image('monster', 'images/monster.png')
        this.load.image('monsterplace', 'images/monsterplace.png')
        this.load.image('tower', 'images/tower.png')
        this.load.image('towerplace', 'images/towerplace.png')
        this.load.image('wallbrick', 'images/wallbrick.png')

        // this.load.audio('music', 'sounds/GameOST.mp3')
    }

    debugDrawGrid() {
        let field: Phaser.GameObjects.Graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x000000 }, fillStyle: { color: 0x000000 }})

        for (let i=0; i<this.x; i++) {
            for (let j=0; j<this.y; j++) {
                field.strokeRect(this.getCX(i), this.getCY(j), this.rectSize, this.rectSize)
            }
        }
    }
}
