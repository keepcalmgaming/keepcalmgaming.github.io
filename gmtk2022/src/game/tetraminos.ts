export type Tetramino = {
	b: any,
	next: string
	moveLeft?: number
}

const TETRAMINOS = {
	palka: {
		b: [[0, 0], [0, 1], [0, 2], [0, 3]],
		next: 'horpalka'
	},
	horpalka: {
		b: [[0, 0], [1, 0], [2, 0], [3, 0]]
		next: 'palka'
	},
	t: {
		b: [[0, 0], [1, 0], [2, 0], [1, 1]],
		next: 'tr'
	},
	tr: {
		b: [[0, 0], [0, 1], [1, 1], [0, 2]],
		next: 'tu'
	},
	tu: {
		b: [[0, 1], [1, 0], [1, 1], [2, 1]],
		next: 'tl'
	},
	tl: {
		b: [[1, 0], [1, 1], [0, 1], [1, 2]]
		next: 't'
	}
	z: {
		b: [[0, 0], [0, 1], [1, 1], [1, 2]],
		next: 'horz'
	},
	horz: {
		b: [[0, 1], [1, 1], [1, 0], [2, 0]]
		next: 'z'
	},
	n: {
		b: [[1, 0], [1, 1], [0, 1], [0, 2]],
		next: 'horn'
	},
	horn: {
		b: [[0, 0], [1, 0], [1, 1], [2, 1]],
		next: 'n'
	},
	square: {
		b: [[0, 0], [0, 1], [1, 0], [1, 1]],
		next: 'square'
	},
	l: {
		b: [[0, 0], [0, 1], [0, 2], [1, 2]]
		next: 'lr'
	},
	lr: {
		b: [[0, 1], [1, 1], [2, 1], [2, 0]]
		next: 'lu'
	},
	lu: {
		b: [[0, 0], [1, 0], [1, 1], [1, 2]],
		next: 'll'
	},
	ll: {
		b: [[0, 1], [0, 0], [1, 0], [2, 0]],
		next: 'l'
	},
	j: {
		b: [[0, 2], [1, 2], [1, 1], [1, 0]],
		next: 'jr'
	},
	jr: {
		b: [[0, 0], [1, 0], [2, 0], [2, 1]],
		next: 'ju'
	},
	ju: {
		b: [[0, 2], [0, 1], [0, 0], [1, 0]],
		next: 'jl'
	},
	jl: {
		b: [[0, 0], [0, 1], [1, 1], [2, 1]],
		next: 'j'
	}
}

export class TGenerator {
	public static get(name): Tetramino {
		return TETRAMINOS[name]
	}

	public static next(name): string {
		if (TETRAMINOS[name] == undefined) {
			console.error('next tetramino not found', name)
			return undefined
		}
		return TETRAMINOS[name].next
	}

	public static random(): string {
    let keys = Object.keys(TETRAMINOS);
    return keys[ keys.length * Math.random() << 0];
	}
}