
import { PieceType, PieceColor } from '../../tooling/types.js';

/**
 * Piece interface
 */
export default interface Piece {
	color: PieceColor,
	type: PieceType,
	moved: boolean,
};