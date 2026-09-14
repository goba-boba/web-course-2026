/**
 * @param {{
 *   task: { id: number, text: string, completed: boolean },
 *   onToggle: (id: number) => void,
 *   onDelete: (id: number) => void
 * }} props
 */
function TodoItem({ task, onToggle, onDelete }) {
    return (
        <li className={task.completed ? 'todo-item completed' : 'todo-item'}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
            />
            <span className="todo-text">{task.text}</span>
            <button
                className="delete-btn"
                onClick={() => onDelete(task.id)}
            >
                Удалить
            </button>
        </li>
    );
}

export default TodoItem;