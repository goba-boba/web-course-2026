/**
 * @param {{ tasks: Array<{ id: number, text: string, completed: boolean }> }} props
 */
function Stats({ tasks }) {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;

    return (
        <div className="stats">
            <span>Всего: {total}</span>
            <span>Осталось: {remaining}</span>
            <span>Выполнено: {completed}</span>
        </div>
    );
}

export default Stats;