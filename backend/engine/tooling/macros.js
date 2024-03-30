/**
 * Macro to create a piece
 * @param color The color of the piece (white | black)
 * @param type The type of the piece (pawn | knight | bishop | rook | queen | king)
 * @param coords The coordinates of the piece ([0-7, 0-7])
 * @returns The piece
 */
export var MK_PIECE = function (color, type) { return ({
    color: color,
    type: type,
    moved: false,
}); };
/**
 * Macro to create a pawn
 * @param color The color of the pawn (white | black)
 * @param coords The coordinates of the pawn ([0-7, 0-7])
 * @returns The pawn
 */
export var MK_PAWN = function (color) { return MK_PIECE(color, 'pawn'); };
/**
 * Macro to create a knight
 * @param color The color of the knight (white | black)
 * @param coords The coordinates of the knight ([0-7, 0-7])
 * @returns The knight
 */
export var MK_KNIGHT = function (color) { return MK_PIECE(color, 'knight'); };
/**
 * Macro to create a bishop
 * @param color The color of the bishop (white | black)
 * @param coords The coordinates of the bishop ([0-7, 0-7])
 * @returns The bishop
 */
export var MK_BISHOP = function (color) { return MK_PIECE(color, 'bishop'); };
/**
 * Macro to create a rook
 * @param color The color of the rook (white | black)
 * @param coords The coordinates of the rook ([0-7, 0-7])
 * @returns The rook
 */
export var MK_ROOK = function (color) { return MK_PIECE(color, 'rook'); };
/**
 * Macro to create a queen
 * @param color The color of the queen (white | black)
 * @param coords The coordinates of the queen ([0-7, 0-7])
 * @returns The queen
 */
export var MK_QUEEN = function (color) { return MK_PIECE(color, 'queen'); };
/**
 * Macro to create a king
 * @param color The color of the king (white | black)
 * @param coords The coordinates of the king ([0-7, 0-7])
 * @returns The king
 */
export var MK_KING = function (color) { return MK_PIECE(color, 'king'); };
/**
 * Macro to create a move
 * @param from The coordinates of the piece to move ([0-7, 0-7])
 * @param to The coordinates of the destination ([0-7, 0-7])
 * @param capture Whether the move is a capture or not
 * @param promotion The type of the promotion (optional)
 * @returns The move
 */
export var MK_MOVE = function (from, to, capture, enPassant, castle, promotion) {
    if (capture === void 0) { capture = false; }
    if (enPassant === void 0) { enPassant = false; }
    if (castle === void 0) { castle = 'none'; }
    if (promotion === void 0) { promotion = 'none'; }
    return ({
        from: from,
        to: to,
        capture: capture,
        enPassant: enPassant,
        castle: castle,
        promotion: promotion,
    });
};
