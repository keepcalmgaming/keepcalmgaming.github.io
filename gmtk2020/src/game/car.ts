import { Direction, DriverInput } from 'utils'
import { Driver } from 'driver'

export class Car {
    public speed: number = 0;
    public driver?: Driver;

    public setDriver(d: Driver): void {
        this.driver = d
        d.car = this
    }

    public setSpeed(speed: number) {
        this.speed = speed
    }
}