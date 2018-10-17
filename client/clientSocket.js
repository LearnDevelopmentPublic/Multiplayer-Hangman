var io = require("socket.io-client");
var socket = io('http://localhost:5000');
var clientGame = require('./clientGame.js').clientGame;
var game = null;

export function setUsername(username) {
	socket.emit('setUsername', username);
}

export function sendToServer(eventName, data=null) { // Can be deleted if we migrate to passing data directly to clientGame.js
	socket.emit(eventName, data)
}

socket.on('playersOnline', function(count){
	onlinePlayers.innerHTML = count;
});

socket.on('gameInformation', (data) => {
	game = new clientGame(data); //passing data allows correct rendering of current games hangman 
});

// I take it the events below are going to be migrated into the event above ^ and passed to game to handle it's own events
socket.on('repeatGuess', (data) => {
	game.invalidGuess();
});

socket.on('invalidCharacter', (data) => {
	game.invalidGuess();
});

socket.on('incorrectGuess', (data) => {
	game.incorrectGuess(data);
});

socket.on('correctGuess', (data) => {
	game.correctGuess(data);
});

socket.on('victory', (data) => {
	game.victory(data);
});

socket.on('gameOver', (data) => {
	game.gameOver(data);
});

socket.on('newGame', (data) => {
	game.newGame(data);
});

