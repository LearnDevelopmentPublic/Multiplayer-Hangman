var io = require("socket.io-client");
var socket = io('http://localhost:5000');
var clientGame = require('./clientGame.js').clientGame;
var game = null;

// We should move all of this ! We may need to pass a socket instance to the game if the reason this is here is 
// down to the fact that data doesn't flow from clientGame to clientSocket ( i.e a simple example, to pass the letter guess to here )
var onlinePlayers = document.querySelector('*[data-online-players]');
var guessSubmit = document.querySelector('*[data-guess-submit]');
var guessInput = document.querySelector('[data-guess-input]');
console.log(guessInput);
guessSubmit.addEventListener('click', function(){
	submitGuess(guessInput.value);
	guessInput.value = '';
});
// Initialize any special keypresses
document.onkeydown = function(e){ 
	// This isn't the right place for this, but since the guess submit events are hooked in here, and
	// the data isn't available elsewhere, it is temporarily here.
	// May require a bit of extra handling to avoid double fires/unwanted behaviour
	if (e.keyCode == 13) {		  
		submitGuess();
	}
	var isLowercaseLetter = 65 <= e.keyCode && e.keyCode <= 90; // Only lowercase seems to be necessary due to onkeydown
	if (isLowercaseLetter) {
		guessInput.value = e.key;
	}

}; 

export function setUsername(username) {
	socket.emit('setUsername', username);
}

export function submitGuess() {
	var letter = guessInput.value;
	if(/^[a-zA-Z]*$/.test(letter) === true && letter != ''){
		let guessFound = game.gameState.guesses.find((guess) => {
	      return guess === letter;
	    });
	    if(guessFound === letter){
	    	game.invalidGuess();
	    	return;
	    }
		socket.emit('newGuess', letter);
	} else if(/^[a-zA-Z]*$/.test(letter) === false || letter == ''){
		game.invalidGuess();
		return;
	}
	
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

