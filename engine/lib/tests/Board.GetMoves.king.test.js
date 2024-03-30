import { assertEquals, assertNotEquals, assertArrayIncludes } from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
Deno.test('Board.GetMoves should return the possible moves for a KING MOVE', () => {
    const board = new Board('k7/8/8/8/3K4/8/8/8');
    const moves = board.GetMoves([3, 3]);
    const movesArray = moves.map(move => move.to);
    assertEquals(new Set(movesArray), new Set([
        [4, 3],
        [4, 4],
        [3, 4],
        [2, 4],
        [2, 3],
        [2, 2],
        [3, 2],
        [4, 2]
    ]));
});
Deno.test('Board.GetMoves should return the possible moves for KINGSIDE CASTLING', () => {
    const board = new Board('r3k2r/8/8/8/8/8/8/R3K2R');
    const moves = board.GetMoves([0, 4]);
    const movesArray = moves.map(move => move.to);
    assertArrayIncludes(movesArray, [[0, 6]]);
});
Deno.test('Board.GetMoves should return the possible moves for QUEENSIDE CASTLING', () => {
    const board = new Board('r3k2r/8/8/8/8/8/8/R3K2R');
    const moves = board.GetMoves([0, 4]);
    const movesArray = moves.map(move => move.to);
    assertArrayIncludes(movesArray, [[0, 2]]);
});
Deno.test('Board.GetMoves should not return KINGSIDE CASTLING if one of the squares is attacked', () => {
    const board = new Board('k4r2/8/8/8/8/8/8/R3K2R');
    const moves = board.GetMoves([0, 4]);
    const movesArray = moves.map(move => move.to);
    for (const move of movesArray) {
        assertNotEquals(move, [0, 6]);
    }
});
Deno.test('Board.GetMoves should not return QUEENSIDE CASTLING if one of the squares is attacked', () => {
    const board = new Board('k2r4/8/8/8/8/8/8/R3K2R');
    const moves = board.GetMoves([0, 4]);
    const movesArray = moves.map(move => move.to);
    for (const move of movesArray) {
        assertNotEquals(move, [0, 2]);
    }
});
