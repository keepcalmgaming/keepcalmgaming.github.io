export enum DayOfWeek { Monday = 1, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday }
export enum Roll { One = 1, Two, Three, Four, Five, Six }


export function getNextDow(dow: DayOfWeek): DayOfWeek {
	if (dow == DayOfWeek.Sunday) {
		return DayOfWeek.Monday
	} else {
		return dow + 1
	}
}

const dowNames = [
	'Zerday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday'
]

struct Day {
    var date: Date
    var rolledNumbers: [Int] = []
    var currentNumber: Int?
    var isWin = false
    var gaveCashback = false
}

export class Day {
	dayOfWeek: DayOfWeek
	dayOfMonth: number
	monthName: string
	rolls: Roll[]
	currentRoll: Roll
	isWin: boolean

	constructor(dayOfMonth, dayOfWeek, monthName) {
		this.dayOfMonth = dayOfMonth
		this.dayOfWeek = dayOfWeek
		this.monthName = monthName;
		this.rolls = []
	}

	public getName(): string {
		return dowNames[this.dayOfWeek] + ', the ' + this.dayOfMonth + 'th of '+this.monthName;
	}
}

export class Month {
	days: Day[]
	monthName: string

	constructor(monthName: string, days: number, firstDay: DayOfWeek) {
		console.log('Month constructor called with ', monthName, days, firstDay)
		this.monthName = monthName
		this.days = [new Day(1, firstDay, monthName)]

		let curDayOfWeek = getNextDow(firstDay)
		for (let i = 1; i < days; i++) {
			let day = new Day(i+1, curDayOfWeek, monthName)
			this.days.push(day)
			curDayOfWeek = getNextDow(curDayOfWeek)
		}
	}
}

export class Calendar {
	months: Month[]
	days: Day[]

	constructor() {
		this.months = [new Month('Whatember', 56, DayOfWeek.Monday)]
		this.days = []
		for (let i=0; i<this.months.length; i++) {
			this.days = this.days.concat(this.months[i].days)
		}
	}

	public printAll() {
		for (let i=0; i<this.days.length; i++) {
			console.log(this.days[i].getName())
		}
	}
}