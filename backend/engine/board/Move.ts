
import { Coords } from '../tooling/types.js';

/**
 * Move interface
 */
export default interface Move {
	from: Coords,
	to: Coords,
	capture: boolean,
	enPassant: boolean,
	castle: 'king' | 'queen' | 'none',
	promotion: 'queen' | 'rook' | 'bishop' | 'knight' | 'none',
}