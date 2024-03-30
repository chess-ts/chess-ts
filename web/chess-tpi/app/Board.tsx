'use client';

import Chessboard, {
	Coords,
	Position,
	ChessboardProps,
} from "./Chessboard";

import Timer, {
	TimerProps,
} from "./Timer";

import './board.css';

/**
 * The details of a player
 * 
 * name: string
 * 
 * elo: number
 * 
 * time: number | null
 */
interface PlayerDetails {
	name: string,
	elo: number,
	time: number | null
};

/**
 * The details of a message
 * 
 * author: string
 * 
 * content: string
 * 
 * time: string
 */
interface MessageDetails {
	author: string,
	content: string,
	time: string
};

/**
 * The props for the board
 * 
 * flip: boolean
 * 
 * timeSettings: {@link TimerProps} | null
 * 
 * players: [ {@link PlayerDetails}, {@link PlayerDetails} ]
 * 
 * history: [ {@link Coords}, {@link Coords} ][]
 * 
 * messages: {@link MessageDetails}[]
 */
interface BoardProps extends ChessboardProps {
	flip: boolean,
	timeSettings: TimerProps | null,
	players: [PlayerDetails, PlayerDetails]
	history: [Coords, Coords][],
	messages: MessageDetails[]
};

export default function Board(props: BoardProps) {
	if(props.timeSettings === null) {
		return (
			<Chessboard
				flip = {props.flip}
				history = {props.history}
			/>
		)
	}
	return (
		<div className="board">
			<Chessboard
				flip = {props.flip}
				history = {props.history}
			/>
			<Timer
				white = {props.timeSettings.white}
				black = {props.timeSettings.black}
			/>
		</div>
	)
}