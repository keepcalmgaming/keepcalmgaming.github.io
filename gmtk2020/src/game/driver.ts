import { DriverInput, Direction } from 'utils'
import { Car } from 'car'

export interface Driver {
    car: Car

    input(di: DriverInput): void

    getNextStep(): Direction

    flushDirection(): void
}

export class EchoDriver implements Driver {
    public car = new Car()

    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                this.direction = Direction.Left
                console.log('ECHO LEFT')
                break;
            case DriverInput.Right:
                this.direction = Direction.Right
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

    private direction = Direction.Right;
    public getNextStep(): Direction {
        return this.direction
    }

    public flushDirection(): void {
        this.direction = Direction.Forward
    }
}