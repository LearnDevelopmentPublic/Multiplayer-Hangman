var io = require("socket.io-client");
var socket = io('http://localhost:5000');

let gameMessage = document.getElementById('game-message');
let secretWord = document.getElementById('secret-word-container');
let userGuesses = document.getElementById('user-guesses');
let onlinePlayers = document.getElementById('onlinePlayers');
let guessInput = document.getElementById('guessInput');
let usernameInput = document.getElementById('usernameInput');
let guessSubmit = document.getElementById('guess-submit');
let usernameSubmit = document.getElementById('username-submit');

const namePattern = /^[A-Za-z]+$/; // Regex that only accept letters without spaces
const oneLetterPattern = /^(a|A)$/; // Regex that only accept one letter

guessSubmit.addEventListener('click', function(){
    if(guessInput.value === oneLetterPattern){  // Check if guessInput is a letter
    	submitGuess(guessInput.value);
    } else {					// Otherwise alert the user that input is invalid
	alert("You should enter a valid one letter!");
    };
	
    guessInput.value = '';
});

usernameSubmit.addEventListener('click', function(){
	
    if(guessInput.value === namePattern){ // Check if name is a valid username
    	submitGuess(usernameInput.value);
    } else {				  // Otherwise alert the user that input is invalid
	alert("You should enter a username using only letters!");
    };
    setUsername(usernameInput.value);
});

function setUsername(username) {
	socket.emit('setUsername', username);
}

function submitGuess(letter) {
	let guessFound = userGuesses.innerHTML.split(',').find((guess) => {
      return guess === letter;
    });
    if(guessFound === letter){
    	gameMessage.innerHTML = "That letter has already been guessed!";
    	return;
    }
	socket.emit('newGuess', letter);
}

function updateGameState(data) {
	secretWord.innerHTML = data.blankword;
	userGuesses.innerHTML = 'Guesses: ' + data.guesses;
}

socket.on('playersOnline', function(count){
	onlinePlayers.innerHTML = count;
});

socket.on('gameInformation', (data) => {
	updateGameState(data);
});

socket.on('repeatGuess', (data) => {
	gameMessage.innerHTML = "That letter has already been guessed!";
});

socket.on('invalidCharacter', (data) => {
	gameMessage.innerHTML = "That letter has invalid";
});


socket.on('incorrectGuess', (data) => {
	updateGameState(data);
	gameMessage.innerHTML = data.guesser + ' guessed incorrectly. There are ' + (6 - data.incorrect) + ' guesses left.';
});

socket.on('correctGuess', (data) => {
	updateGameState(data);
	gameMessage.innerHTML = data.guesser + ' guessed correctly!';
});

socket.on('victory', (data) => {
	guessSubmit.disabled = true;
	updateGameState(data);
	gameMessage.innerHTML = '<span style="color: green">' + data.guesser + ' guessed correctly to win the game! Victory!</span>';
});

socket.on('gameOver', (data) => {
	guessSubmit.disabled = true;
	updateGameState(data);
	gameMessage.innerHTML = '<span style="color: red">' + data.guesser + ' guessed wrong. Game Over!</span>';
});

socket.on('newGame', (data) => {
	guessSubmit.disabled = false;
	updateGameState(data);
	gameMessage.innerHTML = 'New game has started!';
});
