import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
    it('рендерит поле ввода и кнопку «Добавить»', () => {
        render(<TodoForm onAdd={() => {}} />);
        expect(screen.getByPlaceholderText('Что нужно сделать?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
    });

    it('при вводе текста и клике вызывает onAdd с правильным аргументом', () => {
        const handleAdd = vi.fn();
        render(<TodoForm onAdd={handleAdd} />);

        const input = screen.getByPlaceholderText('Что нужно сделать?');
        fireEvent.change(input, { target: { value: 'Купить хлеб' } });
        fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

        expect(handleAdd).toHaveBeenCalledWith('Купить хлеб');
    });

    it('не вызывает onAdd при пустом поле', () => {
        const handleAdd = vi.fn();
        render(<TodoForm onAdd={handleAdd} />);
        fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));
        expect(handleAdd).not.toHaveBeenCalled();
    });
});