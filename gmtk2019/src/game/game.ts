export class Game {
    private LIVES = 20

    public lives: number
    public X: number
    public Y: number

    constructor(x: number, y: number) {
        this.lives = this.LIVES
        this.X = x
        this.Y = y
    }
}