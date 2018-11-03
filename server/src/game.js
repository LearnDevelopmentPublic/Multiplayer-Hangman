export class Game {
  constructor() {
    this.words = ['melon', 'car', 'airplane', 'pig', 'piano'];
    this.word = this.pickRandomWord(this.words);
    this.blankWord = this.toBlankWord(this.word);
    this.guesses = [];
    this.correct = 0;
    this.incorrect = 0;
    this.status = 'active';
    this.announceGame();
  }

  newGuess(letter) {
    // Guess is false in the start
    let guessedCorrectly = false;

    // Checks if there are previous guesses
    if (this.guesses.length > 0) {
      let guessFound = this.guesses.findIndex(guess => {
        return guess === letter;
      });

      if (guessFound !== -1) return 'repeatGuess';
      if (/[^\w\.\-]/.test(letter)) return 'invalidCharacter';
    } else {
      this.guesses.push(letter);

      let blankWordArray = this.blankWord.split(' ');
      // Updates mystery/blank word based on guesses
      for (let i = 0; i < this.word.length; i++) {
        if (this.word.charAt(i) === letter) {
          blankWordArray[i] = letter;
          // Guess is correct
          guessedCorrectly = true;
        }
      }

      this.blankWord = blankWordArray.join(' ');

      return (guessedCorrectly) ? this.incorrectGuess() : this.correctGuess();
    }
  }

  incorrectGuess() {
    this.incorrect++;

    if (this.blankWord.split(' ').join('') !== this.word) {
      return 'incorrectGuess';
    }

    this.status = 'inactive';
    return 'victory';
  }

  correctGuess() {
    this.correct++;

    if (this.blankWord.split(' ').join('') !== this.word) {
      return 'correctGuess';
    }

    this.status = 'inactive';
    return 'victory';
  }

  getState(guesser) {
    let gameState = {
      blankword: this.blankWord,
      guesses: this.guesses,
      correct: this.correct,
      incorrect: this.incorrect,
      status: this.status
    };

    if (guesser) gameState.guesser = guesser;

    return gameState;
  }

  pickRandomWord(words) {
    return words[Math.floor(Math.random() * words.length)].toLowerCase();
  }

  toBlankWord(word) {
    return word
      .replace(/\w/g, '_')
      .split('')
      .join(' ');
  }

  announceGame() {
    console.log(`New game started: ${this.word} --> ${this.blankWord}`);
  }
}
