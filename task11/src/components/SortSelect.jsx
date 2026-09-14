const OPTIONS = [
    { value: 'default', label: 'Без сортировки' },
    { value: 'alpha-asc', label: 'По алфавиту (А→Я)' },
    { value: 'alpha-desc', label: 'По алфавиту (Я→А)' },
    { value: 'date-desc', label: 'Сначала новые' },
    { value: 'date-asc', label: 'Сначала старые' }
];

/**
 * @param {{ current: string, onChange: (value: string) => void }} props
 */
function SortSelect({ current, onChange }) {
    return (
        <div className="sort-select">
            <label>
                Сортировка:
                <select
                    value={current}
                    onChange={(e) => onChange(e.target.value)}
                >
                    {OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export default SortSelect;