const board = document.getElementById('board');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');

let sequence = [];
let userSequence = [];
let level = 0;
let isPlaying = false;
let isGameOver = false;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getRandomInt() {
    return Math.floor(Math.random() * 4);
}

async function playSequence() {
    isPlaying = true;
    board.classList.add('disabled');
    statusEl.textContent = 'Смотрите внимательно...';
    
    await sleep(1000);

    for (let i = 0; i < sequence.length; i++) {
        const sectorId = sequence[i];
        const sector = document.querySelector(`.sector[data-id="${sectorId}"]`);
        
        sector.classList.add('active');
        await sleep(500);
        sector.classList.remove('active');
        await sleep(250);
    }

    statusEl.textContent = 'Ваш ход!';
    isPlaying = false;
    board.classList.remove('disabled');
    userSequence = [];
}

function handleUserInput(e) {
    if (isPlaying || isGameOver) return;
    
    const sector = e.target.closest('.sector');
    if (!sector) return;

    const id = parseInt(sector.dataset.id);
    userSequence.push(id);

    sector.classList.add('active');
    setTimeout(() => sector.classList.remove('active'), 300);

    const index = userSequence.length - 1;

    if (userSequence[index] !== sequence[index]) {
        gameOver();
        return;
    }

    if (userSequence.length === sequence.length) {
        level++;
        statusEl.textContent = `Уровень: ${level}`;
        sequence.push(getRandomInt());
        setTimeout(playSequence, 1000);
    }
}

function startGame() {
    sequence = [getRandomInt()];
    userSequence = [];
    level = 1;
    isGameOver = false;
    isPlaying = false;
    statusEl.textContent = `Уровень: ${level}`;
    playSequence();
}

function gameOver() {
    isGameOver = true;
    isPlaying = false;
    statusEl.textContent = `Игра окончена! Вы дошли до уровня ${level}`;
    board.classList.add('disabled');
    startBtn.querySelector('span').textContent = 'ЗАНОВО';
}

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    board.classList.remove('disabled');
    startBtn.querySelector('span').textContent = 'СТАРТ';
    startGame();
});

board.addEventListener('click', handleUserInput);