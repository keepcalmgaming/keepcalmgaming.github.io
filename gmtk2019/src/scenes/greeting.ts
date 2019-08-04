const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

const halfHeight = gameHeight / 2
const halfWidth = gameWidth / 2

export class GreetingScene extends Phaser.Scene {
    create() {
        var content = [
            "B#",
            "",
            "Topic of GMTK Game Jam 2019 is “only one”.",
            "We decided to make a tower defense game with only one tower.",
            "Instead of building new towers, you should change location of your only tower.",
            "",
            "Other features of the game:",
            "– minimalistic design inspired of the lack of drawing skills;",
            "– monsters are evil and you can kill them;",
            "– soundtrack uses only one note – C.",
            "We decided C is a boring name, so we called our game B#;",
            "– no lootboxes;",
            "– no microtransactions. ",
            "",
            "We hope you’ll have as much fun as we did while developing B#.",
            "",
            "Enjoy!",
            "",
            "(click to play, load takes a while)",
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
