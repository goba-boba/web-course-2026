import { sleep, getRandomInt } from './utils.js';
import * as ui from './ui.js';

// Состояние игры
let sequence = [];
let userSequence = [];
let level = 0;
let isPlaying = false;
let isGameOver = false;

async function playSequence() {
    isPlaying = true;
    ui.setBoardDisabled(true); // Блокируем клики
    ui.updateStatus('Смотрите внимательно...');
    
    await sleep(1000); // Пауза перед началом

    for (let i = 0; i < sequence.length; i++) {
        const sectorId = sequence[i];
        ui.highlightSector(sectorId);
        await sleep(500); // Горит 500мс
        ui.unhighlightSector(sectorId);
        await sleep(250); // Пауза между вспышками
    }

    ui.updateStatus('Ваш ход!');
    isPlaying = false;
    ui.setBoardDisabled(false); // Разблокируем клики
    userSequence = []; // Очищаем ввод
}

function handleSectorClick(id) {
    // Если компьютер показывает или игра кончилась — игнорируем клик
    if (isPlaying || isGameOver) return;

    userSequence.push(id);
    ui.flashUserClick(id);

    const index = userSequence.length - 1;

    // Проверка на ошибку
    if (userSequence[index] !== sequence[index]) {
        gameOver();
        return;
    }

    // Если раунд пройден
    if (userSequence.length === sequence.length) {
        level++;
        ui.updateStatus(`Уровень: ${level}`);
        sequence.push(getRandomInt(4)); // Добавляем новый шаг
        setTimeout(playSequence, 1000); // Показываем через секунду
    }
}

function startGame() {
    sequence = [getRandomInt(4)]; // Начинаем с 1 шага
    userSequence = [];
    level = 1;
    isGameOver = false;
    isPlaying = false;
    ui.updateStatus(`Уровень: ${level}`);
    ui.setStartBtnText('СТАРТ');
    playSequence();
}

function gameOver() {
    isGameOver = true;
    isPlaying = false;
    ui.updateStatus(`Игра окончена! Вы дошли до уровня ${level}`);
    ui.setBoardDisabled(true);
    ui.setStartBtnText('ЗАНОВО');
}

// Передаем колбэки в UI
ui.initUI({
    onStart: startGame,
    onSectorClick: handleSectorClick
});