import { Board } from "./board/Board.js";
import Move from "./board/Move.js";
import { Coords, PieceColor, PromotionType, Status } from "./tooling/types.js";

interface MoveResult {
	status: Status,
	uci: string,
}

export const Engine = {
	/**
	 * Get the list of moves for a given UCI and coordinates
	 * @param uci The UCI of the board
	 * @param coords The coordinates of the piece
	 * @returns The list of moves {@link Move}
	 */
	GetMoves: (uci: string, coords: Coords): Move[] => {
		const board = new Board();
		board.SetUCI(uci);
		return board.GetMoves(coords);
	},
	/**
	 * Get the list of moves for a given UCI and color
	 * @param uci The UCI of the board
	 * @param color The color of the piece
	 * @returns The list of moves {@link Move}
	 */
	GetColorMoves: (uci: string, color: PieceColor): Move[] => {
		const board = new Board();
		board.SetUCI(uci);
		return board.GetColorMoves(color);
	},
	/**
	 * Move a piece from one set of coordinates to another
	 * @param uci The UCI of the board
	 * @param from The coordinates of the piece
	 * @param to The coordinates to move the piece to
	 * @param promotion The promotion type (queen | rook | bishop | knight) default is queen
	 * @returns The result of the move {@link MoveResult}
	 */
	Move: (uci: string, from: Coords, to: Coords, promotion: PromotionType = 'queen'): MoveResult => {
		const board = new Board();
		board.SetUCI(uci);
		const status = board.Move(from, to, promotion) as Status;
		return {
			status,
			uci: board.GetUCI(),
		};
	},
	BoardToString: (uci: string): string => {
		const board = new Board();
		board.SetUCI(uci);
		return board.ToString();
	}
}