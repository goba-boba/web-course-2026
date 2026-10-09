'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTransactions, getCategories, deleteTransaction } from '../lib/api';

const ICONS = {
    '1': '🍔', '2': '💰', '3': '🚌', '4': '🎬', '5': '💻'
};

function formatCurrency(value) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency', currency: 'RUB', maximumFractionDigits: 2
    }).format(value);
}

function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
}

export default function HomePage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [txs, cats] = await Promise.all([
                    getTransactions(),
                    getCategories()
                ]);
                setTransactions(txs);
                setCategories(cats);
            } catch (e) {
                setError('Не удалось загрузить данные. Проверьте, запущен ли json-server.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleDelete(e, id) {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Удалить эту операцию?')) return;
        try {
            await deleteTransaction(id);
            setTransactions(prev => prev.filter(t => String(t.id) !== String(id)));
        } catch (e) {
            alert('Не удалось удалить операцию');
        }
    }

    if (loading) return <p className="loader">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div>
            <h2>История операций</h2>
            {transactions.length === 0 ? (
                <p className="message">
                    Пока нет ни одной операции. <Link href="/add">Добавить первую</Link>
                </p>
            ) : (
                <ul className="transactions">
                    {transactions.map(t => {
                        const category = categories.find(c => String(c.id) === String(t.categoryId));
                        const categoryName = category ? category.name : 'Без категории';
                        const isIncome = t.type === 'income';
                        return (
                            <li key={t.id} className="transaction">
                                <Link href={`/transaction/${t.id}`} className="transaction__main">
                                    <div className="transaction__icon">
                                        {ICONS[t.categoryId] || '💸'}
                                    </div>
                                    <div className="transaction__info">
                                        <span className="transaction__category">{categoryName}</span>
                                        <span className="transaction__meta">{formatDate(t.date)}</span>
                                        {t.comment && (
                                            <span className="transaction__comment">«{t.comment}»</span>
                                        )}
                                    </div>
                                </Link>
                                <div className="transaction__right">
                                    <span className={`transaction__amount transaction__amount--${isIncome ? 'income' : 'expense'}`}>
                                        {isIncome ? '+' : '−'} {formatCurrency(t.amount)}
                                    </span>
                                    <button
                                        className="btn btn--danger btn--small"
                                        onClick={(e) => handleDelete(e, t.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}