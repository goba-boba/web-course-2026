import { generateSecretNumber, validateInput, countBullsAndCows } from './logic.js';
import * as ui from './ui.js';

let secretNumber = [];
let history = [];
let attempts = 0;
let isGameOver = false;

function handleCheck() {
    if (isGameOver) return;

    const guess = ui.getInputValue();
    const error = validateInput(guess);

    if (error) {
        ui.showMessage(error);
        return;
    }

    ui.clearMessage();
    attempts++;

    const { bulls, cows } = countBullsAndCows(secretNumber, guess);
    history.push({ guess, bulls, cows });

    if (bulls === 4) {
        isGameOver = true;
        ui.showMessage(`🌻 Победа! Угадано за ${attempts} попыток!`, true);
        ui.setGameOverState(true);
    }

    ui.clearInput();
    ui.renderHistory(history);
    ui.updateAttempts(attempts);
}

function resetGame() {
    secretNumber = generateSecretNumber();
    history = [];
    attempts = 0;
    isGameOver = false;
    
    ui.clearMessage();
    ui.clearInput();
    ui.setGameOverState(false);
    ui.renderHistory(history);
    ui.updateAttempts(attempts);
}

// Подписка на события
ui.elements.checkBtn.addEventListener('click', handleCheck);

ui.elements.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

ui.elements.newGameBtn.addEventListener('click', resetGame);

// Запуск игры при загрузке
resetGame();