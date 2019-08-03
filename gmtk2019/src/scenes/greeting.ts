const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class GreetingScene extends Phaser.Scene {
    create() {
        var content = [
            "A Hero, A Sword and A Pit",
            "",
            "This is GMTK Game Jam 2019 submission.",
            "Only one.",
            "",
            "Have fun and thanks for playing!",
            "",
            "https://keepcalmgaming.github.io"
        ];

        var text = this.add.text(0, 0, content, { align: 'center' });
        var bounds = text.getBounds();

        text.x = halfWidth - bounds.width/2;
        text.y = halfHeight - bounds.height/2;

        this.input.on('pointerdown', () => {
          this.scene.switch('main');
        });
    }
}
