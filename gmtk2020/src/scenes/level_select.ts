import { LevelsSettings } from '../game/utils'

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

        window.Result = null

        let sprite = this.physics.add.sprite(0, 0, 'profile').setInteractive()
        sprite.x = halfWidth - 300
        sprite.y = halfHeight
        sprite.on('pointerdown', (pointer: any) => {
            (<any>window).LevelSetup = LevelsSettings[0]
            this.scene.start('Level')
        })
    }

    preload() {
        this.load.image('profile', 'images/menu/profile.png')
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