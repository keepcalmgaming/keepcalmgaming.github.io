import { LevelConfig, LevelOrder } from '../game/utils'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class LevelSelectScene extends Phaser.Scene {
    constructor(
        sceneConfig: object
    ) {
        super({key: 'level_select'})

        // this.isVertical = gameHeight > gameWidth

        // if (this.isVertical) {
        //     this.x = minSide
        //     this.y = maxSide
        // } else {
        //     this.x = maxSide
        //     this.y = minSide
        // }

        // let rw = gameWidth / this.x, rh = gameHeight / this.y
        // this.rectSize = rh < rw ? rh : rw
        // this.offsetX = (gameWidth - this.rectSize * this.x) / 2
        // this.offsetY = (gameHeight - this.rectSize * this.y) / 2
    }

    create() {
        console.log('create called')

        this.cameras.main.setBackgroundColor('#FFFFFF');
        
        if (window.Result) {
            if (window.SaveState[window.Result.name]) {
                if (window.Result.stars > window.SaveState[window.Result.name].stars) {
                    window.SaveState[window.Result.name].stars = window.Result.stars
                }
            } else {
                window.SaveState[window.Result.name] = {
                    stars: window.Result.stars
                }
            }
        }

        window.Result = null

        let positions = [
            [halfWidth - 140, halfHeight - 90],
            [halfWidth, halfHeight - 90],
            [halfWidth + 140, halfHeight - 90],
            [halfWidth - 70, halfHeight + 90],
            [halfWidth + 70, halfHeight + 90]
        ]

        let i = 0, prevName = null
        for (let name of LevelOrder) {
            if (!prevName || window.SaveState[prevName]) {
                let stars = window.SaveState[name] ? window.SaveState[name].stars : 0

                let sprite = this.physics.add.sprite(positions[i][0], positions[i][1], 'level_'+name).setInteractive()
                sprite.setOrigin(0.5)
                sprite.on('pointerdown', (pointer: any) => {
                    (<any>window).LevelSetup = LevelConfig[name]
                    this.scene.start('Level')
                })

                for (let j=0; j<3; j++) {
                    let fl = j < stars ? 'flag_ready' : 'flag_empty'

                    let offsetX = 18, stepX = 20, offsetY = 53;

                    let flag = this.physics.add.sprite(positions[i][0] - offsetX + stepX * j, positions[i][1] + offsetY, fl)
                    flag.setScale(0.4)
                    flag.setOrigin(0.5)
                    flag.setDepth(20)
                }
            } else {
                let sprite = this.physics.add.sprite(positions[i][0], positions[i][1], 'level_locked')
                sprite.setOrigin(0.5)
            }

            prevName = name
            i++
        }
    }

    preload() {
        for (let name of LevelOrder) {
            let data = LevelConfig[name]
            this.load.image('level_'+name, data.heroOutro.pic)
        }

        this.load.image('level_locked', 'images/profile_locked.png')

        this.load.image('profile', 'images/menu/profile.png')

        this.load.image('flag_ready', 'images/flag_ready.png')
        this.load.image('flag_empty', 'images/flag_empty.png')

    }
}

// setupTowerSpawns() {
//     this.towerSpawns = []

//     for (let i=0; i<this.towergame.towerSpawns.length; i++) {
//         let towerSpawn = this.towergame.towerSpawns[i]

//         let sprite = this.physics.add.sprite(0, 0, 'towerplace').setInteractive()
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)

//         let position = this.getC(towerSpawn)
//         sprite.x = position.x
//         sprite.y = position.y

//         sprite.on('pointerdown', (pointer: any) => {
//             if (!this.tower) return

//             this.tower.x = sprite.x
//             this.tower.y = sprite.y
//         })

//         this.towerSpawns.push(sprite)
//     }
// }

// setupMonsterSpawns() {
//     this.monsterSpawns = []

//     for (let i=0; i<this.towergame.spawns.length; i++) {

//         let spawn = this.towergame.spawns[i]

//         let sprite = this.physics.add.sprite(0, 0, 'monsterplace')
//         this.scaleSprite(sprite, this.rectSize)
//         sprite.setOrigin(0)

//         let position = this.getC(spawn)
//         sprite.x = position.x;
//         sprite.y = position.y;

//         (sprite as any)['spawn'] = spawn

//         this.monsterSpawns.push(sprite)
//     }
// }