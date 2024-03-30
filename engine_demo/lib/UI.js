import { Engine } from './Engine.ts';
const notationToCoords = (notation) => {
    const [x, y] = notation.split('');
    return [parseInt(y) - 1, x.charCodeAt(0) - 97];
};
let uci = '';
while (true) {
    console.log(Engine.BoardToString(uci));
    const input = prompt('>');
    if (!input || input === 'exit') {
        Deno.exit(1);
    }
    const [from, to] = [input.split('')[0] + input.split('')[1], input.split('')[2] + input.split('')[3]];
    try {
        const move_res = Engine.Move(uci, notationToCoords(from), notationToCoords(to));
        uci = move_res.uci;
        console.log('Status:', move_res.status);
    }
    catch (e) {
        console.log(e.message);
        continue;
    }
}
