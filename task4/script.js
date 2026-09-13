let secretNumber = [];
let history = [];
let attempts = 0;
let isGameOver = false;

const input = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const errorMsg = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const attemptsCounter = document.getElementById('attempts-counter');

function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const randomDigit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits;
}

function validateInput(value) {
    if (!/^\d{4}$/.test(value)) {
        return 'Введите ровно 4 цифры (только цифры)';
    }
    const uniqueDigits = new Set(value.split(''));
    if (uniqueDigits.size !== 4) {
        return 'Все цифры должны быть разными';
    }
    return null;
}

function countBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;
    const guessArr = guess.split('');

    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guessArr[i])) {
            cows++;
        }
    }
    return { bulls, cows };
}

function render() {
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const li = document.createElement('li');
        const guessSpan = document.createElement('span');
        const resultSpan = document.createElement('span');
        
        guessSpan.textContent = item.guess;
        resultSpan.textContent = `${item.bulls} бык(а), ${item.cows} коров(ы)`;
        
        li.appendChild(guessSpan);
        li.appendChild(resultSpan);
        historyList.appendChild(li);
    });

    attemptsCounter.textContent = `Попыток: ${attempts}`;

    if (isGameOver) {
        input.disabled = true;
        checkBtn.disabled = true;
        input.value = '';
    } else {
        input.disabled = false;
        checkBtn.disabled = false;
    }
}

function handleCheck() {
    if (isGameOver) return;

    const guess = input.value.trim();
    const error = validateInput(guess);

    if (error) {
        errorMsg.textContent = error;
        return;
    }

    errorMsg.textContent = '';
    attempts++;

    const { bulls, cows } = countBullsAndCows(secretNumber, guess);

    history.push({ guess, bulls, cows });

    if (bulls === 4) {
        isGameOver = true;
        errorMsg.textContent = `Победа! Угадано за ${attempts} попыток!`;
        errorMsg.style.color = '#28a745';
    }

    input.value = '';
    render();
}

function resetGame() {
    secretNumber = generateSecretNumber();
    history = [];
    attempts = 0;
    isGameOver = false;
    errorMsg.textContent = '';
    errorMsg.style.color = '#dc3545';
    input.value = '';
    input.disabled = false;
    checkBtn.disabled = false;
    render();
}

checkBtn.addEventListener('click', handleCheck);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

newGameBtn.addEventListener('click', resetGame);

resetGame();