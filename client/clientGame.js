import * as socket from './clientSocket.js';
var clientDisplay = require('./clientDisplay.js').clientDisplay;
var display = null;

export class clientGame {
    // This code should take a data object from the socket
    // run any logic the client needs, and bounce visual effects
    // to clientDisplay. 

    constructor(gameInfo) {
        this.gameState = gameInfo;
        this.display = new clientDisplay(this.gameState);
        this.loadGame();
        this.initKeyboard();
    }

    useDisplay(function_name){
        // Use this to send any events to the display for rendering/user visible events.
        this.display.gameState = this.gameState;
        this.display[function_name]();
    }
    
    loadGame() {
        //Initializes clientDisplay
        this.useDisplay('loadGame');
    }

    reset() { 
        this.useDisplay('reset');
    }

    incorrectGuess(data) {
        this.gameState = data;
        this.display.newGuess(data, 'incorrect');
        this.useDisplay('revealPart');
    }

    correctGuess(data) {
        this.gameState = data;
        this.display.newGuess(data, 'correct');
    }

    invalidGuess() {
        this.display.newGuess(this.gameState, 'invalid');
    }

    gameOver(data) {
        this.useDisplay('reset');
        this.display.endGame(data, 'gameOver');
    }

    victory(data) {
        this.display.endGame(data, 'victory');
    }

    newGame(data) {
        this.display.endGame(data, 'newGame');
        this.reset();
        this.gameState = data;
    }

    submitGuess() { // This has just been copy pasted over from clientSocket, and could do with a refactor
        var onlinePlayers = document.querySelectorAll('*[data-online-players]')[0];
        var guessSubmit = document.querySelectorAll('*[data-guess-submit]')[0];
        var guessInput = document.querySelectorAll('[data-guess-input]')[0];
        var letter = guessInput.value;
        var isAValidCharacter = /^[a-zA-Z]*$/.test(letter) === true && letter != '';
        var isAnInvalidCharacter = /^[a-zA-Z]*$/.test(letter) === false || letter == '';
        if(isAValidCharacter){
            let guessFound = this.gameState.guesses.find((guess) => {
              return guess === letter;
            });
            if(guessFound === letter){
                this.invalidGuess();
                return;
            }
            socket.sendToServer('newGuess', letter);
        } else if(isAnInvalidCharacter){
            this.invalidGuess();
            return;
        }   
    }

    initKeyboard() {
        // Initialize any special keypresses
        var self = this;
        document.onkeydown = function(e){ 
            // This isn't the right place for this, but since the guess submit events are hooked in here, and
            // the data isn't available elsewhere, it is temporarily here.
            // May require a bit of extra handling to avoid double fires/unwanted behaviour
            if (e.keyCode == 13) {		  
                socket.sendToServer('submitGuess');
                self.submitGuess();
            }
            var isLowercaseLetter = 65 <= e.keyCode && e.keyCode <= 90; // Only lowercase seems to be necessary due to onkeydown
            if (isLowercaseLetter) {
                guessInput.value = e.key;
            }
        }
    }
}