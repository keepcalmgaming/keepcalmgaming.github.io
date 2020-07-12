import { HeroSceneInfo, LevelConfig, LevelOrder } from '../game/utils'

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
    imgName: string

    create() {
        let heroSceneInfo: HeroSceneInfo = window.HeroSettings
        this.pic = heroSceneInfo.pic
        this.text = heroSceneInfo.text

        let imgPath = this.pic

        this.imgName = 'heroImg'+heroSceneInfo.name
        
        console.log('loading', this.pic, this.imgName)
        this.load.once('complete', this.renderScene, this);
        this.load.image(this.imgName, imgPath)
        this.load.start();
    }

    renderScene() {
        let sprite = this.physics.add.sprite(0, 0, this.imgName).setInteractive()
        sprite.setOrigin(1, 0.5)
        sprite.x = halfWidth - 20
        sprite.y = halfHeight

        let content = this.text
        var text = this.add.text(0, 0, content, { 
            align: 'left',
            font: 'bold 25px Arial',
            wordWrap: { width: halfWidth }
        })
        var bounds = text.getBounds()

        text.x = halfWidth
        text.y = halfHeight - bounds.height/2

        if (halfWidth > 300) {
            sprite.x -= 100
            text.x -= 100
        }

        let clicked = false

        this.input.on('pointerdown', () => {
            if (!clicked) {
                this.scene.stop('hero_scene')
                if (window.Result) {
                    this.scene.start('level_select')
                } else {
                    (<any>window).LevelSetup = LevelConfig[LevelOrder[0]]
                    this.scene.start('Level')
                }
            }
        })
    }

    preload() {
        this.load.image('profile', 'images/menu/profile.png')
    }
}
