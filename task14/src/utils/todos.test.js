import { describe, it, expect } from 'vitest';
import { filterTasks, sortTasks } from './todos';

const sampleTasks = [
    { id: 1, text: 'банан', completed: false, createdAt: 3 },
    { id: 2, text: 'яблоко', completed: true, createdAt: 1 },
    { id: 3, text: 'вишня', completed: false, createdAt: 2 }
];

describe('filterTasks', () => {
    it('обычный случай: all возвращает все задачи', () => {
        expect(filterTasks(sampleTasks, 'all')).toHaveLength(3);
    });

    it('краевой случай: пустой массив', () => {
        expect(filterTasks([], 'active')).toEqual([]);
    });

    it('случай без совпадений: completed при отсутствии выполненных', () => {
        const noCompleted = sampleTasks.filter(t => !t.completed);
        expect(filterTasks(noCompleted, 'completed')).toEqual([]);
    });

    it('некорректный фильтр не ломает функцию и возвращает все задачи', () => {
        expect(filterTasks(sampleTasks, 'invalid')).toHaveLength(3);
    });
});

describe('sortTasks', () => {
    it('обычный случай: сортировка по алфавиту А→Я', () => {
        const result = sortTasks(sampleTasks, 'alpha-asc');
        expect(result[0].text).toBe('банан');
        expect(result[2].text).toBe('яблоко');
    });

    it('сортировка не мутирует исходный массив', () => {
        const original = [...sampleTasks];
        sortTasks(sampleTasks, 'alpha-desc');
        expect(sampleTasks).toEqual(original);
    });
});