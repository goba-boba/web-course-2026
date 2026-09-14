import { useState } from 'react';

/**
 * @param {{ onAdd: (text: string) => void }} props
 */
function TodoForm({ onAdd }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onAdd(value);
        setValue('');
    };

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Что нужно сделать?"
            />
            <button type="submit">Добавить</button>
        </form>
    );
}

export default TodoForm;