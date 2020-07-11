const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class GreetingScene extends Phaser.Scene {
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

        this.input.on('pointerdown', () => {
            if (!clicked) {
              this.scene.switch('main');
              clicked = true
            }
        });
    }
}
