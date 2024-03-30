import { assertEquals, } from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
Deno.test('Board.GetColorMoves should return 20 moves for the starting position', () => {
    const board = new Board();
    const moves = board.GetColorMoves('white');
    assertEquals(moves.length, 20);
});
Deno.test('Board.GetColorMoves should return the list of moves for the given color', () => {
    const board = new Board('k7/8/8/8/8/8/P7/K7');
    const moves = board.GetColorMoves('white');
    const movesArray = moves.map(move => move.to);
    const expectedMoves = board.GetMoves([0, 0]);
    expectedMoves.push(...board.GetMoves([1, 0]));
    assertEquals(new Set(movesArray), new Set(expectedMoves.map(move => move.to)));
});
Deno.test('Board.GetColorMoves should return an empty list if the color is checkmate', () => {
    const board = new Board('k6R/7R/8/8/8/8/8/K7');
    const moves = board.GetColorMoves('black');
    assertEquals(moves.length, 0);
});
Deno.test('Board.GetColorMoves should return an empty list if the color is stalemate', () => {
    const board = new Board('k7/7R/8/8/8/8/8/KR6');
    const moves = board.GetColorMoves('black');
    assertEquals(moves.length, 0);
});
