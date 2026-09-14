import { useState } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import Filters from './components/Filters.jsx';
import Stats from './components/Stats.jsx';

let nextId = 4;

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Сделать лабу по React', completed: false },
        { id: 2, text: 'Прочитать документацию', completed: true },
        { id: 3, text: 'Выпить кофе', completed: false }
    ]);

    const [filter, setFilter] = useState('all');

    const addTask = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setTasks(prev => [
            ...prev,
            { id: nextId++, text: trimmed, completed: false }
        ]);
    };

    const toggleTask = (id) => {
        setTasks(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
    });

    return (
        <div className="app">
            <h1>Мои задачи 💗</h1>
            <TodoForm onAdd={addTask} />
            <Filters current={filter} onChange={setFilter} />
            <Stats tasks={tasks} />
            <TodoList
                tasks={filteredTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
            />
        </div>
    );
}

export default App;