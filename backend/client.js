import { io } from "socket.io-client"

const socket = io('ws://localhost:3333')

socket.emit('join', 'Icy')

socket.on('full', () => {
	console.log('[FULL] : The room is full')
})

socket.on('start', () => {
	console.log('[START] : The game started')
	canIMove()
	// socket.emit('move', {
	// 	from: [1, 4],
	// 	to: [3, 4],
	// 	promotion: 'queen'
	// })
})

const canIMove = () => {
	socket.emit('can_i_move')
	socket.on('can_move', () => {
		console.log('You can move!')
	})
}

socket.on('status', (isEndOfGame, isCheckmateOrCheck = false, winnerOrDrawType = null) => {
	if(isEndOfGame) {
		if(isCheckmateOrCheck) {
			console.log(`[STATUS] CHECKMATE! ${winnerOrDrawType.toUpperCase()} wins!`)
			socket.disconnect()
		} else {
			console.log(`[STATUS] DRAW! It's a draw (${winnerOrDrawType})!`)
			socket.disconnect()
		}
	} else {
		if(isCheckmateOrCheck) {
			console.log(`[STATUS] CHECK! The game continues...`)
		} else {
			console.log('[STATUS] Game continues...')
		}
	}
})

socket.on('error', (error) => {
	console.error(`[ERROR] : ${error}`)
})