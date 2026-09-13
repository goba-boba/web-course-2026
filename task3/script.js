let tasks = [];
let currentFilter = 'all';
let nextId = 1;

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');

function addTask() {
    const text = input.value.trim();

    if (!text) {
        alert('Введите текст задачи!');
        return;
    }

    const newTask = {
        id: nextId,
        text: text,
        completed: false
    };

    nextId++;
    tasks.push(newTask);
    input.value = '';
    render();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}

function setFilter(filter) {
    currentFilter = filter;

    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    render();
}

function render() {
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    taskList.innerHTML = '';

    filteredTasks.map(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Удалить';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    const remaining = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    counter.textContent = `Осталось: ${remaining}, Выполнено: ${completed}`;
}

addBtn.addEventListener('click', addTask);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

render();