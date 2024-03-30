import Board from "./Board";

import './page.css'

export default function Home() {
  return <div id="page">
		<Board
			flip = {false}
			timeSettings = {{
				white: {
					startTime: 60,
					time: 45,
					increment: 1
				},
				black: {
					startTime: 60,
					time: 30,
					increment: 1
				}
			}}
			players = {[
				{
					name: 'Stockfish',
					elo: 3700,
					time: null
				},
				{
					name: 'Torch',
					elo: 3500,
					time: null
				}
			]}
			history = {[]}
			messages = {[]}
		/>
	</div>;
}