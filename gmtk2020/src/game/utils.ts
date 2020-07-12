import { Driver, SimpleDriver, EchoDriver } from 'driver'

export enum DriverInput { Left, Right, Cool, Crap}
export enum Direction { Left, Right, Forward }
export enum Movement { Left, Right, Up, Down }

export type Coords = {
    x: number,
    y: number
}

export type LevelSetup = {
    start: Coords,
    finish: Coords,
    flags: Coords[]
}


let level1: LevelSetup = {
    start: { x: 1, y: 1 },
    finish: { x: 5, y: 5},
    flags: [{ x: 3, y: 3}, { x: 2, y: 5}, { x: 5, y: 1}]
}


export type HeroSceneInfo = {
    pic: string
    text: string
} 

let defaultHero = {
    pic: 'images/menu/profile.png',
    text: 'Dummy Text for Hero Screen'
}

export class LevelInfo {
    constructor(
        public driverConstructor: () => Driver,
        public level: LevelSetup,
        public name: string = 'default',
        public heroIntro: HeroSceneInfo = defaultHero,
        public heroOutro: HeroSceneInfo = defaultHero
    ) { }
}


export let LevelOrder = ['echo', 'danny']
export let LevelConfig = {
    echo: new LevelInfo(
        () => new EchoDriver(), 
        level1, 
        'echo',
        {
            pic: 'images/menu/profile.png',
            text: 'This is you. You need to get to the Finish.'
        }
    ),
    danny: new LevelInfo(() => new SimpleDriver(), level1, 'danny')
}

export type LevelResults = {
    stars: number,
    name: string
}

export let LevelsSettings: LevelInfo[] = [
    new LevelInfo(() => new EchoDriver(), level1, 'danny'),
    new LevelInfo(() => new SimpleDriver(), level1, 'echo')
]
