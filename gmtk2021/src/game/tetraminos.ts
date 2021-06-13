export type Tetramino = {
	b: any,
	next: string
	moveLeft?: number
}

const TETRAMINOS = {
	palka: {
		b: [[0, 0], [0, 1], [0, 2], [0, 3]],
		next: 'horpalka',
		moveLeft: 2
	},
	// 'horpalka': {next: 'palka'},
	t: {
		b: [[0, 0], [1, 0], [2, 0], [1, 1]],
		next: 't-r'
	},
	// 't-r': {next: 't-u'},
	// 't-u': {next: 't-r'},
	z: {
		b: [[0, 0], [0, 1], [1, 1], [1, 2]],
		next: 'horz'
	},
	// horz: { next: 'z'}
	n: {
		b: [[1, 0], [1, 1], [0, 1], [0, 2]],
		next: 'horn'
	},
	// horn: { next: 'n' },
	square: {
		b: [[0, 0], [0, 1], [1, 0], [1, 1]],
		next: 'square'
	},
	// j: {next: 'horj'}
	// horj: {next: 'j'}
	// l: {next: 'horl'}
	// horl: {next: 'l'}
}

export class TGenerator {
	public static get(name): Tetramino {
		return TETRAMINOS[name]
	}

	public static random(): string {
    let keys = Object.keys(TETRAMINOS);
    return keys[ keys.length * Math.random() << 0];
	}
}