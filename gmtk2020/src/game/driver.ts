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

    private direction = Direction.Forward;
    public getNextStep(): Direction {
        return this.direction
    }

    public flushDirection(): void {
        this.direction = Direction.Forward
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
        this.flushDirection();
        return result
    }

    public flushDirection():void {
        this.nextDirection = Direction.Forward
    }
}

export class Misha implements Driver {
    public car: Car = new Car()
    private direction: Direction = Direction.Forward

    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                this.direction = Direction.Right
                console.log('RIGHT')
                break;
            case DriverInput.Right:
                this.direction = Direction.Left
                console.log('LEFT')
                break;
            case DriverInput.Cool:
                console.log('Misha says: well, technically its not cool, but i got your point, thank you.')
                break;
            case DriverInput.Crap:
                console.log('Misha says: indeed')
                break;
        }
    }

    public getNextStep(): Direction {
        return this.direction
    }

    public flushDirection(): void {
        this.direction = Direction.Forward
    }
}

export class Ahmed implements Driver {
    public car: Car = new Car()
    private isTriggered: boolean = false;
    private direction: Direction = Direction.Forward

    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                this.direction = isTriggered ? Direction.Left : Direction.Right
                break;
            case DriverInput.Right:
                this.direction = isTriggerd ? Direction.Left : Direction.Right
                break;
            case DriverInput.Cool:
                isTriggered = !isTriggered
                break;
            case DriverInput.Crap:
                isTriggered = !isTriggered
                break;
        }
    }

    public getNextStep(): Direction {
        return this.direction
    }

    public flushDirection(): void {
        this.direction = Direction.Forward
        this.isTriggered = false
    }
}

// 1. Your driver Danny listens carefully to all your commands and executes them. He is a reliable driver. Others are not.

// 2. Your driver Misha always performs reversed commands. He had a tough childhood.

// 2.5. Your driver Ahmed always performs reversed commands. If you swear or compliment, he performs commands normally. If you swear or compliment once more, he performs commands reversely. 

// 3. Your driver Jessica always turns left if he doesn't hear any command. Command "right" makes he move forward. Command "left" makes him turn right. Classic Jessica.

// 4. Your driver Lloyd always performs your penultimate command. His first move is random.

// 5. Your driver Elon always goes with perfect route ignoring all your commands. He's out of control.

export class Jessica implements Driver {
    public car: Car = new Car()
    private direction: Direction = Direction.Left;

    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                this.direction = Direction.Forward
                break;
            case DriverInput.Right:
                this.direction = Direction.Forward
                break;
            case DriverInput.Cool:
                console.log('Thank you!')
                break;
            case DriverInput.Crap:
                console.log('Well that wasn\'t so nice.')
                break;
        }
    }

  public getNextStep(): Direction {
    return this.direction
  }

  public flushDirection(): void {
      this.direction = Direction.Left
  }
}

export class Lloyd implements Driver {
    public car: Car = new Car()
    private directions = [Direction.Forward, Direction.Left, Direction.Right]
    private direction: Direction = directions[Math.floor(Math.random() * directions.length)]
    private previous: Direction = direction;


    public input(di: DriverInput) {
        switch (di) {
            case DriverInput.Left:
                this.direction = this.previous
                this.previous = Direction.Left
                break;
            case DriverInput.Right:
                this.direction = this.previous
                this.previous = Direction.Left
                break;
            case DriverInput.Cool:
                console.log('Thank you!')
                break;
            case DriverInput.Crap:
                console.log('Well that wasn\'t so nice.')
                break;
        }
    }

    public getNextStep(): Direction {
      return this.direction
    }

    public flushDirection(): void {
        this.direction = this.directions[Math.floor(Math.random() * directions.length)]
    }
}
