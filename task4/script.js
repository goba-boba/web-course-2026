// состояние игры - четыре переменные
let secretNumber = [];   // загаданные 4 цифры, например массив из строк '3' '7' '1' '9'
let history = [];        // все ходы - объекты вида guess bulls cows
let attempts = 0;        // сколько попыток сделано
let isGameOver = false;  // игра закончена или нет

// кэшируем элементы - нашли один раз, дальше используем переменные
const input = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const errorMsg = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const attemptsCounter = document.getElementById('attempts-counter');

// генерирует 4 разные цифры - возвращает массив строк
function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {                                 // крутимся пока не наберём 4 цифры
        const randomDigit = Math.floor(Math.random() * 10).toString();  // случайная цифра от 0 до 9 как строка
        if (!digits.includes(randomDigit)) {                   // проверка уникальности - если такой ещё нет
            digits.push(randomDigit);                           // добавляем
        }
    }
    return digits;
}

// проверяет ввод - возвращает строку ошибки или null если всё ок
function validateInput(value) {
    if (!/^\d{4}$/.test(value)) {                              // регулярка - ровно 4 цифры и ничего больше
        return 'Введите ровно 4 цифры (только цифры)';
    }
    const uniqueDigits = new Set(value.split(''));             // set убирает дубликаты
    if (uniqueDigits.size !== 4) {                             // если после удаления дублей стало меньше 4
        return 'Все цифры должны быть разными';
    }
    return null;
}

// считает быков и коров - сердце игры
function countBullsAndCows(secret, guess) {
    let bulls = 0;
    let cows = 0;
    const guessArr = guess.split('');                          // строку в массив символов

    for (let i = 0; i < 4; i++) {
        if (guessArr[i] === secret[i]) {                       // цифра на своём месте - бык
            bulls++;
        } else if (secret.includes(guessArr[i])) {             // цифра есть но не на месте - корова
            cows++;                                            // else if важен - цифра не может быть и быком и коровой
        }
    }
    return { bulls, cows };
}

// рисует историю ходов, счётчик и блокировку
function render() {
    historyList.innerHTML = '';                                // стираем старую историю

    history.forEach(item => {
        const li = document.createElement('li');
        const guessSpan = document.createElement('span');
        const resultSpan = document.createElement('span');

        guessSpan.textContent = item.guess;
        resultSpan.textContent = `🐂 ${item.bulls} · 🐄 ${item.cows}`;

        li.appendChild(guessSpan);
        li.appendChild(resultSpan);
        historyList.appendChild(li);
    });

    attemptsCounter.textContent = attempts;                    // обновляем счётчик

    if (isGameOver) {                                          // игра кончена - блокируем ввод
        input.disabled = true;
        checkBtn.disabled = true;
        input.value = '';
    } else {
        input.disabled = false;
        checkBtn.disabled = false;
    }
}

// проверяет ход игрока
function handleCheck() {
    if (isGameOver) return;                                    // игра уже кончилась - выходим

    const guess = input.value.trim();
    const error = validateInput(guess);

    if (error) {                                               // есть ошибка - показали и вышли, ход не засчитан
        errorMsg.textContent = error;
        return;
    }

    errorMsg.textContent = '';                                 // ошибок нет - чистим сообщение
    attempts++;                                                // плюс одна попытка

    const { bulls, cows } = countBullsAndCows(secretNumber, guess);  // деструктуризация - сразу две переменные

    history.push({ guess, bulls, cows });                      // добавляем ход в историю

    if (bulls === 4) {                                         // 4 быка это победа
        isGameOver = true;
        errorMsg.textContent = `🌻 Победа! Угадано за ${attempts} попыток!`;
        errorMsg.style.color = '#2a7d44';                      // зелёный цвет для победы
    }

    input.value = '';
    render();
}

// новая игра - сбрасывает всё
function resetGame() {
    secretNumber = generateSecretNumber();                     // новое число
    history = [];                                              // чистая история
    attempts = 0;                                              // 0 попыток
    isGameOver = false;                                        // игра не кончена
    errorMsg.textContent = '';                                 // пустое сообщение
    errorMsg.style.color = '#b03a2e';                          // возвращаем красный цвет
    input.value = '';                                          // пустое поле
    input.disabled = false;                                    // разблокировали
    checkBtn.disabled = false;
    render();
}

// обработчики
checkBtn.addEventListener('click', handleCheck);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {                                   // enter в поле тоже проверяет
        handleCheck();
    }
});

newGameBtn.addEventListener('click', resetGame);

// запуск при загрузке - сразу генерируется число и рисуется пустая история
resetGame();
