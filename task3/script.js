// состояние приложения - три переменные описывают всё
let tasks = [];              // массив задач, объекты вида id text completed
let currentFilter = 'all';   // какой фильтр включён - all active или completed
let nextId = 1;              // счётчик id, растёт всегда чтобы не было коллизий после удаления

// кэшируем элементы - нашли один раз, дальше используем переменные
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');  // все три кнопки фильтров
const dateDisplay = document.getElementById('date-display');

// пишет сегодняшнюю дату в шапку
function setTodayDate() {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const today = new Date();
    // getmonth с нуля - январь это 0, поэтому months[9] это октябрь
    dateDisplay.textContent = `${today.getDate()} ${months[today.getMonth()]}`;
}

// добавляет задачу из поля в массив
function addTask() {
    const text = input.value.trim();   // берём текст и убираем пробелы по краям
    if (!text) {                        // пусто или только пробелы - ругаемся и выходим
        alert('Введите текст задачи!');
        return;
    }

    const newTask = {
        id: nextId,
        text: text,
        completed: false                // новая задача всегда невыполненная
    };

    nextId++;                           // увеличиваем счётчик после создания объекта
    tasks.push(newTask);                // кладём задачу в конец массива
    input.value = '';                   // очищаем поле
    render();                           // перерисовываем - без этого на экране ничего не изменится
}

// переключает галочку задачи
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);  // find возвращает ссылку на объект в массиве
    if (task) {
        task.completed = !task.completed;       // инвертируем флаг - false станет true и наоборот
        render();
    }
}

// удаляет задачу
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);     // filter создаёт новый массив без удаляемой задачи
    render();                                    // поэтому tasks через let а не const
}

// переключает фильтр
function setFilter(filter) {
    currentFilter = filter;                      // запоминаем выбор

    filterBtns.forEach(btn => {
        // toggle с условием - если совпало добавляет active если нет убирает
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    render();
}

// главная функция - рисует весь html по текущему состоянию
function render() {
    // выбираем какие задачи показывать
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);   // только невыполненные
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);    // только выполненные
    }

    taskList.innerHTML = '';                        // стираем старые li - иначе будут дубликаты

    filteredTasks.map(task => {
        const li = document.createElement('li');
        // тернарник - если выполнена добавляем класс completed иначе пусто
        li.className = `task-item ${task.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;          // обязательно - иначе галочки слетят при перерисовке
        // замыкание - каждая галочка помнит свою задачу через task.id
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;               // textcontent а не innerhtml - безопаснее

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // собираем li из трёх детей в памяти
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);                   // и только потом вставляем в ul
    });

    // счётчик считаем по всем tasks а не по filteredTasks - иначе при фильтре будет криво
    const remaining = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    counter.textContent = `Осталось: ${remaining} · Выполнено: ${completed}`;
}

// обработчик клика по кнопке добавить
addBtn.addEventListener('click', addTask);

// enter в поле ввода тоже добавляет задачу
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// каждой кнопке фильтра свой обработчик - btn.dataset.filter это её data-filter из html
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// запуск при загрузке - вписать дату и нарисовать пустой список
setTodayDate();
render();
