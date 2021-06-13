const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class EndgameScene extends Phaser.Scene {
    constructor(
        sceneConfig: object
    ) {
        super({key: 'endgame'})
    }

    create() {
        var content = [
            "GAME OVER",
            "HIGHSCORE: " + window.HIGHSCORE,
            "",
            "Thank you for playing!",
            "",
            "(Click to restart)",
        ];
        this.cameras.main.setBackgroundColor('#959F7D');
        
        var text = this.add.text(0, 0, content, { align: 'center', font: '25px', color: '#0F110D', wordWrap: { width: gameWidth - 100 } });
        var bounds = text.getBounds();

        text.x = halfWidth - bounds.width/2;
        text.y = halfHeight - bounds.height/2;

        let clicked = false

        if (!window.SaveState) {
            window.SaveState = {}
        }

        this.input.on('pointerdown', () => {
            if (!clicked || true) {
              this.scene.stop('endgame')
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
