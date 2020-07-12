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
    text: string,
    name?: string
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
        public heroOutro: HeroSceneInfo = defaultHero,
        public heroIntro: HeroSceneInfo = defaultHero
    ) { }
}


export let LevelOrder = ['danny', 'alex', 'yappie', 'misha', 'elon']
export let LevelConfig = {
    danny: new LevelInfo(
        () => new EchoDriver(), 
        level1, 
        'danny',
        {
            pic: 'images/profile_danny.png',
            text: "But you are not the driver.\n\nYour driver was Danny. He is a nice guy and always listens.\n\nOther won't.",
            name: 'intro'
        },
        {
            pic: 'images/profile_player.png',
            text: 'This is you.\n\nYou need to get to the Finish.',
            name: 'beginning'
        }
    ),
    alex: new LevelInfo(() => new SimpleDriver(), level1, 'alex',
        {
            pic: 'images/profile_alex.png',
            text: 'Alex does not like to listen',
            name: 'alex'
        }),
    yappie: new LevelInfo(() => new SimpleDriver(), level1, 'yappie',
        {
            pic: 'images/profile_yappie.png',
            text: 'Yappie always does the opposite',
            name: 'yappie'
        }),
    misha: new LevelInfo(() => new SimpleDriver(), level1, 'misha',
        {
            pic: 'images/profile_misha.png',
            text: 'Misha never listens',
            name: 'misha'
        }),
    elon: new LevelInfo(() => new SimpleDriver(), level1, 'elon',
        {
            pic: 'images/profile_elon.png',
            text: 'Elon is the smartest',
            name: 'elon'
        })
}

export type LevelResults = {
    stars: number,
    name: string
}
