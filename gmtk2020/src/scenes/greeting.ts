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
            "We hope you’ll have as much fun as we did while developing B#.",
            "",
            "Enjoy!",
            "",
            "https://keepcalmgaming.github.io"
        ];

        var text = this.add.text(0, 0, content, { align: 'center' });
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
        window.heroPic = 'images/menu/profile.png'
        window.heroTxt = 'This is you. You need to get to the Finish.'
        this.scene.switch('hero')
    }
}
