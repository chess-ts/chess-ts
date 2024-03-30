import { Server } from 'socket.io'
import { createServer } from 'http'
import { Engine } from './engine/Engine.js'

const httpServer = createServer()
const io = new Server(
	httpServer,
	{
		cors: {
			origin: '*',
		}
	}
)

const MAX_PLAYERS = 2
let players = []
let uci = ''

io.on('connection', (socket) => {
	// Player disconnects
	socket.on('disconnect', () => {
		players = players.filter(player => player.socket !== socket)
		if(players.length === 0) {
			uci = ''
		}
	})
	// Player joins (name: string)
	socket.on('join', (name) => {
		// If the game is not full
		if (players.length < MAX_PLAYERS) {
			// Add the player to the players array
			players.push({
				player: {
					name,
					isWhite: players.length === 0 ? true : false // If there are no players, the player is white, otherwise, the player is black
				},
				socket
			})
			// Log the player's name and color
			console.log(`${name} (${players.length === 1 ? 'WHITE' : 'BLACK'}) joined the game`)
			socket.emit('color', players.length === 1 ? 'white' : 'black')
			// If the game is full
			if(players.length === MAX_PLAYERS) {
				// Log that the game started
				broadcast('start')
			}
		} else {
			// Log the room is full
			console.log('The room is full')
			// If the game is full, emit a 'full' event
			socket.emit('full')
			// Disconnect the player
			socket.disconnect()
		}
	})
	socket.on('can_i_move', callback => callback(isTurn(getPlayer(socket))))
	// Player moves (move: { from: [number, number], to: [number, number], promotion: string })
	socket.on('move', (move) => {
		// Get the player from the socket
		const p = getPlayer(socket)
		// If it's the player's turn
		if (isTurn(p)) {
			// If the move is valid
			if(isValidMove(move)) {
				// Get the players parameters
				const player = p.player
				// Move the piece
				const result = Engine.Move(uci, move.from, move.to, move.promotion)
				// Update the uci
				uci = result.uci
				// Broadcast the uci
				broadcast('uci', uci)
				// Log the move
				console.log(`${player.name} (${player.isWhite ? 'WHITE' : 'BLACK'}) played ${move.from} to ${move.to}`)
				// Status
				switch(result.status.status) {
					// If the status is checkmate
					case 'checkmate':
						// Log the move
						// Log the winner
						console.log(`CHECKMATE! ${result.status.winner.toUpperCase()} wins!`)
						// Emit the status event
						broadcast('status', true, true, result.status.winner)
						break
					// If the status is draw
					case 'draw':
						// Log the draw reason
						console.log(`DRAW! It's a draw (${result.status.reason})!`)
						// Emit the status event
						broadcast('status', true, false, result.status.reason)
						break
					// If the status is ongoing
					case 'ongoing':
						// If the status is check
						if(result.status.check !== 'none') {
							// Log check
							console.log(`CHECK!`)
							// Emit the status event
							broadcast('status', false, true)
						} else {
							// Emit the status event
							broadcast('status')
						}
						break
				}
				// Log the board
				console.log(Engine.BoardToString(uci))
			}
		} else {
			// Log that it's not the player's turn
			console.log(`Not ${p.player.name}'s turn`)
			// If it's not the player's turn, emit an error event
			socket.emit('error', 'Not your turn')
		}
	})
})

/**
 * Check if it's the player's turn
 * @param {{
 * 	player: {
 * 		name: string,
 * 		isWhite: boolean
 * 	},
 * 	socket: Socket
 * }} player The player to check if it's their turn
 * @returns {boolean} If it's the player's turn
 */
const isTurn = player => (uci.split(' ')[0] === '') ? player.player.isWhite : (player.player.isWhite === (uci.split(' ').length % 2 === 0))

/**
 * Get the player from the socket
 * @param {Socket} socket The socket to get the player from
 * @returns {{
 * 	player: {
 * 		name: string,
 * 		isWhite: boolean
 * 	},
 * 	socket: Socket
 * }} player The player from the socket
 */
const getPlayer = socket => players.filter(player => player.socket === socket)[0]

/**
 * Check if the move is valid
 * @param {{
 *	from: [number, number],
 * 	to: [number, number],
 * 	promotion: string
 * }} move The move to check if it's valid
 * @returns {boolean} If the move is valid
 */
const isValidMove = move => Engine.GetMoves(uci, move.from).filter(m => JSON.stringify(m.to) === JSON.stringify(move.to)).length > 0

/**
 * Broadcast an event to all the players
 * @param {string} event The event to broadcast
 * @param  {...any} args The arguments to the event
 */
const broadcast = (event, ...args) => {
	players.forEach(player => {
		args.length ? player.socket.emit(event, ...args) : player.socket.emit(event)
	})
}

httpServer.listen(3333)