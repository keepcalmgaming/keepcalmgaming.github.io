import { DriverInput, Direction } from 'utils'
import { Car } from 'car'

export interface Driver {
    car: Car

    input(di: DriverInput): void

    getNextStep(): Direction
}

export class EchoDriver implements Driver {
    public car = new Car()

    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                console.log('ECHO LEFT')
                break;
            case DriverInput.Right:
                console.log('ECHO RIGHT')
                break;
            case DriverInput.Cool:
                console.log('ECHO COOL')
                break;
            case DriverInput.Crap:
                console.log('ECHO CRAP')
                break;
        }
    }

    public getNextStep(): Direction {
        return Direction.Forward
    }
}

export class SimpleDriver implements Driver {
    public car: Car = new Car()

    nextDirection: Direction = Direction.Forward

    public input(di: DriverInput): void {
        switch (di) {
            case DriverInput.Left:
                this.nextDirection = Direction.Left
                break;
            case DriverInput.Right:
                this.nextDirection = Direction.Right
                break;
            case DriverInput.Cool:
                this.car.setSpeed(this.car.speed + 1)
                break;
            case DriverInput.Crap:
                let newSpeed = this.car.speed - 1
                if (newSpeed >= 0) this.car.setSpeed(this.car.speed - 1)
                break;
        }
    }

    public getNextStep(): Direction {
        let result = this.nextDirection
        this.nextDirection = Direction.Forward
        return result
    }
}