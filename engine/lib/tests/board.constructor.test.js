import { assertEquals, assertNotEquals, assertThrows } from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
Deno.test('Board.constructor should create a non-null board', () => {
    const board = new Board();
    assertNotEquals(board, null);
});
Deno.test('Board.constructor should create a board default position', () => {
    const board = new Board();
    assertEquals(board.GetFen(), 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
});
Deno.test('Board.constructor should create a board with a custom position', () => {
    const board = new Board('k7/8/8/8/8/8/8/7K');
    assertEquals(board.GetFen(), 'k7/8/8/8/8/8/8/7K');
});
Deno.test('Board.constructor should throw \'Invalid FEN\' if the FEN is invalid', () => {
    assertThrows(() => new Board('k7/8/8/8/8/8/8/7K/'), 'Invalid FEN');
});
Deno.test('Board.constructor should throw \'Unknown piece\' if the FEN contains an invalid piece', () => {
    assertThrows(() => new Board('k7/8/8/8/8/8/8/6kw'), 'Unknown piece');
});
