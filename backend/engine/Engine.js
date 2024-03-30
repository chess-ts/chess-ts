import { Board } from "./board/Board.js";
export var Engine = {
    /**
     * Get the list of moves for a given UCI and coordinates
     * @param uci The UCI of the board
     * @param coords The coordinates of the piece
     * @returns The list of moves {@link Move}
     */
    GetMoves: function (uci, coords) {
        var board = new Board();
        board.SetUCI(uci);
        return board.GetMoves(coords);
    },
    /**
     * Get the list of moves for a given UCI and color
     * @param uci The UCI of the board
     * @param color The color of the piece
     * @returns The list of moves {@link Move}
     */
    GetColorMoves: function (uci, color) {
        var board = new Board();
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
    Move: function (uci, from, to, promotion) {
        if (promotion === void 0) { promotion = 'queen'; }
        var board = new Board();
        board.SetUCI(uci);
        var status = board.Move(from, to, promotion);
        return {
            status: status,
            uci: board.GetUCI(),
        };
    },
    BoardToString: function (uci) {
        var board = new Board();
        board.SetUCI(uci);
        return board.ToString();
    }
};
