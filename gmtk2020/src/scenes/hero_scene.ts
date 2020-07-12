import { LevelsSettings, HeroSceneInfo } from '../game/utils'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class HeroScene extends Phaser.Scene {
    constructor(
        sceneConfig: object
    ) {
        super({key: 'hero'})
    }

    pic: string
    text: string

    create() {
        let heroSceneInfo = window.HeroSettings
        this.pic = heroSceneInfo.pic
        this.text = heroSceneInfo.text

        let imgPath = this.pic
        
        this.load.once('complete', this.renderScene, this);
        this.load.image('img', imgPath)
        this.load.start();
    }

    renderScene() {
        let sprite = this.physics.add.sprite(0, 0, 'img').setInteractive()
        sprite.x = halfWidth - 300
        sprite.y = halfHeight

        let content = this.text
        var text = this.add.text(0, 0, content, { align: 'left' })
        var bounds = text.getBounds()

        text.x = halfWidth - 100
        text.y = halfHeight - bounds.height/2

        let clicked = false

        this.input.on('pointerup', () => {
            if (window.Result) {
                this.scene.start('level_select')
            } else {
                (<any>window).LevelSetup = LevelsSettings[0]
                this.scene.start('Level')
            }
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