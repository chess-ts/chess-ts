'use client';

import { useEffect, useState } from 'react';
import './timer.css';

/**
 * The time settings for a player
 * 
 * time: number
 * 
 * increment: number
 */
interface TimeSettings {
	startTime: number,
	time: number,
	increment: number
}

/**
 * The time settings for the game
 * 
 * time: number
 * 
 * increment: number
 */
export interface TimerProps {
	white: TimeSettings,
	black: TimeSettings
};

/**
 * Create a timer for a player
 * @param player The player's time settings
 * @param color The color of the player
 * @returns The timer component for the player
 */
function createPlayerTimer(player: TimeSettings, color: string) {
	return (
		<div className={`${color}-player-timer`}>
			<span>
				{Math.floor(player.time / 60)}
			</span>
			<span>:</span>
			<span>
				{(Math.floor(player.time) % 60).toLocaleString('en-US', {
					minimumIntegerDigits: 2,
					useGrouping: false
  				})}
			</span>
		</div>
	)
}

/**
 * The timer component
 * @param props The props for the timer
 * @returns The timer component
 */
export default function Board(props: TimerProps) {
	
	useEffect(() => {
		const white_timer = document.querySelector('.white-player-timer') as HTMLElement;
		const black_timer = document.querySelector('.black-player-timer') as HTMLElement;

		const white_percent = props.white.time / props.white.startTime * 100;
		const black_percent = props.black.time / props.black.startTime * 100;
		white_timer.style.backgroundImage = `linear-gradient(to right, #fff, #fff ${white_percent}%, #000 ${white_percent}%, #000 100%)`;
		black_timer.style.backgroundImage = `linear-gradient(to right, #000, #000 ${black_percent}%, #fff ${black_percent}%, #fff 100%)`;

		white_timer.style.transition = 'background-image 0.5s';
		black_timer.style.transition = 'background-image 0.5s';
	});

	useState(() => {
		const interval = setInterval(() => {
			if(props.white.time > 0) {
				props.white.time -= 1;
				setWhiteTimer(createPlayerTimer(props.white, 'white'));
			}
			if(props.black.time > 0) {
				props.black.time -= 1;
				setBlackTimer(createPlayerTimer(props.black, 'black'));
			}
		}, 1000);
		return () => clearInterval(interval);
	});

	const [white_timer, setWhiteTimer] = useState(createPlayerTimer(props.white, 'white'));
	const [black_timer, setBlackTimer] = useState(createPlayerTimer(props.black, 'black'));

	return (
		<div className='timers'>
			{white_timer}
			{black_timer}
		</div>
	)
}