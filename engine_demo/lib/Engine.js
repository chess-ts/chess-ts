import { Board } from "./board/Board.ts";
export const Engine = {
    /**
     * Get the list of moves for a given UCI and coordinates
     * @param uci The UCI of the board
     * @param coords The coordinates of the piece
     * @returns The list of moves {@link Move}
     */
    GetMoves: (uci, coords) => {
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
    GetColorMoves: (uci, color) => {
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
    Move: (uci, from, to, promotion = 'queen') => {
        const board = new Board();
        board.SetUCI(uci);
        const status = board.Move(from, to, promotion);
        return {
            status,
            uci: board.GetUCI(),
        };
    },
    BoardToString: (uci) => {
        const board = new Board();
        board.SetUCI(uci);
        return board.ToString();
    }
};
