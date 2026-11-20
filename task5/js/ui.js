const board = document.getElementById('board');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');

export function initUI(handlers) {
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handlers.onStart();
    });

    board.addEventListener('click', (e) => {
        const sector = e.target.closest('.sector');
        if (!sector) return;
        const id = parseInt(sector.dataset.id);
        handlers.onSectorClick(id);
    });
}

export function updateStatus(text) {
    statusEl.textContent = text;
}

export function setBoardDisabled(isDisabled) {
    if (isDisabled) {
        board.classList.add('disabled');
    } else {
        board.classList.remove('disabled');
    }
}

export function setStartBtnText(text) {
    startBtn.querySelector('span').textContent = text;
}

export function highlightSector(id) {
    const sector = document.querySelector(`.sector[data-id="${id}"]`);
    if (sector) sector.classList.add('active');
}

export function unhighlightSector(id) {
    const sector = document.querySelector(`.sector[data-id="${id}"]`);
    if (sector) sector.classList.remove('active');
}

export function flashUserClick(id) {
    const sector = document.querySelector(`.sector[data-id="${id}"]`);
    if (sector) {
        sector.classList.add('active');
        setTimeout(() => sector.classList.remove('active'), 300);
    }
}