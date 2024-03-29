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
            "ROLL THE WAY",
            "You have a game field 13x13. You start in the center. You play as a dice. Top value of the dice shows the amount of rotations you can do in any of possible directions. Rotating changes your top value.",
            "You can’t finish your move on the cell you were located previously.",            
            "Your goal is too step on as much cells as possible before you don’t have opportunity to move.",            
            "Good luck.",
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
            if (!clicked) {
              console.log('greeting pointerdown')
              this.scene.switch('main')
              clicked = true
            }
        });

        this.input.keyboard.on('keydown', (event: any) => {
            event.preventDefault()
            if (!clicked) {
              console.log('greeting keydown')
              this.scene.switch('main')
              clicked = true
            }
        });
    }
}
