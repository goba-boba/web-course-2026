'use client';

import { useState, useEffect } from 'react';
import { getTransactions } from '../../lib/api';

function formatCurrency(value) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency', currency: 'RUB', maximumFractionDigits: 2
    }).format(value);
}

export default function StatsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await getTransactions();
                setTransactions(data);
            } catch (e) {
                setError('Не удалось загрузить данные. Проверьте, запущен ли json-server.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <p className="loader">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;

    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') income += amount;
        else expense += amount;
    });
    const balance = income - expense;

    return (
        <div>
            <h2>Сводка</h2>
            <div className="summary">
                <div className="summary__item summary__item--income">
                    <span className="summary__label">Доходы</span>
                    <span className="summary__value">{formatCurrency(income)}</span>
                </div>
                <div className="summary__item summary__item--expense">
                    <span className="summary__label">Расходы</span>
                    <span className="summary__value">{formatCurrency(expense)}</span>
                </div>
                <div className="summary__item summary__item--balance">
                    <span className="summary__label">Баланс</span>
                    <span className="summary__value">{formatCurrency(balance)}</span>
                </div>
            </div>
            <p className="message">Всего операций: {transactions.length}</p>
        </div>
    );
}