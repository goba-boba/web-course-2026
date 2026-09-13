const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

const GRID_SIZE = 20;
const TILE_COUNT = 20;
const MOVE_INTERVAL = 150;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let apple = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let lastMoveTime = 0;
let heartbeat = 0;

function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameOver = false;
    lastMoveTime = performance.now();
    
    scoreEl.textContent = score;
    restartBtn.classList.add('hidden');
    
    spawnApple();
    requestAnimationFrame(gameLoop);
}

function spawnApple() {
    let newApple;
    let isOccupied = true;
    
    while (isOccupied) {
        newApple = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
        
        isOccupied = snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }
    
    apple = newApple;
}

function checkCollision(x, y) {
    if (x < 0 || x >= TILE_COUNT || y < 0 || y >= TILE_COUNT) {
        return true;
    }
    return snake.some(segment => segment.x === x && segment.y === y);
}

function moveSnake() {
    direction = { ...nextDirection };
    
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (checkCollision(newHead.x, newHead.y)) {
        gameOver = true;
        restartBtn.classList.remove('hidden');
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === apple.x && newHead.y === apple.y) {
        score += 10;
        scoreEl.textContent = score;
        spawnApple();
    } else {
        snake.pop();
    }
}

function update() {
    if (gameOver) return;
    moveSnake();
}

function drawHeart(cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(0.85, 1.2);
    ctx.translate(-cx, -cy);
    
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.4);
    ctx.bezierCurveTo(
        cx, cy - size * 0.1,
        cx - size, cy - size * 0.2,
        cx - size, cy - size * 0.6
    );
    ctx.bezierCurveTo(
        cx - size, cy - size * 1.1,
        cx, cy - size * 1.1,
        cx, cy - size * 0.5
    );
    ctx.bezierCurveTo(
        cx, cy - size * 1.1,
        cx + size, cy - size * 1.1,
        cx + size, cy - size * 0.6
    );
    ctx.bezierCurveTo(
        cx + size, cy - size * 0.2,
        cx, cy - size * 0.1,
        cx, cy + size * 0.4
    );
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < TILE_COUNT; i++) {
        for (let j = 0; j < TILE_COUNT; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? '#1a1033' : '#221441';
            ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    heartbeat += 0.08;
    const pulse = 1 + Math.sin(heartbeat) * 0.12;
    const heartCx = apple.x * GRID_SIZE + GRID_SIZE / 2;
    const heartCy = apple.y * GRID_SIZE + GRID_SIZE / 2;
    const heartSize = (GRID_SIZE / 2) * 0.9 * pulse;

    ctx.shadowColor = '#ff2d55';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff2d55';
    drawHeart(heartCx, heartCy, heartSize);
    ctx.shadowBlur = 0;

    snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        
        if (index === 0) {
            ctx.fillStyle = '#ff8fff';
            ctx.shadowColor = '#ff8fff';
            ctx.shadowBlur = 20;
        } else {
            const alpha = 1 - (index / snake.length) * 0.4;
            ctx.fillStyle = `rgba(224, 102, 255, ${alpha})`;
            ctx.shadowColor = '#e066ff';
            ctx.shadowBlur = 8;
        }
        
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        if (index === 0) {
            const eyeOffsetX = direction.x * 3;
            const eyeOffsetY = direction.y * 3;
            const perpX = direction.y * 4;
            const perpY = -direction.x * 4;
            
            ctx.fillStyle = '#1a1033';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE / 2 + eyeOffsetX + perpX, y + GRID_SIZE / 2 + eyeOffsetY + perpY, 2.5, 0, Math.PI * 2);
            ctx.arc(x + GRID_SIZE / 2 + eyeOffsetX - perpX, y + GRID_SIZE / 2 + eyeOffsetY - perpY, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    if (gameOver) {
        ctx.fillStyle = 'rgba(26, 16, 51, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.shadowColor = '#ff2d55';
        ctx.shadowBlur = 25;
        ctx.fillStyle = '#ff8fab';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#e066ff';
        ctx.font = 'bold 22px Arial';
        ctx.fillText(`Ваш счёт: ${score}`, canvas.width / 2, canvas.height / 2 + 25);
    }
}

function gameLoop(timestamp) {
    if (gameOver) {
        draw();
        return;
    }

    const deltaTime = timestamp - lastMoveTime;
    
    if (deltaTime >= MOVE_INTERVAL) {
        update();
        lastMoveTime = timestamp;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

function handleKeydown(e) {
    if (gameOver) return;
    
    const key = e.key;
    let newDir = null;

    if (key === 'ArrowUp' && direction.y === 0) newDir = { x: 0, y: -1 };
    else if (key === 'ArrowDown' && direction.y === 0) newDir = { x: 0, y: 1 };
    else if (key === 'ArrowLeft' && direction.x === 0) newDir = { x: -1, y: 0 };
    else if (key === 'ArrowRight' && direction.x === 0) newDir = { x: 1, y: 0 };

    if (newDir) {
        nextDirection = newDir;
        e.preventDefault();
    }
}

window.addEventListener('keydown', handleKeydown);
restartBtn.addEventListener('click', initGame);

initGame();