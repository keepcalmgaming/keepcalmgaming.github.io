import { Driver, EchoDriver, Misha, Ahmed, Jessica, Lloyd } from 'driver'

export enum DriverInput { Left, Right, Cool, Crap }
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
    start: { x: 4, y: 0 },
    finish: { x: 0, y: 7},
    flags: [{ x: 4, y: 1}, { x: 1, y: 3}, { x: 7, y: 1}],
    direction: Movement.Up
} //Danny

let level2: LevelSetup = {
    start: { x: 0, y: 0 },
    finish: { x: 8, y: 7},
    flags: [{ x: 3, y: 3}, { x: 5, y: 5}, { x: 8, y: 1}],
    direction: Movement.Up
} //Misha

let level3: LevelSetup = {
    start: { x: 7, y: 0 },
    finish: { x: 0, y: 8},
    flags: [{ x: 5, y: 3}, { x: 8, y: 5}, { x: 0, y: 1}],
    direction: Movement.Up
} //Ahmed

let level4: LevelSetup = {
    start: { x: 3, y: 3 },
    finish: { x: 6, y: 6},
    flags: [{ x: 0, y: 0}, { x: 2, y: 5}, { x: 8, y: 7}],
    direction: Movement.Up
} //Jessica

let level5: LevelSetup = {
    start: { x: 4, y: 0 },
    finish: { x: 7, y: 0},
    flags: [{ x: 1, y: 6}, { x: 6, y: 3}, { x: 3, y: 7}],
    direction: Movement.Up
} //Floyd

let level6: LevelSetup = {
    start: { x: 1, y: 1 },
    finish: { x: 0, y: 0},
    flags: [{ x: 3, y: 3}, { x: 4, y: 5}, { x: 7, y: 7}],
    direction: Movement.Up
} //Elon


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


export let LevelOrder = ['danny', 'misha', 'alex', 'yappie', 'elon']
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
    alex: new LevelInfo(() => new Ahmed(), level3, 'alex',
        {
            pic: 'images/profile_alex.png',
            text: 'Your driver Ahmed always performs reversed commands. If you swear or compliment, he performs commands normally. If you swear or compliment once more, he performs commands reversely.',
            name: 'alex'
        }),
    yappie: new LevelInfo(() => new Jessica(), level4, 'yappie',
        {
            pic: 'images/profile_yappie.png',
            text: `Your driver Jessica always turns left if he doesn't hear any command. Command "right" makes he move forward. Command "left" makes him turn right. Classic Jessica.`,
            name: 'yappie'
        }),
    misha: new LevelInfo(() => new Misha(), level2, 'misha',
        {
            pic: 'images/profile_misha.png',
            text: 'Your driver Misha always performs reversed commands. He had a tough childhood.',
            name: 'misha'
        }),
    elon: new LevelInfo(() => new EchoDriver(), level6, 'elon',
        {
            pic: 'images/profile_elon.png',
            text: "Your driver Floyd always performs your penultimate command. His first move is random.",
            name: 'elon'
        }),
    lloyd: new LevelInfo(() => new Lloyd(), level5, 'lloyd',
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
