import TodoItem from './TodoItem.jsx';

/**
 * @param {{
 *   tasks: Array<{ id: number, text: string, completed: boolean }>,
 *   onToggle: (id: number) => void,
 *   onDelete: (id: number) => void
 * }} props
 */
function TodoList({ tasks, onToggle, onDelete }) {
    if (tasks.length === 0) {
        return <p className="empty">Задач нет 💭</p>;
    }

    return (
        <ul className="todo-list">
            {tasks.map(task => (
                <TodoItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default TodoList;