function drawHeart(ctx, cx, cy, size) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(0.85, 1.2);
    ctx.translate(-cx, -cy);
    
    ctx.beginPath();
    ctx.moveTo(cx, cy + size * 0.4);
    ctx.bezierCurveTo(cx, cy - size * 0.1, cx - size, cy - size * 0.2, cx - size, cy - size * 0.6);
    ctx.bezierCurveTo(cx - size, cy - size * 1.1, cx, cy - size * 1.1, cx, cy - size * 0.5);
    ctx.bezierCurveTo(cx, cy - size * 1.1, cx + size, cy - size * 1.1, cx + size, cy - size * 0.6);
    ctx.bezierCurveTo(cx + size, cy - size * 0.2, cx, cy - size * 0.1, cx, cy + size * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
}

export function draw(ctx, canvas, state, config) {
    const { GRID_SIZE, TILE_COUNT } = config;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Сетка
    for (let i = 0; i < TILE_COUNT; i++) {
        for (let j = 0; j < TILE_COUNT; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? '#1a1033' : '#221441';
            ctx.fillRect(i * GRID_SIZE, j * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }

    // Сердечко (яблоко)
    state.heartbeat += 0.08;
    const pulse = 1 + Math.sin(state.heartbeat) * 0.12;
    const heartCx = state.apple.x * GRID_SIZE + GRID_SIZE / 2;
    const heartCy = state.apple.y * GRID_SIZE + GRID_SIZE / 2;
    const heartSize = (GRID_SIZE / 2) * 0.9 * pulse;

    ctx.shadowColor = '#ff2d55';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff2d55';
    drawHeart(ctx, heartCx, heartCy, heartSize);
    ctx.shadowBlur = 0;

    // Змейка
    state.snake.forEach((segment, index) => {
        const x = segment.x * GRID_SIZE;
        const y = segment.y * GRID_SIZE;
        
        if (index === 0) {
            ctx.fillStyle = '#ff8fff';
            ctx.shadowColor = '#ff8fff';
            ctx.shadowBlur = 20;
        } else {
            const alpha = 1 - (index / state.snake.length) * 0.4;
            ctx.fillStyle = `rgba(224, 102, 255, ${alpha})`;
            ctx.shadowColor = '#e066ff';
            ctx.shadowBlur = 8;
        }
        
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 6);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Глазки
        if (index === 0) {
            const eyeOffsetX = state.direction.x * 3;
            const eyeOffsetY = state.direction.y * 3;
            const perpX = state.direction.y * 4;
            const perpY = -state.direction.x * 4;
            
            ctx.fillStyle = '#1a1033';
            ctx.beginPath();
            ctx.arc(x + GRID_SIZE / 2 + eyeOffsetX + perpX, y + GRID_SIZE / 2 + eyeOffsetY + perpY, 2.5, 0, Math.PI * 2);
            ctx.arc(x + GRID_SIZE / 2 + eyeOffsetX - perpX, y + GRID_SIZE / 2 + eyeOffsetY - perpY, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Экран проигрыша
    if (state.gameOver) {
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
        ctx.fillText(`Ваш счёт: ${state.score}`, canvas.width / 2, canvas.height / 2 + 25);
    }
}