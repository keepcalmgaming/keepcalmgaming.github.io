import { Direction, DriverInput, Movement } from 'utils'
import { Driver } from 'driver'

export class Car {
    public speed: number = 0;
    public horizontalSpeed: number = 0;
    public verticalSpeed: number = 0;
    public driver?: Driver;

    public setDriver(d: Driver): void {
        this.driver = d
        d.car = this
    }

    public setSpeed(speed: number) {
        this.speed = speed
    }

    public setMovementDirection(m: Movement): void {
        switch(m) {
            case Movement.Down:
                this.verticalSpeed = this.speed;
                break;
            case Movement.Up:
                this.verticalSpeed = -this.speed;
                break;
            case Movement.Right:
                this.horizontalSpeed = this.speed;
                break;
            case Movement.Left:
                this.horizontalSpeed = -this.speed;
                break;
        }
    }

    public getNextStep(): Direction {
        return this.driver ? this.driver.getNextStep() : Direction.Forward
    }

    public flushDirection(): void {
        this.driver.flushDirection()
    }
 
    public getMovementDirection(): Movement {
        if (this.horizontalSpeed > 0) {
            return Movement.Right
        } else if (this.horizontalSpeed < 0) {
            return Movement.Left
        } else {
            if (this.verticalSpeed > 0) {
                return Movement.Down
            } else {
                return Movement.Up
            }
        }
    }
}