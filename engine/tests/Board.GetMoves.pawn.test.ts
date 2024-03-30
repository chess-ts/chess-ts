import {
	assertArrayIncludes
} from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';

Deno.test('Board.GetMoves should return the possible moves for a PAWN MOVE', () => {
	const board = new Board();
	const moves = board.GetMoves([1, 4]);
	const movesArray = moves.map(move => move.to);
	assertArrayIncludes(movesArray, [[2, 4]]);
});

Deno.test('Board.GetMoves should return the possible moves for a PAWN DOUBLE MOVE', () => {
	const board = new Board();
	const moves = board.GetMoves([1, 4]);
	const movesArray = moves.map(move => move.to);
	assertArrayIncludes(movesArray, [[3, 4]]);
});

Deno.test('Board.GetMoves should return the possible moves for a PAWN CAPTURE', () => {
	const board = new Board('rnbqkbnr/pppppppp/8/8/8/7p2/PPPPPPPP/RNBQKBNR');
	const moves = board.GetMoves([1, 4]);
	const movesArray = moves.map(move => move.to);
	assertArrayIncludes(movesArray, [[2, 5]]);
});

Deno.test('Board.GetMoves should return the possible moves for a PAWN EN PASSANT', () => {
	const board = new Board('rnbqkbnr/pppppppp/8/1P6/8/8/P1PPPPPP/RNBQKBNR');
	board.Move([6, 0], [4, 0]);
	const moves = board.GetMoves([4, 1]);
	const movesArray = moves.map(move => move.to);
	assertArrayIncludes(movesArray, [[5, 0]]);
});