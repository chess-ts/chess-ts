import {
	assertEquals
} from 'https://deno.land/std@0.214.0/assert/mod.ts';
import { Board } from '../board/Board.ts';

Deno.test('Board.GetFen should return the board position', () => {
	const board = new Board();
	assertEquals(board.GetFen(), 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
});

Deno.test('Board.GetFen should return the board position after a move', () => {
	const board = new Board();
	board.Move([1, 4], [3, 4]);
	assertEquals(board.GetFen(), 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR');
});