var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { MK_PAWN, MK_KNIGHT, MK_BISHOP, MK_ROOK, MK_QUEEN, MK_KING, MK_MOVE, MK_PIECE, } from '../tooling/macros.js';
var Board = /** @class */ (function () {
    /**
     * Creates a new board
     * @param fen The FEN string to set the board to
     */
    function Board(fen) {
        if (fen === void 0) { fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'; }
        this._last_move = null;
        this.move_count = 0;
        this._move_history = [];
        this.board = this.FENtoBoard(fen.split('').reverse().join(''));
    }
    Object.defineProperty(Board.prototype, "last_move", {
        get: function () {
            return this._last_move;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "move_history", {
        get: function () {
            return this._move_history;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Set the board from a FEN string
     * @param fen The FEN string
     * @returns The board representation
     */
    Board.prototype.FENtoBoard = function (fen) {
        var board = [
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null]
        ];
        var x = 0;
        var y = 0;
        for (var _i = 0, fen_1 = fen; _i < fen_1.length; _i++) {
            var c = fen_1[_i];
            if (c === '/') {
                y = 0;
                x++;
            }
            else if (c === '8') {
                continue;
            }
            else if (!isNaN(parseInt(c)) && c !== '0') {
                y += parseInt(c);
            }
            else {
                var is_white = c === c.toUpperCase();
                switch (c) {
                    case 'p':
                    case 'P':
                        board[x][7 - y] = MK_PAWN(is_white ? 'white' : 'black');
                        break;
                    case 'n':
                    case 'N':
                        board[x][7 - y] = MK_KNIGHT(is_white ? 'white' : 'black');
                        break;
                    case 'b':
                    case 'B':
                        board[x][7 - y] = MK_BISHOP(is_white ? 'white' : 'black');
                        break;
                    case 'r':
                    case 'R':
                        board[x][7 - y] = MK_ROOK(is_white ? 'white' : 'black');
                        break;
                    case 'q':
                    case 'Q':
                        board[x][7 - y] = MK_QUEEN(is_white ? 'white' : 'black');
                        break;
                    case 'k':
                    case 'K':
                        board[x][7 - y] = MK_KING(is_white ? 'white' : 'black');
                        break;
                    default:
                        throw new Error("Unknown piece ".concat(c));
                }
                y++;
            }
        }
        return board;
    };
    Board.prototype.FindPiece = function (filters) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var piece = this.board[i][j];
                if (piece && piece.type === filters.type && piece.color === filters.color) {
                    return [i, j];
                }
            }
        }
    };
    Board.prototype.IsTargeted = function (color, pos) {
        for (var _i = 0, _a = this.GetColorMoves(color === 'white' ? 'black' : 'white', true).concat(this.GetColorCouldMovePawn(color === 'white' ? 'black' : 'white')); _i < _a.length; _i++) {
            var move = _a[_i];
            if (move.to[0] === pos[0] && move.to[1] === pos[1]) {
                return true;
            }
        }
        return false;
    };
    //#region Get Moves
    /**
     * Get all possible moves for a pawn
     * @param coords The coordinates of the pawn
     * @param color The color of the pawn
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesPawn = function (coords, color) {
        var _a, _b, _c, _d, _e, _f, _g;
        var moves = [];
        var direction = color === 'white' ? 1 : -1;
        var end = coords[0] + direction;
        if (end >= 0 && end < 8) {
            if (!this.board[end][coords[1]]) {
                moves.push(MK_MOVE(coords, [end, coords[1]], false, false, "none", (end === 7 || end === 0) ? 'queen' : 'none'));
                if (end + direction >= 0 && end + direction < 8 && !this.board[end + direction][coords[1]] && !((_a = this.board[coords[0]][coords[1]]) === null || _a === void 0 ? void 0 : _a.moved)) {
                    moves.push(MK_MOVE(coords, [end + direction, coords[1]]));
                }
            }
            if (this.board[end][coords[1] + 1] && ((_b = this.board[end][coords[1] + 1]) === null || _b === void 0 ? void 0 : _b.color) !== color) {
                moves.push(MK_MOVE(coords, [end, coords[1] + 1], true, false, "none", (end === 7 || end === 0) ? 'queen' : 'none'));
            }
            if (this.board[end][coords[1] - 1] && ((_c = this.board[end][coords[1] - 1]) === null || _c === void 0 ? void 0 : _c.color) !== color) {
                moves.push(MK_MOVE(coords, [end, coords[1] - 1], true, false, "none", (end === 7 || end === 0) ? 'queen' : 'none'));
            }
            if (coords[0] === (color === 'white' ? 4 : 3) && this._last_move) {
                var piece = this.board[this._last_move.to[0]][(_d = this._last_move) === null || _d === void 0 ? void 0 : _d.to[1]];
                if ((((_e = this._last_move) === null || _e === void 0 ? void 0 : _e.from[1]) === coords[1] + 1 || ((_f = this._last_move) === null || _f === void 0 ? void 0 : _f.from[1]) === coords[1] - 1) &&
                    ((_g = this._last_move) === null || _g === void 0 ? void 0 : _g.to[0]) === coords[0] &&
                    piece &&
                    piece.type === 'pawn' &&
                    piece.color !== color) {
                    moves.push(MK_MOVE(coords, [end, this._last_move.to[1]], true, true));
                }
            }
        }
        return moves;
    };
    /**
     * Get all possible moves for a knight
     * @param coords The coordinates of the knight
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesKnight = function (coords) {
        var _this = this;
        var knight_offsets = [
            [1, 2], [2, 1],
            [-1, 2], [-2, 1],
            [1, -2], [2, -1],
            [-1, -2], [-2, -1]
        ];
        return knight_offsets.map(function (offset) { return [coords[0] + offset[0], coords[1] + offset[1]]; }).filter(function (dest) { return dest[0] >= 0 && dest[0] < 8 && dest[1] >= 0 && dest[1] < 8; }).filter(function (dest) { var _a, _b; return _this.board[dest[0]][dest[1]] === null || ((_a = _this.board[dest[0]][dest[1]]) === null || _a === void 0 ? void 0 : _a.color) !== ((_b = _this.board[coords[0]][coords[1]]) === null || _b === void 0 ? void 0 : _b.color); }).map(function (dest) { var _a, _b; return _this.board[dest[0]][dest[1]] && ((_a = _this.board[dest[0]][dest[1]]) === null || _a === void 0 ? void 0 : _a.color) !== ((_b = _this.board[coords[0]][coords[1]]) === null || _b === void 0 ? void 0 : _b.color) ? MK_MOVE(coords, dest, true) : MK_MOVE(coords, dest); });
    };
    /**
     * Get all possible moves for a bishop
     * @param coords The coordinates of the bishop
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesBishop = function (coords) {
        var _a, _b, _c, _d;
        var moves = [];
        for (var i = 1; i < 8; i++) {
            if (coords[0] + i < 8 && coords[1] + i < 8) {
                var piece = this.board[coords[0] + i][coords[1] + i];
                if (piece) {
                    if (piece.color !== ((_a = this.board[coords[0]][coords[1]]) === null || _a === void 0 ? void 0 : _a.color)) {
                        moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] + i], true));
                    }
                    break;
                }
                moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] + i]));
            }
            else {
                break;
            }
        }
        for (var i = 1; i < 8; i++) {
            if (coords[0] + i < 8 && coords[1] - i >= 0) {
                var piece = this.board[coords[0] + i][coords[1] - i];
                if (piece) {
                    if (piece.color !== ((_b = this.board[coords[0]][coords[1]]) === null || _b === void 0 ? void 0 : _b.color)) {
                        moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] - i], true));
                    }
                    break;
                }
                moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] - i]));
            }
            else {
                break;
            }
        }
        for (var i = 1; i < 8; i++) {
            if (coords[0] - i >= 0 && coords[1] + i < 8) {
                var piece = this.board[coords[0] - i][coords[1] + i];
                if (piece) {
                    if (piece.color !== ((_c = this.board[coords[0]][coords[1]]) === null || _c === void 0 ? void 0 : _c.color)) {
                        moves.push(MK_MOVE(coords, [coords[0] - i, coords[1] + i], true));
                    }
                    break;
                }
                moves.push(MK_MOVE(coords, [coords[0] - i, coords[1] + i]));
            }
            else {
                break;
            }
        }
        for (var i = 1; i < 8; i++) {
            if (coords[0] - i >= 0 && coords[1] - i >= 0) {
                var piece = this.board[coords[0] - i][coords[1] - i];
                if (piece) {
                    if (piece.color !== ((_d = this.board[coords[0]][coords[1]]) === null || _d === void 0 ? void 0 : _d.color)) {
                        moves.push(MK_MOVE(coords, [coords[0] - i, coords[1] - i], true));
                    }
                    break;
                }
                moves.push(MK_MOVE(coords, [coords[0] - i, coords[1] - i]));
            }
            else {
                break;
            }
        }
        return moves;
    };
    /**
     * Get all possible moves for a rook
     * @param coords The coordinates of the rook
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesRook = function (coords) {
        var _a, _b, _c, _d;
        var moves = [];
        for (var i = coords[0] - 1; i >= 0; i--) {
            var piece = this.board[i][coords[1]];
            if (piece) {
                if (piece.color !== ((_a = this.board[coords[0]][coords[1]]) === null || _a === void 0 ? void 0 : _a.color)) {
                    moves.push(MK_MOVE(coords, [i, coords[1]], true));
                }
                break;
            }
            moves.push(MK_MOVE(coords, [i, coords[1]]));
        }
        for (var i = coords[0] + 1; i < 8; i++) {
            var piece = this.board[i][coords[1]];
            if (piece) {
                if (piece.color !== ((_b = this.board[coords[0]][coords[1]]) === null || _b === void 0 ? void 0 : _b.color)) {
                    moves.push(MK_MOVE(coords, [i, coords[1]], true));
                }
                break;
            }
            moves.push(MK_MOVE(coords, [i, coords[1]]));
        }
        for (var i = coords[1] - 1; i >= 0; i--) {
            var piece = this.board[coords[0]][i];
            if (piece) {
                if (piece.color !== ((_c = this.board[coords[0]][coords[1]]) === null || _c === void 0 ? void 0 : _c.color)) {
                    moves.push(MK_MOVE(coords, [coords[0], i], true));
                }
                break;
            }
            moves.push(MK_MOVE(coords, [coords[0], i]));
        }
        for (var i = coords[1] + 1; i < 8; i++) {
            var piece = this.board[coords[0]][i];
            if (piece) {
                if (piece.color !== ((_d = this.board[coords[0]][coords[1]]) === null || _d === void 0 ? void 0 : _d.color)) {
                    moves.push(MK_MOVE(coords, [coords[0], i], true));
                }
                break;
            }
            moves.push(MK_MOVE(coords, [coords[0], i]));
        }
        return moves;
    };
    /**
     * Get all possible moves for a queen
     * @param coords The coordinates of the queen
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesQueen = function (coords) {
        return this.GetMovesBishop(coords).concat(this.GetMovesRook(coords));
    };
    /**
     * Get all possible moves for a king
     * @param coords The coordinates of the king
     * @param ignore Whether to ignore if the move would put the king in check (castling only)
     * @returns An array of coordinates
     */
    Board.prototype.GetMovesKing = function (coords, ignore) {
        var _a, _b, _c;
        if (ignore === void 0) { ignore = false; }
        var moves = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if ((i !== 0 || j !== 0) &&
                    coords[0] + i >= 0 && coords[0] + i < 8 &&
                    coords[1] + j >= 0 && coords[1] + j < 8) {
                    var piece = this.board[coords[0] + i][coords[1] + j];
                    if (piece) {
                        if (piece.color !== ((_a = this.board[coords[0]][coords[1]]) === null || _a === void 0 ? void 0 : _a.color)) {
                            moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] + j], true));
                        }
                    }
                    else {
                        moves.push(MK_MOVE(coords, [coords[0] + i, coords[1] + j]));
                    }
                }
            }
        }
        if (!ignore) {
            if (this.CanCastle((_b = this.board[coords[0]][coords[1]]) === null || _b === void 0 ? void 0 : _b.color, 'king')) {
                moves.push(MK_MOVE(coords, [coords[0], 6], false, false, 'king'));
            }
            if (this.CanCastle((_c = this.board[coords[0]][coords[1]]) === null || _c === void 0 ? void 0 : _c.color, 'queen')) {
                moves.push(MK_MOVE(coords, [coords[0], 2], false, false, 'queen'));
            }
        }
        return moves;
    };
    //#endregion
    Board.prototype.GetColorCouldMovePawn = function (color) {
        var moves = [];
        for (var i = 0; i < 8; i++) {
            var piece = this.board[color === 'white' ? 6 : 1][i];
            if (piece && piece.color === color && piece.type === 'pawn') {
                moves.push({
                    from: [color === 'white' ? 6 : 1, i],
                    to: [color === 'white' ? 7 : 0, i + 1],
                    capture: false,
                    enPassant: false,
                    castle: 'none',
                    promotion: 'none'
                }, {
                    from: [color === 'white' ? 6 : 1, i],
                    to: [color === 'white' ? 7 : 0, i - 1],
                    capture: false,
                    enPassant: false,
                    castle: 'none',
                    promotion: 'none'
                });
            }
        }
        return moves;
    };
    //#region Castling
    Board.prototype.CanCastle = function (color, side) {
        var krank = color === 'white' ? 0 : 7;
        var king = this.board[krank][4];
        var rook = this.board[krank][side === 'king' ? 7 : 0];
        if (king && rook &&
            king.type === 'king' && rook.type === 'rook' &&
            !king.moved && !rook.moved &&
            !this.IsCheck(color)) {
            for (var i = 1; i < 3; i++) {
                if (this.board[krank][side === 'king' ? 4 + i : 4 - i] || // Piece in the way
                    this.IsTargeted(color, [krank, side === 'king' ? 4 + i : 4 - i]) // Targeted square
                ) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };
    //#endregion
    //#region Game State
    /**
     * Check if a color is in check
     * @param color The color to check
     * @returns Whether the color is in check
     */
    Board.prototype.IsCheck = function (color) {
        var king_coords = this.FindPiece({ type: 'king', color: color });
        if (!king_coords) {
            throw new Error('No king found');
        }
        var moves = this.GetColorMoves(color === 'white' ? 'black' : 'white', true);
        for (var _i = 0, moves_1 = moves; _i < moves_1.length; _i++) {
            var move = moves_1[_i];
            if (move.to[0] === king_coords[0] && move.to[1] === king_coords[1]) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check if a color is in checkmate
     * @param color The color to check
     * @returns Whether the color is in checkmate
     */
    Board.prototype.IsCheckmate = function (color) {
        var moves = this.GetColorMoves(color);
        return moves.length === 0 && this.IsCheck(color);
    };
    /**
     * Check if a move would put the king in check
     * @param move The move to check
     * @returns Whether the move would put the king in check
    */
    Board.prototype.WouldBeCheck = function (move) {
        if (move.castle !== 'none') {
            return false;
        }
        var tmp = structuredClone(this.board);
        var last = structuredClone(this._last_move);
        var move_count = this.move_count;
        var move_history = structuredClone(this._move_history);
        var piece = tmp[move.from[0]][move.from[1]];
        this.Move(move.from, move.to, 'queen', true);
        var check = this.IsCheck(piece === null || piece === void 0 ? void 0 : piece.color);
        this.board = tmp;
        this._last_move = last;
        this.move_count = move_count;
        this._move_history = move_history;
        return check;
    };
    /**
     * Check if a color is in stalemate
     * @param color The color to check
     * @returns Whether the color is in stalemate
     */
    Board.prototype.IsStalemate = function (color) {
        var moves = this.GetColorMoves(color, false);
        return moves.length === 0 && !this.IsCheck(color);
    };
    /**
     * Check if the move count is greater than 50
     * @returns Whether the move count is greater than 50
     */
    Board.prototype.IsFiftyMoveRule = function () {
        return this.move_count >= 50;
    };
    /**
     * Check if the game is in a threefold repetition
     * @returns Whether the game is in a threefold repetition
     */
    Board.prototype.IsThreefoldRepetition = function () {
        var buffer = [];
        for (var i = this._move_history.length - 1; i >= 0; i--) {
            var reverse_buffer = Array.from(buffer).reverse();
            if (JSON.stringify(this._move_history[i]) === JSON.stringify(buffer[0]) &&
                JSON.stringify(reverse_buffer) === JSON.stringify(this._move_history.slice(-buffer.length * 2, -buffer.length)) &&
                JSON.stringify(reverse_buffer) === JSON.stringify(this._move_history.slice(-buffer.length * 3, -buffer.length * 2))) {
                return true;
            }
            else {
                buffer.push(this._move_history[i]);
            }
        }
        return false;
    };
    /**
     * Check if the game is in a state of insufficient material
     * @returns Whether the game is in a state of insufficient material
     */
    Board.prototype.IsInsufficientMaterial = function () {
        var minor_pieces = {
            'white': 0,
            'black': 0
        };
        for (var _i = 0, _a = this.board.flat(); _i < _a.length; _i++) {
            var piece = _a[_i];
            if (piece && (piece.type === 'rook' || piece.type === 'queen' || piece.type === 'pawn')) {
                return false;
            }
            else if (piece && (piece.type === 'knight' || piece.type === 'bishop')) {
                if (minor_pieces[piece.color] === 1) {
                    return false;
                }
                minor_pieces[piece.color]++;
            }
        }
        return true;
    };
    /**
     * Get the status of the game
     * @returns The status of the game
     * {@link Status}
     */
    Board.prototype.GetStatus = function () {
        if (this.IsCheckmate('white')) {
            return { status: 'checkmate', winner: 'black' };
        }
        else if (this.IsCheckmate('black')) {
            return { status: 'checkmate', winner: 'white' };
        }
        else if (this.IsCheck('white')) {
            return { status: 'ongoing', check: 'white' };
        }
        else if (this.IsCheck('black')) {
            return { status: 'ongoing', check: 'black' };
        }
        else if (this.IsStalemate('white') || this.IsStalemate('black')) {
            return { status: 'draw', reason: 'stalemate' };
        }
        else if (this.IsFiftyMoveRule()) {
            return { status: 'draw', reason: 'fifty' };
        }
        else if (this.IsThreefoldRepetition()) {
            return { status: 'draw', reason: 'threefold' };
        }
        else if (this.IsInsufficientMaterial()) {
            return { status: 'draw', reason: 'insufficient' };
        }
        else {
            return { status: 'ongoing', check: 'none' };
        }
    };
    //#endregion
    //#region Public Functions
    /**
     * Get all possible moves for a piece
     *
     * ## Usage
     * ```ts
     * // Create a new instance of a board
     * const board = new Board();
     * // Get all moves for the piece at [0, 0]
     * const moves = board.GetMoves([0, 0]);
     * ```
     * @param coords The coordinates of the piece [0-7, 0-7]
     * @param ignore Whether to ignore if the move would put the king in check
     * @returns An array of moves
     */
    Board.prototype.GetMoves = function (coords, ignore) {
        var _this = this;
        if (ignore === void 0) { ignore = false; }
        var moves = [];
        var piece = this.board[coords[0]][coords[1]];
        if (piece !== null) {
            switch (piece.type) {
                case 'pawn':
                    moves.push.apply(moves, this.GetMovesPawn(coords, piece.color));
                    break;
                case 'knight':
                    moves.push.apply(moves, this.GetMovesKnight(coords));
                    break;
                case 'bishop':
                    moves.push.apply(moves, this.GetMovesBishop(coords));
                    break;
                case 'rook':
                    moves.push.apply(moves, this.GetMovesRook(coords));
                    break;
                case 'queen':
                    moves.push.apply(moves, this.GetMovesQueen(coords));
                    break;
                case 'king':
                    moves.push.apply(moves, this.GetMovesKing(coords, ignore));
            }
            if (ignore) {
                return moves;
            }
            return moves.filter(function (move) { return !_this.WouldBeCheck(move); });
        }
        return moves;
    };
    /**
     * Get all possible moves for a color
     *
     * ## Usage
     * ```ts
     * // Create a new instance of a board
     * const board = new Board();
     * // Get all moves for white
     * const moves = board.GetColorMoves('white');
     * ```
     * @param color The color of the pieces (white | black)
     * @param ignore Whether to ignore if the move would put the king in check
     * @returns An array of moves
     */
    Board.prototype.GetColorMoves = function (color, ignore) {
        if (ignore === void 0) { ignore = false; }
        var moves = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var piece = this.board[i][j];
                if (piece && piece.color === color) {
                    if (piece.type === 'king' && ignore) {
                        moves.push.apply(moves, this.GetMovesKing([i, j], ignore));
                    }
                    moves.push.apply(moves, this.GetMoves([i, j], ignore));
                }
            }
        }
        return moves;
    };
    /**
     * Move a piece from a position to another
     *
     * ## Usage
     * ```ts
     * // Create a new instance of a board
     * const board = new Board();
     * // Move the piece at [1, 0] to [2, 0]
     * const status = board.Move([1, 0], [2, 0]);
     * ```
     * @param from The position of the piece to move
     * @param to The position to move the piece to
     * @param promotion The type of piece to promote to
     * @param ignore Whether to ignore if the move would put the king in check
     * @returns The status of the game after the move
     * @throws "Invalid Move" If the move is invalid
     * @throws "No piece at this position" If there is no piece at the position
     */
    Board.prototype.Move = function (from, to, promotion, ignore) {
        if (promotion === void 0) { promotion = 'queen'; }
        if (ignore === void 0) { ignore = false; }
        var piece = this.board[from[0]][from[1]];
        if (piece) {
            for (var _i = 0, _a = this.GetMoves(from, ignore); _i < _a.length; _i++) {
                var mv = _a[_i];
                if (mv.to[0] === to[0] && mv.to[1] === to[1]) {
                    this.board[to[0]][to[1]] = piece;
                    if (mv.enPassant) {
                        this.board[to[0] + (piece.color === 'white' ? -1 : 1)][to[1]] = null;
                    }
                    if (mv.castle !== 'none') {
                        var rook = this.board[to[0]][mv.castle === 'king' ? 7 : 0];
                        this.board[to[0]][mv.castle === 'king' ? 5 : 3] = rook;
                        this.board[to[0]][mv.castle === 'king' ? 7 : 0] = null;
                    }
                    if (mv.promotion !== 'none') {
                        this.board[to[0]][to[1]] = MK_PIECE(piece.color, promotion);
                    }
                    this.board[from[0]][from[1]] = null;
                    piece.moved = true;
                    this._last_move = mv;
                    this._move_history.push(mv);
                    this.move_count++;
                    if (piece.type === 'pawn' || mv.capture) {
                        this.move_count = 0;
                    }
                    return ignore ? null : this.GetStatus();
                }
            }
            throw new Error('Invalid move');
        }
        throw new Error('No piece at this position');
    };
    Board.prototype.GetFen = function () {
        var fen = '';
        for (var _i = 0, _a = Array.from(this.board).reverse(); _i < _a.length; _i++) {
            var rank = _a[_i];
            var empty = 0;
            for (var _b = 0, rank_1 = rank; _b < rank_1.length; _b++) {
                var cell = rank_1[_b];
                if (cell === null) {
                    empty++;
                }
                else {
                    if (empty > 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += cell.type === 'knight' ? cell.color === 'white' ? 'N' : 'n' : cell.color === 'white' ? cell.type.toUpperCase()[0] : cell.type.toLowerCase()[0];
                }
            }
            if (empty > 0) {
                fen += empty;
            }
            fen += '/';
        }
        return fen.slice(0, -1);
    };
    Board.prototype.SetUCI = function (uci) {
        if (uci === '') {
            return;
        }
        for (var _i = 0, _a = uci.split(' '); _i < _a.length; _i++) {
            var move = _a[_i];
            var from = [parseInt(move[1]) - 1, move.charCodeAt(0) - 97];
            var to = [parseInt(move[3]) - 1, move.charCodeAt(2) - 97];
            var promotion_table = { 'q': 'queen', 'r': 'rook', 'b': 'bishop', 'n': 'knight' };
            var promotion = (move[4] ? promotion_table[move[4]] : 'none');
            this.Move(from, to, promotion);
        }
    };
    Board.prototype.GetUCI = function () {
        var moves = this._move_history.map(function (move) {
            var from = String.fromCharCode(move.from[1] + 97) + (move.from[0] + 1);
            var to = String.fromCharCode(move.to[1] + 97) + (move.to[0] + 1);
            return from + to + (move.promotion !== 'none' ? move.promotion[0] : '');
        });
        return moves.join(' ');
    };
    //#endregion
    //#region CLI Utils
    /**
     * Get a string representation of the board
     * @returns A string representation of the board
     */
    Board.prototype.ToString = function () {
        var pretty = '';
        pretty += '  a b c d e f g h\n';
        for (var _i = 0, _a = __spreadArray([], this.board, true).reverse(); _i < _a.length; _i++) {
            var rank = _a[_i];
            pretty += "".concat(this.board.indexOf(rank) + 1, " ");
            for (var _b = 0, rank_2 = rank; _b < rank_2.length; _b++) {
                var cell = rank_2[_b];
                pretty += cell === null ? '.' : cell.type === 'knight' ? cell.color === 'white' ? 'N' : 'n' : cell.color === 'white' ? cell.type.toUpperCase()[0] : cell.type.toLowerCase()[0];
                pretty += ' ';
            }
            pretty += '\n';
        }
        pretty += '\n';
        pretty += this.CanCastle('white', 'king') ? 'White can castle kingside\n' : '';
        pretty += this.CanCastle('white', 'queen') ? 'White can castle queenside\n' : '';
        pretty += this.CanCastle('black', 'king') ? 'Black can castle kingside\n' : '';
        pretty += this.CanCastle('black', 'queen') ? 'Black can castle queenside\n' : '';
        return pretty;
    };
    Board.prototype.GodMode = function (command) {
        var _a = command.split(' ').slice(1), color = _a[0], piece = _a[1], x = _a[2], y = _a[3];
        switch (command.split(' ')[0]) {
            case 'put':
                this.board[parseInt(x)][parseInt(y)] = {
                    color: color,
                    type: piece,
                    moved: false
                };
                break;
        }
    };
    return Board;
}());
export { Board };
;
