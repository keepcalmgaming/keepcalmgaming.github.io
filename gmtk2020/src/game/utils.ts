import { Driver, SimpleDriver, EchoDriver } from 'driver'

export enum DriverInput { Left, Right, Cool, Crap}
export enum Direction { Left, Right, Forward }

export type Coords = {
    x: number,
    y: number
}

export type LevelSetup = {
    start: Coords,
    finish: Coords,
    flags: Coords[]
}

export class LevelInfo {
    constructor(
        public driverConstructor: () => Driver,
        public level: LevelSetup
    ) { }
}

let level1: LevelSetup = {
    start: { x: 1, y: 1 },
    finish: { x: 5, y: 5},
    flags: [{ x: 3, y: 3}, { x: 3, y: 3}, { x: 3, y: 3}]
}

export let LevelsSettings: LevelInfo[] = [
    new LevelInfo(() => new EchoDriver(), level1),
    new LevelInfo(() => new SimpleDriver(), level1)
]
