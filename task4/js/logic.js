export function generateSecretNumber() {
    const digits = [];
    while (digits.length < 4) {
        const randomDigit = Math.floor(Math.random() * 10).toString();
        if (!digits.includes(randomDigit)) {
            digits.push(randomDigit);
        }
    }
    return digits;
}

export function validateInput(value) {
    if (!/^\d{4}$/.test(value)) {
        return 'Введите ровно 4 цифры (только цифры)';
    }
    const uniqueDigits = new Set(value.split(''));
    if (uniqueDigits.size !== 4) {
        return 'Все цифры должны быть разными';
    }
    return null;
}

export function countBullsAndCows(secret, guess) {
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