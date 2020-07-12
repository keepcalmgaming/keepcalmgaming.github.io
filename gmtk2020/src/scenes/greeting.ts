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
            "Left! Right! Cool! Crap!",
            "",
            "Topic of GMTK Game Jam 2020 is “Out of Control”.",
            "Here's our small game about driving in a city.",
            "",
            "Enjoy!",
            "",
            "https://keepcalmgaming.github.io"
        ];
        this.cameras.main.setBackgroundColor('#FFFFFF');
        
        var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#000000', wordWrap: { width: gameWidth - 100 } });
        var bounds = text.getBounds();

        text.x = halfWidth - bounds.width/2;
        text.y = halfHeight - bounds.height/2;

        this.load.once('complete', () => {
            let music = this.sound.add('music')
            music.play()
        }, this);
        this.load.audio('music', 'sounds/NavigatorOST.mp3')
        this.load.start();

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
