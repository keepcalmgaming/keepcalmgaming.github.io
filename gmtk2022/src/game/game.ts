import { Calendar, Roll, Day, DayOfWeek } from './calendar'
import * from './powerup'

BalanceStats = {
	sundayBonus: 40
}

export class CalenGame {
	public points: number = 0
	public totalPoints: number: 0
	public diceValue: Roll = null
	// public diceValues: Roll[] = []
	public currentDay: Day

	public isFinished = false

	constructor() {
		this.calendar = new Calendar()
		this.calIndex = 0
		this.currentDay = this.calendar.days[0]
	}

	public addPoints(amount) {
		this.points += amount
		this.totalPoints += amount
	}

	public nextDay() {
    this.diceValue = null
    this.diceValues = []

    this.currentDay.diceValues = this.diceValues
    this.currentDay.diceValue = this.diceValue

    // this.diceValues = []
    this.diceValue = null

    this.calIndex++
    this.currentDay = this.calendar.days[this.calIndex]

    if (this.currentDay.dayOfWeek == DayOfWeek.Sunday) {
    	this.addPoints(BalanceStats.sundayBonus)
    }
  }

  public checkWin() {

  }

  public addRoll(r: Roll) {
  	this.diceValue = r
  	// this.diceValues.append(r)
  	checkWin()
  }

  public rollTheDice() {
  	this.addRoll(Math.floor(Math.random() * 6))
  }

  public rollPseudoRandom() {
  	let rolls = [Roll.ONE, Roll.TWO, Roll.THREE, Roll.FOUR, Roll.FIVE, Roll.SIX]
  	let possibleRolls = []
  	for (let i = 0; i<rolls.length; i++) {
  		if (!this.diceValues.includes(rolls[i])) {
  			possibleRolls.push(rolls[i])
  		}
  	}
  	let l = possibleRolls.length
  	if (l > 0) {
  		let index = Math.floor(Math.random() * l)
  		this.addRoll(possibleRolls[index])
  	}
  }
}


//     func rollTheDicePseudorandomly() {
//         var possibleValues = [1, 2, 3, 4, 5, 6]
//         for rolled in currentDay.rolledNumbers {
//             if let index = possibleValues.firstIndex(of: rolled) {
//                 possibleValues.remove(at: index)
//             }
//         }
//         if talents.contains(Talent.teaMaster) && currentDay.date.isTeaDay && self.diceValue != nil {
//             if possibleValues.count > 1 {
//                 possibleValues = [possibleValues.randomElement() ?? neededScore, neededScore]
//             }
//         }

//         guard possibleValues.isEmpty == false else { return }

//         self.diceValue = possibleValues.randomElement() ?? Int.random(in: 1...6)
//         self.diceValues = nil
//         checkWin()

//         checkCardCount()
//     }

//     func rollTwoDices() {
//         let v1 = Int.random(in: 1...6)
//         let v2 = Int.random(in: 1...6)
//         self.diceValues = [v1, v2]
//         self.diceValue = nil
//         checkWin()

//         checkCardCount()
//     }

//     func upwardRoll() {
//         if let diceValue = diceValue, diceValue < 6 {
//             self.diceValue = Int.random(in: (diceValue + 1)...6)
//             self.diceValues = nil
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last, min(v1, v2) < 6 {
//             self.diceValue = Int.random(in: (min(v1, v2) + 1)...6 )
//             self.diceValues = nil
//             checkWin()
//         }

//         checkCardCount()
//     }

//     func downwardRoll() {
//         if let diceValue = diceValue, diceValue > 1 {
//             self.diceValue = Int.random(in: 1...diceValue - 1)
//             self.diceValues = nil
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last, max(v1, v2) > 1 {
//             self.diceValue = Int.random(in: 1...max(v1, v2) - 1)
//             self.diceValues = nil
//             checkWin()
//         }

//         checkCardCount()
//     }

//     func upsideDown() {
//         if let diceValue = diceValue {
//             self.diceValue = 7 - diceValue
//             checkWin()
//         } else if let diceValues = diceValues, let v1 = diceValues.first, let v2 = diceValues.last {
//             self.diceValues = [7 - v1, 7 - v2]
//             checkWin()
//         }

//         checkCardCount()
//     }

//     var neededScore: Int {
//         let dayName = self.currentDay.date.formatted(.day)
//         switch dayName {
//         case "Monday":
//             return 1
//         case "Tuesday":
//             return 2
//         case "Wednesday":
//             return 3
//         case "Thursday":
//             return 4
//         case "Friday":
//             return 5
//         case "Saturday":
//             return 6
//         default:
//             return 0
//         }
//     }

//     func checkWin() {
//         if let diceValue = diceValue {
//             self.currentDay.rolledNumbers.append(diceValue)
//             if diceValue == neededScore {
//                 win()
//             }
//         } else if let diceValues = diceValues {
//             guard let v1 = diceValues.first, let v2 = diceValues.last else { return }
//             if v1 == neededScore || v2 == neededScore || v1 + v2 == neededScore {
//                 win()
//             }
//         }
//     }

//     func win() {
//         if currentDay.isWin == false {
//             self.currentDay.isWin = true
//             if talents.contains(Talent.compulsiveHoarder) {
//                 points += BalanceStats.win / 2
//                 totalPoints += BalanceStats.win / 2
//                 powerUps.append(PowerUpItem(type: PowerUp.all.randomElement() ?? PowerUp.reroll))
//             } else {
//                 points += BalanceStats.win
//                 totalPoints += BalanceStats.win
//             }
//             Haptic.play(.win)
//         }

//         if pastDays.count >= 5 {
//             let count = pastDays.suffix(5).filter({ $0.isWin }).count
//             if count == 5 {
//                 //it's streak!
//                 points += BalanceStats.winStreak
//                 totalPoints += BalanceStats.winStreak
//             }
//         }
//     }

//     func countOfBoughtPowerUpsOfType(_ up: PowerUp) -> Int {
//         return Game.shared.powerUps.filter({ $0.type == up }).count
//     }

//     func usePowerUp(_ powerUp: PowerUp) {
//         guard let index = powerUps.firstIndex(where: ({ $0.type == powerUp})) else { return }
//         powerUps.remove(at: index)

//         switch powerUp {
//         case .reroll:
//             rollTheDice()
//         case .pseudorandomReroll:
//             rollTheDicePseudorandomly()
//         case .twoDices:
//             rollTwoDices()
//         case .upwardReroll:
//             upwardRoll()
//         case .downwardReroll:
//             downwardRoll()
//         case .upsideDown:
//             upsideDown()
//         }
//     }

//     func isDateWasWon(date: Date) -> Bool {
//         guard let day = pastDays.first(where: { Calendar.current.isDate(date, inSameDayAs: $0.date) }) else { return false }
//         return day.isWin
//     }

//     var talentsToChoose: [Talent] {
//         var possibleTalents = Talent.all
//         for t in talents {
//             if let index = possibleTalents.firstIndex(of: t) {
//                 possibleTalents.remove(at: index)
//             }
//         }

//         return Array(possibleTalents.shuffled().prefix(3))
//     }
// }