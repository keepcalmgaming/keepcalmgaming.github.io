import { LevelOrder, LevelConfig, LevelResults, HeroSceneInfo } from '../game/utils'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class GreetingScene extends Phaser.Scene {
    constructor(
        sceneConfig: object
    ) {
        super({key: 'greeting'})
    }

    create() {
        var content = [
            "Wingman",
            "",
            "Topic of GMTK Game Jam 2020 is “out of control”.",
            "",
            "Enjoy!",
            "",
            "https://keepcalmgaming.github.io"
        ];

        var text = this.add.text(0, 0, content, { align: 'center', font: '25px', wordWrap: { width: gameWidth - 100 } });
        var bounds = text.getBounds();

        text.x = halfWidth - bounds.width/2;
        text.y = halfHeight - bounds.height/2;

        let clicked = false

        if (!window.SaveState) {
            window.SaveState = {}
            window.CurrentLevel = LevelOrder[0]
        }

        this.input.on('pointerdown', () => {
            if (!clicked || true) {
              this.goHero()
              clicked = true
            }
        });
    }

    goHero() {
        window.HeroSettings = LevelConfig[window.CurrentLevel].heroIntro;
        this.scene.switch('hero')
    }
}
