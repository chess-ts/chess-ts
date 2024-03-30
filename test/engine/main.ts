import { Board } from './board/Board.ts';
import { Coords } from './tooling/types.ts';

const notationToCoords = (notation: string): Coords => {
	const [x, y] = notation.split('');
	return [parseInt(y) - 1, x.charCodeAt(0) - 97] as Coords;
}

const board = new Board('k7/7P/8/8/8/8/8/7K');


while(true) {
	console.log(board.ToString());
	const input = prompt('>');
	if(!input || input === 'exit') {
		console.log(board.GetUCI());
		break;
	} else if(input && input.length !== 4) {
		board.GodMode(input);
		continue;
	}
	if(input) {
		const [from, to] = [input.split('')[0] + input.split('')[1], input.split('')[2] + input.split('')[3]];
		try {
			console.log('Status:', board.Move(notationToCoords(from), notationToCoords(to)));
		} catch(_) {
			continue;
		}
	}
}