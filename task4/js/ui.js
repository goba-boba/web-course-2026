const elements = {
    input: document.getElementById('guess-input'),
    checkBtn: document.getElementById('check-btn'),
    newGameBtn: document.getElementById('new-game-btn'),
    errorMsg: document.getElementById('error-message'),
    historyList: document.getElementById('history-list'),
    attemptsCounter: document.getElementById('attempts-counter')
};

export function renderHistory(history) {
    elements.historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        const guessSpan = document.createElement('span');
        const resultSpan = document.createElement('span');

        guessSpan.textContent = item.guess;
        resultSpan.textContent = `🐂 ${item.bulls} · 🐄 ${item.cows}`;

        li.appendChild(guessSpan);
        li.appendChild(resultSpan);
        elements.historyList.appendChild(li);
    });
}

export function updateAttempts(count) {
    elements.attemptsCounter.textContent = count;
}

export function showMessage(text, isSuccess = false) {
    elements.errorMsg.textContent = text;
    elements.errorMsg.style.color = isSuccess ? '#2a7d44' : '#b03a2e';
}

export function clearMessage() {
    elements.errorMsg.textContent = '';
}

export function clearInput() {
    elements.input.value = '';
}

export function setGameOverState(isOver) {
    if (isOver) {
        elements.input.disabled = true;
        elements.checkBtn.disabled = true;
    } else {
        elements.input.disabled = false;
        elements.checkBtn.disabled = false;
    }
}

export function getInputValue() {
    return elements.input.value.trim();
}

export { elements };