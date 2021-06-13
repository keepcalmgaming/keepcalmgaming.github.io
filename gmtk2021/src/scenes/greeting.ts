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
            "Two games, one win",
            "",
            "Topic of GMTK Game Jam 2020 is “JOINED TOGETHER”.",
            "Here's our small game about Tetris and Arcanoid.",
            "Use keyboard or on-screen controls to play.",
            "",
            "Enjoy!",
            "",
            "https://keepcalmgaming.github.io"
        ];
        this.cameras.main.setBackgroundColor('#959F7D');
        
        var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#0F110D', wordWrap: { width: gameWidth - 100 } });
        var bounds = text.getBounds();

        text.x = halfWidth - bounds.width/2;
        text.y = halfHeight - bounds.height/2;

        this.load.once('complete', () => {
            let music = this.sound.add('music')
            music.play()
        }, this);
        this.load.audio('music', 'sounds/track.mp3')
        this.load.start();

        let clicked = false

        if (!window.SaveState) {
            window.SaveState = {}
        }

        this.input.on('pointerdown', () => {
            if (!clicked || true) {
              this.scene.switch('main')
              clicked = true
            }
        });

        this.input.keyboard.on('keydown', (event: any) => {
            event.preventDefault()
            if (!clicked || true) {
              this.scene.switch('main')
              clicked = true
            }
        });
    }
}
