export function filterTasks(tasks, filter) {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

export function sortTasks(tasks, sortBy) {
    const copy = [...tasks];
    switch (sortBy) {
        case 'alpha-asc':
            return copy.sort((a, b) => a.text.localeCompare(b.text, 'ru'));
        case 'alpha-desc':
            return copy.sort((a, b) => b.text.localeCompare(a.text, 'ru'));
        case 'date-desc':
            return copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        case 'date-asc':
            return copy.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        default:
            return copy;
    }
}