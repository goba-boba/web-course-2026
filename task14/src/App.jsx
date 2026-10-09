import { useState, useEffect, useRef } from 'react';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import Filters from './components/Filters.jsx';
import SortSelect from './components/SortSelect.jsx';
import Stats from './components/Stats.jsx';
import { filterTasks, sortTasks } from './utils/todos.js';

const STORAGE_KEY = 'react-todo-tasks';

const FLOATING_EMOJIS = ['⚡', '🌩️', '💥', '✨', '🔥', '⛈️', '💫', '🌟', '⚡', '🌪️', '☄️', '🌈', '⚡', '💥', '✨'];

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const loadedRef = useRef(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setTasks(parsed);
            } catch (e) {
                console.warn('Не удалось загрузить задачи');
            }
        }
        loadedRef.current = true;
    }, []);

    useEffect(() => {
        if (loadedRef.current) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks]);

    const addTask = (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setTasks(prev => {
            const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
            return [...prev, {
                id: nextId,
                text: trimmed,
                completed: false,
                createdAt: Date.now()
            }];
        });
    };

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const filtered = filterTasks(tasks, filter);
    const sorted = sortTasks(filtered, sortBy);

    return (
        <>
            {FLOATING_EMOJIS.map((emoji, i) => (
                <span key={i} className="floating-emoji">{emoji}</span>
            ))}
            <div className="app">
                <h1>Мои задачи ⚡</h1>
                <TodoForm onAdd={addTask} />
                <div className="controls">
                    <Filters current={filter} onChange={setFilter} />
                    <SortSelect current={sortBy} onChange={setSortBy} />
                </div>
                <Stats tasks={tasks} />
                <TodoList
                    tasks={sorted}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                />
            </div>
        </>
    );
}

export default App;