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
            "Calendice",
            "",
            "Calendice is a game where you need to SEIZE THE DAY.",
            "You SEIZE THE DAY if you roll the number of the day of the week.",
            "1 for Mondays, 2 for Tuesdays,.. 6 for Saturdays.",
            "You do not roll on Sundays, Sunday is a Shopping day.",
            "Use powerups and SEIZE as much days as you can!",
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

        // this.load.once('complete', () => {
        //     let music = this.sound.add('music')
        //     music.play()
        // }, this);
        // this.load.audio('music', 'sounds/NavigatorOST.mp3')
        // this.load.start();

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
    }
}
