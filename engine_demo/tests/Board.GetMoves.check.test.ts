import {
	assertEquals,
} from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';

Deno.test('Board.GetMoves should return the possible moves for a KING MOVE (AVOIDING CHECK)', () => {
	const board = new Board('kr6/8/8/8/K7/8/8/8');
	const moves = board.GetMoves([3, 0]);
	const movesArray = moves.map(move => move.to);
	assertEquals(new Set(movesArray), new Set([
		[4, 0],
		[2, 0]
	]));
});

Deno.test('Board.GetMoves should return NO MOVE for a PINNED KNIGHT', () => {
	const board = new Board('rk6/8/8/8/8/8/N7/K7');
	const moves = board.GetMoves([1, 0]);
	assertEquals(moves.length, 0);
});

Deno.test('Board.GetMoves should return NO MOVE for a PINNED BISHOP', () => {
	const board = new Board('rk6/8/8/8/8/8/B7/K7');
	const moves = board.GetMoves([1, 0]);
	assertEquals(moves.length, 0);
});

Deno.test('Board.GetMoves should return NO MOVE for a PINNED ROOK', () => {
	const board = new Board('1k6/8/8/8/8/2b5/1R6/K7');
	const moves = board.GetMoves([1, 0]);
	assertEquals(moves.length, 0);
});

Deno.test('Board.GetMoves should return ONE MOVE for a PINNED QUEEN (capture the piece)', () => {
	const board = new Board('k7/8/8/8/8/2b5/1Q6/K7');
	const moves = board.GetMoves([1, 1]);
	const movesArray = moves.map(move => move.to);
	assertEquals(new Set(movesArray), new Set([
		[2, 2]
	]));
});

Deno.test('Board.GetMoves should return ONE MOVE for a PINNED BISHOP (capture the piece)', () => {
	const board = new Board('k7/8/8/8/8/2b5/1B6/K7');
	const moves = board.GetMoves([1, 1]);
	const movesArray = moves.map(move => move.to);
	assertEquals(new Set(movesArray), new Set([
		[2, 2]
	]));
});

Deno.test('Board.GetMoves should return ONE MOVE for a PINNED ROOK (capture the piece)', () => {
	const board = new Board('k7/8/8/8/8/r7/R7/K7');
	const moves = board.GetMoves([1, 0]);
	const movesArray = moves.map(move => move.to);
	assertEquals(new Set(movesArray), new Set([
		[2, 0]
	]));
});