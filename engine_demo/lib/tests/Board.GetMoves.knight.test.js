import { assertEquals } from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
Deno.test('Board.GetMoves should return the possible moves for a KNIGHT MOVE', () => {
    const board = new Board('k7/8/8/8/4N3/8/8/7K');
    const moves = board.GetMoves([3, 4]);
    const movesArray = moves.map(move => move.to);
    assertEquals(new Set(movesArray), new Set([
        [5, 5],
        [4, 6],
        [5, 3],
        [2, 6],
        [2, 2],
        [1, 5],
        [1, 3],
        [4, 2]
    ]));
});
