//add colors//
export default class Controller {
	constructor(store, view) {
		this.store = store;
		this.view = view;

		this.view.setSecretWordDisplay(this.store.secretWord);
		this.view.setGameView();
		view.bindSaveUserGuess(this.saveUserGuess.bind(this));
	}

	/**
	 * Receives guess input from view, tells store to save it and then call updateSecretWord
	 * @param {string} guess - single character guess made by the user
	 */
	saveUserGuess(guess){
		this.store.saveGuess(guess, (secretWordUpdate, gameUpdate) => {
			this.updateSecretWord(secretWordUpdate, gameUpdate);
		});
    }


	updateSecretWord(secretWordUpdate, gameUpdate){
		this.view.updateSecretWordDisplay(secretWordUpdate, gameUpdate);
	}

}
