import { GreetingScene } from './scenes/greeting'
import { MainScene } from './scenes/main'
import { EndgameScene } from './scenes/endgame'

const gameHeight = window.innerHeight
const gameWidth = window.innerWidth

let config: GameConfig = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ GreetingScene, MainScene, EndgameScene ]
}

export class App {
    private isDebug = true

    public start(): void {
        this.log('Generating game...')
        window.HIGHSCORE = 0
        let g = new Phaser.Game(config)

        this.log('Ready to play')
    }

    private log(...args: any) {
        if (this.isDebug) {
            console.log(...args)
        }
    }
}
