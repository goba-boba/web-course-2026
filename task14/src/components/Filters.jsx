const FILTERS = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'completed', label: 'Завершённые' }
];

/**
 * @param {{ current: string, onChange: (filter: string) => void }} props
 */
function Filters({ current, onChange }) {
    return (
        <div className="filters">
            {FILTERS.map(f => (
                <button
                    key={f.value}
                    className={current === f.value ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => onChange(f.value)}
                >
                    {f.label}
                </button>
            ))}
        </div>
    );
}

export default Filters;