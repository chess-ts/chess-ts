'use client';

import { useEffect } from 'react';
import './chessboard.css';
import { Engine } from '../public/engine/Engine';
import { io } from "socket.io-client"

const socket = io('ws://localhost:3333')

let UCI = '';
let connectedToServer = false;
let color = '';

//#region Types

/**
 * A coordinate on the board (rank or file)
 */
type Coord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A pair of coordinates
 */
export type Coords = [Coord, Coord];

/**
 * A piece on the board
 */
type Piece = 'wp' | 'wn' | 'wb' | 'wr' | 'wq' | 'wk' | 'bp' | 'bn' | 'bb' | 'br' | 'bq' | 'bk' | null;

/**
 * A rank on the board
 */
type Rank = [Piece, Piece, Piece, Piece, Piece, Piece, Piece, Piece];

/**
 * A position on the board
 */
export type Position = [Rank, Rank, Rank, Rank, Rank, Rank, Rank, Rank];

/**
 * The props for the chessboard
 * 
 * flip: boolean
 * 
 * startingPos: {@link Position}
 * 
 * history: [ {@link Coords}, {@link Coords} ][]
 */
export interface ChessboardProps {
	flip: boolean,
	history: [Coords, Coords][]
};

//#endregion

const FILES = 'abcdefgh'

//#region Utility Functions

/**
 * Zip two arrays together
 * @param arrays The arrays to zip together
 * @returns The zipped array
 */
function zip<T1, T2>(arrays: [T1[], T2[]]) {
	const zipped: [T1, T2][] = [];
	for(let i = 0; i < arrays[0].length; i++) {
		zipped.push([
			arrays[0][i],
			arrays[1][i]
		]);
	}
	return zipped
}

//#endregion

//#region Event Handlers

/**
 * Handle the click event for the pieces
 * @param e The mouse event
 */
function PieceClick(e: MouseEvent) {
	e.preventDefault();
	const selected = document.querySelector('.selected');
	if(selected && AllValidMoves(selected).includes((e.target as HTMLElement).parentElement as HTMLElement)) {
		SquareClick({
			target: (e.target as HTMLElement).parentElement,
			preventDefault: () => {}
		} as MouseEvent);
		return;
	}
	(e.target as HTMLElement).classList.toggle('selected');
	for(const square of Array.from(document.querySelectorAll('.highlight'))) {
		square.classList.remove('highlight');
	}
	for(const square of Array.from(document.querySelectorAll('.highlight-move'))) {
		square.classList.remove('highlight-move');
	}
	const valid_moves = AllValidMoves(e.target as Node);
	for(const valid_move of valid_moves) {
		valid_move.classList.add('highlight-move');
	}
	selected?.classList.remove('selected');
}

//#endregion

//#region Square Event Handlers

const PieceCorrespondance = {
	'P': 'wp',
	'N': 'wn',
	'B': 'wb',
	'R': 'wr',
	'Q': 'wq',
	'K': 'wk',
	'p': 'bp',
	'n': 'bn',
	'b': 'bb',
	'r': 'br',
	'q': 'bq',
	'k': 'bk',
	'.': null
}

/**
 * Handle the context menu event for the squares
 * @param e The mouse event
 */
function SquareContextMenu(e: MouseEvent) {
	e.preventDefault();
}

function GetBoardArray(uci: string): string[][] {
	return Engine.BoardToString(uci).trim().split('\n').slice(1).map(row => row.trim().split(' ').slice(1));
}

function EngineSync(uci: string) {
	UCI = uci;
	SetupPieces(GetBoardArray(uci).map(row => row.map(piece => PieceCorrespondance[piece as keyof typeof PieceCorrespondance] as Piece) as Rank).reverse() as Position);
	if(uci.length >= 4) {
		if(uci[uci.length - 1] >= '0' && uci[uci.length - 1] <= '9') {
			HighlightLastMove([
				[parseInt(uci[uci.length - 3]) - 1, FILES.indexOf(uci[uci.length - 4])] as Coords,
				[parseInt(uci[uci.length - 1]) - 1, FILES.indexOf(uci[uci.length - 2])] as Coords
			]);
		} else {
			uci = uci.slice(0, -1);
			HighlightLastMove([
				[parseInt(uci[uci.length - 3]) - 1, FILES.indexOf(uci[uci.length - 4])] as Coords,
				[parseInt(uci[uci.length - 1]) - 1, FILES.indexOf(uci[uci.length - 2])] as Coords
			]);
		}
	}
}

/**
 * Move a piece from one square to another
 * @param from The square to move from
 * @param to The square to move to
 */
function MovePiece(from: HTMLElement, to: HTMLElement) {
	const check = document.querySelector('.check') as HTMLElement
	if(check) {
		check.classList.remove('check');
	}
	const from_coords = GetCoords(from.parentElement as HTMLElement);
	const to_coords = GetCoords(to);
	const result = Engine.Move(UCI, from_coords, to_coords); // TODO: Remove move here because of server move
	EngineSync(result.uci);
	HighlightLastMove([from_coords, to_coords]);
	to.innerHTML = '';
	to.appendChild(from);
	if(result.status.status === 'ongoing' && result.status.check !== 'none') {
		const king = document.querySelector(`.${result.status.check === 'white' ? 'wk' : 'bk'}`) as HTMLElement;
		king.parentElement?.classList.add('check');
	}
}

/**
 * Handle the mouse click event for the squares
 * @param e The mouse event
 */
function SquareClick(e: MouseEvent) {
	e.preventDefault();
	if((e.target as HTMLElement).classList.contains('square')) {
		let selected_piece = document.querySelector('.selected');
		if(selected_piece && AllValidMoves(selected_piece).includes(e.target as HTMLElement)) {
			socket.emit('can_i_move', (response: boolean) => {
				if(!response) {
					alert('It\'s not your turn!')
					return;
				}
				socket.emit('move', {
					from: GetCoords(selected_piece.parentElement as HTMLElement),
					to: GetCoords(e.target as HTMLElement),
					promotion: 'queen'
				})
				MovePiece(
					selected_piece as HTMLElement,
					e.target as HTMLElement
				);
			})
		}
		selected_piece?.classList.remove('selected');
		for(const square of Array.from(document.querySelectorAll('.highlight'))) {
			square.classList.remove('highlight');
		}
		for(const square of Array.from(document.querySelectorAll('.highlight-move'))) {
			square.classList.remove('highlight-move');
		}
		(document.querySelector('.arrows') as HTMLElement).innerHTML = '';
	}
}

let from: HTMLElement | null = null;

/**
 * Handle the mouse down event for the squares
 * @param e The mouse event
 */
function SquareMouseDown(e: MouseEvent) {
	if(e.button === 2) {
		from = e.target as HTMLElement;
	}
}

/**
 * The arrows on the board
 */
const arrows: [[HTMLElement, HTMLElement], HTMLElement][] = [];

/**
 * Generate an arrow from one square to another
 * @param from The starting square
 * @param to The ending square
 */
function GenerateArrow(from: HTMLElement, to: HTMLElement) {
	const similar_arrow = arrows.reduce((match, arrow) => arrow[0][0] === from && arrow[0][1] === to ? arrow : match, null as [[HTMLElement, HTMLElement], HTMLElement] | null);
	if(similar_arrow) {
		similar_arrow[1].remove();
		arrows.splice(arrows.indexOf(similar_arrow), 1);
		return;
	}
	const arrow = document.createElement('div');
	
	const arrow_body = document.createElement('div');
	arrow_body.style.width = Math.hypot(from.offsetLeft - to.offsetLeft, from.getBoundingClientRect().top - to.getBoundingClientRect().top) + 'px';
	arrow_body.style.height = `${from.offsetHeight / 10}px`;
	arrow_body.style.backgroundColor = '#ff9b19';
	const arrow_head_left = document.createElement('div');
	arrow_head_left.style.marginLeft = `${Math.hypot(from.offsetLeft - to.offsetLeft, from.getBoundingClientRect().top - to.getBoundingClientRect().top) - from.offsetHeight / 4}px`;
	arrow_head_left.style.backgroundColor = '#ff9b19';
	arrow_head_left.style.width = `${from.offsetHeight / 10 * 3}px`;
	arrow_head_left.style.height = `${from.offsetHeight / 10}px`;
	arrow_head_left.style.transform = 'rotate(-135deg)';
	const arrow_head_right = document.createElement('div');
	arrow_head_right.style.marginLeft = `${Math.hypot(from.offsetLeft - to.offsetLeft, from.getBoundingClientRect().top - to.getBoundingClientRect().top) - from.offsetHeight / 4}px`;
	arrow_head_right.style.backgroundColor = '#ff9b19';
	arrow_head_right.style.width = `${from.offsetHeight / 10 * 3}px`;
	arrow_head_right.style.height = `${from.offsetHeight / 10}px`;
	arrow_head_right.style.transform = 'rotate(135deg)';

	arrow.appendChild(arrow_head_left);
	arrow.appendChild(arrow_body);
	arrow.appendChild(arrow_head_right);

	arrow.style.position = 'absolute';
	arrow.style.transformOrigin = 'top left';
	let left = from.offsetLeft + from.offsetHeight / 2;
	let top = from.getBoundingClientRect().top + from.offsetHeight / 2;
	let angle = 0;
	const offsetHeight =  + from.offsetHeight / 10 * 3;
	const half_hypot = Math.hypot(offsetHeight / 2, offsetHeight / 2) / 2;
	if(to.offsetLeft > from.offsetLeft && to.getBoundingClientRect().top > from.getBoundingClientRect().top) { // Down Right
		angle = Math.atan((to.getBoundingClientRect().top - from.getBoundingClientRect().top) / (to.offsetLeft - from.offsetLeft));
		top -= half_hypot;
		left += half_hypot;
	} else if(to.offsetLeft < from.offsetLeft && to.getBoundingClientRect().top < from.getBoundingClientRect().top) { // Up Left
		angle = Math.PI + Math.atan((to.getBoundingClientRect().top - from.getBoundingClientRect().top) / (to.offsetLeft - from.offsetLeft));
		top += half_hypot;
		left -= half_hypot;
	} else if(to.offsetLeft > from.offsetLeft && to.getBoundingClientRect().top < from.getBoundingClientRect().top) { // Up Right
		angle = Math.atan((to.getBoundingClientRect().top - from.getBoundingClientRect().top) / (to.offsetLeft - from.offsetLeft));
		top -= half_hypot;
		left -= half_hypot;
	} else if(to.offsetLeft < from.offsetLeft && to.getBoundingClientRect().top > from.getBoundingClientRect().top) { // Down Left
		angle = Math.PI + Math.atan((to.getBoundingClientRect().top - from.getBoundingClientRect().top) / (to.offsetLeft - from.offsetLeft));
		top += half_hypot;
		left += half_hypot;
	} else if(to.getBoundingClientRect().top === from.getBoundingClientRect().top && to.offsetLeft > from.offsetLeft) { // Right
		angle = 0;
		top -= offsetHeight / 2;
	} else if(to.getBoundingClientRect().top === from.getBoundingClientRect().top && to.offsetLeft < from.offsetLeft) { // Left
		angle = Math.PI;
		top += offsetHeight / 2;
	} else if(to.offsetLeft === from.offsetLeft && to.getBoundingClientRect().top > from.getBoundingClientRect().top) { // Down
		angle = Math.PI / 2;
		left += offsetHeight / 2;
	} else if(to.offsetLeft === from.offsetLeft && to.getBoundingClientRect().top < from.getBoundingClientRect().top) { // Up
		angle = Math.PI / -2;
		left -= offsetHeight / 2;
	}
	arrow.style.transform = `rotate(${angle}rad)`;
	arrow.style.left = `${left}px`;
	arrow.style.top =  `${top}px`;

	arrow.addEventListener('contextmenu', e => { e.preventDefault(); }); // TODO Send event to square to toggle highlight 
	document.querySelector('.arrows')?.appendChild(arrow);
	arrows.push([[from, to], arrow]);
}

/**
 * Handle the mouse up event for the squares
 * @param e The mouse event
 */
function SquareMouseUp(e: MouseEvent) {
	if(e.button === 2) {
		if(from === null || from === e.target) {
			(e.target as HTMLElement).classList.toggle('highlight');
		} else {
			GenerateArrow(from, e.target as HTMLElement);
			from = null;
		}
	}
}

//#endregion

//#endregion

/**
 * Get the chess coordinates from a square
 * @param square The square to get the coordinates from
 * @returns The coordinates of the square
 */
const GetCoords = (square: HTMLElement) => [
	7 - Array.from(square.parentElement?.parentElement?.children as HTMLCollection).indexOf(square.parentElement as HTMLElement),
	Array.from(square.parentElement?.children as HTMLCollection).indexOf(square as HTMLElement)
] as Coords;

/**
 * Get the square from the coordinates
 * @param coords The coordinates of the square
 * @returns The square at the coordinates
 */
const GetSquare = (coords: Coords) => document.querySelector(`.${FILES[coords[1]]}${coords[0] + 1}`) as HTMLElement;

/**
 * Get all moves from the engine
 * @param start The starting node
 * @returns An array of all valid moves
 */
function AllValidMoves(start: Node) {
	if(!(color.charAt(0) === (start as HTMLElement).classList[0].charAt(0))) {
		return [];
	}
	return Engine.GetMoves(UCI, GetCoords(start.parentElement as HTMLElement)).map(move => GetSquare(move.to));
}

/**
 * Set up the pieces on the board (with event listeners)
 * @param props The chessboard props
 */
function SetupPieces(pos: Position) {
	for(const [square, piece] of zip([Array.from(document.querySelectorAll('.square')) as HTMLElement[], Array.from(pos).reverse().flat()])) {
		square.removeEventListener('contextmenu', SquareContextMenu);
		square.addEventListener('contextmenu', SquareContextMenu);
		square.removeEventListener('click', SquareClick);
		square.addEventListener('click', SquareClick);
		square.removeEventListener('mousedown', SquareMouseDown);
		square.addEventListener('mousedown', SquareMouseDown);
		square.removeEventListener('mouseup', SquareMouseUp);
		square.addEventListener('mouseup', SquareMouseUp);
		if(piece) {
			const piece_div = document.createElement('div');
			piece_div.classList.add(piece);
			square.innerHTML = '';
			square.appendChild(piece_div);
			piece_div.removeEventListener('click', PieceClick);
			piece_div.addEventListener('click', PieceClick);
		} else {
			square.innerHTML = '';
		}
	}
}

/**
 * Highlight the last move
 * @param props The chessboard props
 */
function HighlightLastMove(last_move: [Coords, Coords]) {
	const [last_move_from, last_move_to] = last_move;
	const [div_from, div_to] = [
		document.querySelector(`.${FILES[last_move_from[1]]}${last_move_from[0] + 1}`),
		document.querySelector(`.${FILES[last_move_to[1]]}${last_move_to[0] + 1}`)
	] as HTMLElement[];
	document.querySelectorAll('.highlight-last-move').forEach(div => div.classList.remove('highlight-last-move'));
	div_from.classList.add('highlight-last-move');
	div_to.classList.add('highlight-last-move');
}

/**
 * React component for the chessboard
 * @param props The chessboard props
 * @returns The chessboard React.JSX component
 */
export default function Chessboard(props: ChessboardProps) {
	useEffect(() => {
		EngineSync(UCI);
		if(props.history.length) {
			HighlightLastMove(props.history[props.history.length - 1]);
		}
		if(!connectedToServer) {
			socket.emit('join', prompt('Enter your name: '))
			socket.on('color', player_color => {
				color = player_color
				if(color === 'black') {
					(document.querySelector('.chessboard') as HTMLElement).style.transform = 'rotate(180deg)';
					document.querySelectorAll('.rank').forEach(el => (el as HTMLElement).style.transform = 'rotate(180deg)');
				}
			})
			connectedToServer = true;
			socket.on('full', () => {
				alert('The room is full')
			})
		
			socket.on('start', () => {
				alert(' The game started')
			})

			socket.on('uci', uci => {
				EngineSync(uci);
			})
		
			socket.on('status', (isEndOfGame, isCheckmateOrCheck = false, winnerOrDrawType = null) => {
				if(isEndOfGame) {
					if(isCheckmateOrCheck) {
						alert(`CHECKMATE! ${winnerOrDrawType.toUpperCase()} wins!`)
						socket.disconnect()
					} else {
						alert(`DRAW! It's a draw (${winnerOrDrawType})!`)
						socket.disconnect()
					}
				}
			})
		
			socket.on('error', (error) => {
				console.error(`[ERROR] : ${error}`)
			})
		}
	})
	return (
		<div className='game'>
			<div className='chessboard'>
				<div className='8 rank'>
					<div className='a8 square'></div>
					<div className='b8 square'></div>
					<div className='c8 square'></div>
					<div className='d8 square'></div>
					<div className='e8 square'></div>
					<div className='f8 square'></div>
					<div className='g8 square'></div>
					<div className='h8 square'></div>
				</div>
				<div className='7 rank'>
					<div className='a7 square'></div>
					<div className='b7 square'></div>
					<div className='c7 square'></div>
					<div className='d7 square'></div>
					<div className='e7 square'></div>
					<div className='f7 square'></div>
					<div className='g7 square'></div>
					<div className='h7 square'></div>
				</div>
				<div className='6 rank'>
					<div className='a6 square'></div>
					<div className='b6 square'></div>
					<div className='c6 square'></div>
					<div className='d6 square'></div>
					<div className='e6 square'></div>
					<div className='f6 square'></div>
					<div className='g6 square'></div>
					<div className='h6 square'></div>
				</div>
				<div className='5 rank'>
					<div className='a5 square'></div>
					<div className='b5 square'></div>
					<div className='c5 square'></div>
					<div className='d5 square'></div>
					<div className='e5 square'></div>
					<div className='f5 square'></div>
					<div className='g5 square'></div>
					<div className='h5 square'></div>
				</div>
				<div className='4 rank'>
					<div className='a4 square'></div>
					<div className='b4 square'></div>
					<div className='c4 square'></div>
					<div className='d4 square'></div>
					<div className='e4 square'></div>
					<div className='f4 square'></div>
					<div className='g4 square'></div>
					<div className='h4 square'></div>
				</div>
				<div className='3 rank'>
					<div className='a3 square'></div>
					<div className='b3 square'></div>
					<div className='c3 square'></div>
					<div className='d3 square'></div>
					<div className='e3 square'></div>
					<div className='f3 square'></div>
					<div className='g3 square'></div>
					<div className='h3 square'></div>
				</div>
				<div className='2 rank'>
					<div className='a2 square'></div>
					<div className='b2 square'></div>
					<div className='c2 square'></div>
					<div className='d2 square'></div>
					<div className='e2 square'></div>
					<div className='f2 square'></div>
					<div className='g2 square'></div>
					<div className='h2 square'></div>
				</div>
				<div className='1 rank'>
					<div className='a1 square'></div>
					<div className='b1 square'></div>
					<div className='c1 square'></div>
					<div className='d1 square'></div>
					<div className='e1 square'></div>
					<div className='f1 square'></div>
					<div className='g1 square'></div>
					<div className='h1 square'></div>
				</div>
			</div>
			<div className='arrows'></div>
		</div>
	  );
}