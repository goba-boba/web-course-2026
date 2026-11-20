import * as config from './config.js';
import { createInitialState, spawnApple, update } from './logic.js';
import { draw } from './render.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let state = {};
let lastMoveTime = 0;

function initGame() {
    state = createInitialState();
    spawnApple(state, config.TILE_COUNT);
    lastMoveTime = performance.now();
    
    scoreEl.textContent = state.score;
    restartBtn.classList.add('hidden');
    
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (state.gameOver) {
        draw(ctx, canvas, state, config);
        return;
    }

    const deltaTime = timestamp - lastMoveTime;
    
    if (deltaTime >= config.MOVE_INTERVAL) {
        update(state, config.TILE_COUNT);
        lastMoveTime = timestamp;
        scoreEl.textContent = state.score;
        
        if (state.gameOver) {
            restartBtn.classList.remove('hidden');
        }
    }
    
    draw(ctx, canvas, state, config);
    requestAnimationFrame(gameLoop);
}

function handleKeydown(e) {
    if (state.gameOver) return;
    
    const key = e.key;
    let newDir = null;

    if (key === 'ArrowUp' && state.direction.y === 0) newDir = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && state.direction.y === 0) newDir = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && state.direction.x === 0) newDir = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && state.direction.x === 0) newDir = { x: 1, y: 0 };

    if (newDir) {
        state.nextDirection = newDir;
        e.preventDefault();
    }
}

window.addEventListener('keydown', handleKeydown);
restartBtn.addEventListener('click', initGame);

initGame();