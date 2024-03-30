
import { PieceType, PieceColor } from '../../tooling/types.ts';

/**
 * Piece interface
 */
export default interface Piece {
	color: PieceColor,
	type: PieceType,
	moved: boolean,
};