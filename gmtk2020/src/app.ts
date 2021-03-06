import { GreetingScene } from './scenes/greeting'
import { LevelScene } from './scenes/Level'
import { LevelSelectScene } from './scenes/level_select'
import { HeroScene } from './scenes/hero_scene'

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
    scene: [ GreetingScene, LevelScene, LevelSelectScene, HeroScene ]
}

export class App {
    private isDebug = true

    public start(): void {
        this.log('Generating game...')
        let g = new Phaser.Game(config)

        this.log('Ready to play')
    }

    private log(...args: any) {
        if (this.isDebug) {
            console.log(...args)
        }
    }
}
