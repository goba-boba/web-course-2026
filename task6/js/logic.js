export function createInitialState() {
    return {
        snake: [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ],
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
        apple: { x: 0, y: 0 },
        score: 0,
        gameOver: false,
        heartbeat: 0
    };
}

export function spawnApple(state, tileCount) {
    let newApple;
    let isOccupied = true;
    
    while (isOccupied) {
        newApple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        isOccupied = state.snake.some(segment => segment.x === newApple.x && segment.y === newApple.y);
    }
    state.apple = newApple;
}

function checkCollision(state, x, y, tileCount) {
    if (x < 0 || x >= tileCount || y < 0 || y >= tileCount) return true;
    return state.snake.some(segment => segment.x === x && segment.y === y);
}

export function moveSnake(state, tileCount) {
    state.direction = { ...state.nextDirection };
    
    const newHead = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y
    };

    if (checkCollision(state, newHead.x, newHead.y, tileCount)) {
        state.gameOver = true;
        return;
    }

    state.snake.unshift(newHead);

    if (newHead.x === state.apple.x && newHead.y === state.apple.y) {
        state.score += 10;
        spawnApple(state, tileCount);
    } else {
        state.snake.pop();
    }
}

export function update(state, tileCount) {
    if (state.gameOver) return;
    moveSnake(state, tileCount);
}