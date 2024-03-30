import { assertEquals } from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
Deno.test('Board.GetMoves should return the possible moves for a QUEEN MOVE', () => {
    const board = new Board('k7/8/8/8/3Q4/8/8/7K');
    const moves = board.GetMoves([3, 3]);
    const movesArray = moves.map(move => move.to);
    assertEquals(new Set(movesArray), new Set([
        [0, 0],
        [1, 1],
        [2, 2],
        [4, 4],
        [5, 5],
        [6, 6],
        [7, 7],
        [0, 6],
        [1, 5],
        [2, 4],
        [4, 2],
        [5, 1],
        [6, 0],
        [4, 3],
        [5, 3],
        [6, 3],
        [7, 3],
        [2, 3],
        [1, 3],
        [0, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7],
        [3, 2],
        [3, 1],
        [3, 0]
    ]));
});
