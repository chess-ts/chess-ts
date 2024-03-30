
import { PieceType, PieceColor } from '../../tooling/types';

/**
 * Piece interface
 */
export default interface Piece {
	color: PieceColor,
	type: PieceType,
	moved: boolean,
};