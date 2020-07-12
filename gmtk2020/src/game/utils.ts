import { Driver, EchoDriver } from 'driver'

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
    flags: Coords[],
    direction: Movement
}


let level1: LevelSetup = {
    start: { x: 2, y: 2 },
    finish: { x: 5, y: 5},
    flags: [{ x: 3, y: 3}, { x: 2, y: 5}, { x: 5, y: 1}],
    direction: Movement.Right
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
        public heroIntro: HeroSceneInfo = defaultHero,
        public direction: Movement
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
            text: "But you are not the driver.\n\nYour driver Danny listens carefully to all your commands and executes them. He is a reliable driver.\n\nOthers are not.",
            name: 'intro'
        },
        {
            pic: 'images/profile_player.png',
            text: 'This is you.\n\nYou need to get to the Finish.',
            name: 'beginning'
        }
    ),
    alex: new LevelInfo(() => new EchoDriver(), level1, 'alex',
        {
            pic: 'images/profile_alex.png',
            text: 'Your driver Ahmed always performs reversed commands. If you swear or compliment, he performs commands normally. If you swear or compliment once more, he performs commands reversely.',
            name: 'alex'
        }),
    yappie: new LevelInfo(() => new EchoDriver(), level1, 'yappie',
        {
            pic: 'images/profile_yappie.png',
            text: `Your driver Jessica always turns left if he doesn't hear any command. Command "right" makes he move forward. Command "left" makes him turn right. Classic Jessica.`,
            name: 'yappie'
        }),
    misha: new LevelInfo(() => new EchoDriver(), level1, 'misha',
        {
            pic: 'images/profile_misha.png',
            text: 'Your driver Misha always performs reversed commands. He had a tough childhood.',
            name: 'misha'
        }),
    elon: new LevelInfo(() => new EchoDriver(), level1, 'elon',
        {
            pic: 'images/profile_elon.png',
            text: "Your driver Floyd always performs your penultimate command. His first move is random.",
            name: 'elon'
        }),
    lloyd: new LevelInfo(() => new EchoDriver(), level1, 'lloyd',
        {
            pic: 'images/profile_elon.png',
            text: "Your driver Elon always goes with perfect route ignoring all your commands. He's out of control.",
            name: 'elon'
        })
}

export type LevelResults = {
    stars: number,
    name: string
}
