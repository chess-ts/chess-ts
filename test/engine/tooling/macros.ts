
import Piece from "../board/pieces/Piece.ts";
import Move from "../board/Move.ts";
import { Coords, PieceColor, PieceType } from './types.ts';

/**
 * Macro to create a piece
 * @param color The color of the piece (white | black)
 * @param type The type of the piece (pawn | knight | bishop | rook | queen | king)
 * @param coords The coordinates of the piece ([0-7, 0-7])
 * @returns The piece
 */
export const MK_PIECE = (color: PieceColor, type: PieceType): Piece => ({
	color,
	type,
	moved: false,
});

/**
 * Macro to create a pawn
 * @param color The color of the pawn (white | black)
 * @param coords The coordinates of the pawn ([0-7, 0-7])
 * @returns The pawn
 */
export const MK_PAWN = (color: PieceColor): Piece => MK_PIECE(color, 'pawn');
/**
 * Macro to create a knight
 * @param color The color of the knight (white | black)
 * @param coords The coordinates of the knight ([0-7, 0-7])
 * @returns The knight
 */
export const MK_KNIGHT = (color: PieceColor): Piece => MK_PIECE(color, 'knight');
/**
 * Macro to create a bishop
 * @param color The color of the bishop (white | black)
 * @param coords The coordinates of the bishop ([0-7, 0-7])
 * @returns The bishop
 */
export const MK_BISHOP = (color: PieceColor): Piece => MK_PIECE(color, 'bishop');
/**
 * Macro to create a rook
 * @param color The color of the rook (white | black)
 * @param coords The coordinates of the rook ([0-7, 0-7])
 * @returns The rook
 */
export const MK_ROOK = (color: PieceColor): Piece => MK_PIECE(color, 'rook');
/**
 * Macro to create a queen
 * @param color The color of the queen (white | black)
 * @param coords The coordinates of the queen ([0-7, 0-7])
 * @returns The queen
 */
export const MK_QUEEN = (color: PieceColor): Piece => MK_PIECE(color, 'queen');
/**
 * Macro to create a king
 * @param color The color of the king (white | black)
 * @param coords The coordinates of the king ([0-7, 0-7])
 * @returns The king
 */
export const MK_KING = (color: PieceColor): Piece => MK_PIECE(color, 'king');

/**
 * Macro to create a move
 * @param from The coordinates of the piece to move ([0-7, 0-7])
 * @param to The coordinates of the destination ([0-7, 0-7])
 * @param capture Whether the move is a capture or not
 * @param promotion The type of the promotion (optional)
 * @returns The move
 */
export const MK_MOVE = (from: Coords, to: Coords, capture= false, enPassant = false, castle: 'king' | 'queen' | 'none' = 'none', promotion: 'queen' | 'rook' | 'bishop' | 'knight' | 'none' = 'none'): Move => ({
	from,
	to,
	capture,
	enPassant,
	castle,
	promotion,
});