import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from './TodoItem';

const task = { id: 1, text: 'Тестовая задача', completed: false };

describe('TodoItem', () => {
    it('рендерит текст задачи', () => {
        render(<TodoItem task={task} onToggle={() => {}} onDelete={() => {}} />);
        expect(screen.getByText('Тестовая задача')).toBeInTheDocument();
    });

    it('при клике на кнопку «Удалить» вызывает onDelete с правильным id', () => {
        const handleDelete = vi.fn();
        render(<TodoItem task={task} onToggle={() => {}} onDelete={handleDelete} />);

        fireEvent.click(screen.getByRole('button', { name: 'Удалить' }));

        expect(handleDelete).toHaveBeenCalledWith(1);
    });
});