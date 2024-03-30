
// Coordinates types
/**
 * A coordinate : 0-7
 */
type Coord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
/**
 * A set of coordinates : [0-7, 0-7]
 */
export type Coords = [Coord, Coord];

// Piece types
/**
 * A piece type : { pawn, knight, bishop, rook, queen, king }
 */
export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
/**
 * A piece type a pawn can be promoted to : { knight, bishop, rook, queen }
 */
export type PromotionType = 'knight' | 'bishop' | 'rook' | 'queen';
/**
 * A piece color : { white, black }
 */
export type PieceColor = 'white' | 'black';

// Status types
/**
 * An ongoing game status
 */
export interface Ongoing {
	status: 'ongoing';
	check: PieceColor | 'none';
}
/**
 * A checkmate game status : { winner: PieceColor }
 */
export interface Checkmate {
	status: 'checkmate';
	winner: PieceColor;
}
/**
 * A draw game status : { reason: 'stalemate' | 'threefold' | 'fifty' | 'insufficient' }
 */
export interface Draw {
	status: 'draw';
	reason: 'stalemate' | 'threefold' | 'fifty' | 'insufficient';
}
/**
 * A game status : {@link Ongoing} | {@link Checkmate} | {@link Draw}
 */
export type Status = Ongoing | Checkmate | Draw;