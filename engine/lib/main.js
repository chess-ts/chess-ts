import { Board } from './board/Board.ts';
const notationToCoords = (notation) => {
    const [x, y] = notation.split('');
    return [parseInt(y) - 1, x.charCodeAt(0) - 97];
};
const board = new Board('k7/7P/8/8/8/8/8/7K');
while (true) {
    console.log(board.ToString());
    const input = prompt('>');
    if (!input || input === 'exit') {
        console.log(board.GetUCI());
        Deno.exit(1);
    }
    else if (input.length !== 4) {
        board.GodMode(input);
        continue;
    }
    const [from, to] = [input.split('')[0] + input.split('')[1], input.split('')[2] + input.split('')[3]];
    try {
        console.log('Status:', board.Move(notationToCoords(from), notationToCoords(to)));
    }
    catch (e) {
        console.log(e.message);
        continue;
    }
}
