'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, addTransaction } from '../../lib/api';

export default function AddPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const cats = await getCategories();
                setCategories(cats);
                if (cats.length > 0) setCategoryId(cats[0].id);
            } catch (e) {
                setError('Не удалось загрузить категории');
            }
        }
        load();
        setDate(new Date().toISOString().split('T')[0]);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const numericAmount = Number(amount);
        if (!numericAmount || numericAmount <= 0) {
            setError('Введите положительную сумму');
            return;
        }
        if (!categoryId || !date) {
            setError('Заполните категорию и дату');
            return;
        }

        setSaving(true);
        try {
            await addTransaction({
                amount: numericAmount,
                type,
                categoryId,
                date,
                comment: comment.trim()
            });
            router.push('/');
        } catch (e) {
            setError('Не удалось сохранить операцию. Проверьте сервер.');
            setSaving(false);
        }
    }

    return (
        <div>
            <h2>Новая операция</h2>

            {error && <p className="error">{error}</p>}

            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <label>
                        Сумма
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </label>
                    <label>
                        Тип
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="expense">Расход</option>
                            <option value="income">Доход</option>
                        </select>
                    </label>
                </div>

                <div className="form__row">
                    <label>
                        Категория
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Дата
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <label>
                    Комментарий
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Необязательно"
                    />
                </label>

                <div className="form__actions">
                    <button type="submit" className="btn" disabled={saving}>
                        {saving ? 'Сохранение...' : 'Добавить'}
                    </button>
                </div>
            </form>
        </div>
    );
}