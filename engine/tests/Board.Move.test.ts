import {
	assert,
	assertEquals,
	assertThrows
} from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';
import { assertArrayIncludes } from 'https://deno.land/std@0.214.0/assert/assert_array_includes.ts';

Deno.test('Board.Move should throw \'No piece at this position\' if we try to move an empty square', () => {
	const board = new Board();
	assertThrows(() => board.Move([3, 3], [4, 4]), 'No piece at this position');
});

Deno.test('Board.Move should throw \'Invalid move\' and not move the piece if we try to make an illegal move', () => {
	const board = new Board();
	assertThrows(() => board.Move([0, 0], [1, 0]), 'Invalid move');
	assert(!board.last_move);
	assertEquals(board.move_history.length, 0);
});

Deno.test('Board.Move should move the piece to the new position', () => {
	const board = new Board();
	board.Move([1, 0], [2, 0]);
	assertEquals(board.GetFen(), 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR');
});

Deno.test('Board.Move should promote the pawn if it reaches the last rank', () => {
	const board = new Board('k7/8/8/8/8/8/p7/7K');
	board.Move([1, 0], [0, 0], 'rook');
	assertEquals(board.GetFen(), 'k7/8/8/8/8/8/8/r6K');
});

Deno.test('Board.Move should not promote the pawn if it reaches the last rank and we don\'t specify the promotion', () => {
	const board = new Board('k7/8/8/8/8/8/p7/7K');
	board.Move([1, 0], [0, 0]);
	assertEquals(board.GetFen(), 'k7/8/8/8/8/8/8/q6K');
});

Deno.test('Board.Move can make the player castle kingside', () => {
	const board = new Board('r3k2r/8/8/8/8/8/8/R3K2R');
	board.Move([0, 4], [0, 6]);
	assertEquals(board.GetFen(), 'r3k2r/8/8/8/8/8/8/R4RK1');
});

Deno.test('Board.Move can make the player castle queenside', () => {
	const board = new Board('r3k2r/8/8/8/8/8/8/R3K2R');
	board.Move([0, 4], [0, 2]);
	assertEquals(board.GetFen(), 'r3k2r/8/8/8/8/8/8/2KR3R');
});

Deno.test('Board.Move should update the last_move property', () => {
	const board = new Board();
	board.Move([1, 0], [3, 0]);
	assert(board.last_move);
});

Deno.test('Board.Move should update the move_history property', () => {
	const board = new Board();
	board.Move([1, 0], [3, 0]);
	assertEquals(board.move_history.length, 1);
	assertArrayIncludes(board.move_history, [board.last_move]);
});