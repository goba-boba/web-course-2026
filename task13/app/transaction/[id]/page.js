'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTransactionById, getCategories } from '../../../lib/api';

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

export default function TransactionDetailPage() {
    const params = useParams();
    const id = params.id;

    const [transaction, setTransaction] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const [tx, cats] = await Promise.all([
                    getTransactionById(id),
                    getCategories()
                ]);
                setTransaction(tx);
                setCategory(cats.find(c => String(c.id) === String(tx.categoryId)) || null);
            } catch (e) {
                setError('Операция не найдена');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) return <p className="loader">Загрузка...</p>;

    if (error) {
        return (
            <div>
                <p className="error">{error}</p>
                <p className="message"><Link href="/">← Вернуться к списку</Link></p>
            </div>
        );
    }

    const isIncome = transaction.type === 'income';

    return (
        <div>
            <Link href="/" className="back-link">← Назад к списку</Link>
            <h2>Детали операции</h2>
            <div className={`detail-card detail-card--${isIncome ? 'income' : 'expense'}`}>
                <div className="detail-card__icon">
                    {ICONS[transaction.categoryId] || '💸'}
                </div>
                <div className={`detail-card__amount detail-card__amount--${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '−'} {formatCurrency(transaction.amount)}
                </div>
                <div className="detail-card__rows">
                    <div className="detail-row">
                        <span className="detail-row__label">Тип</span>
                        <span className="detail-row__value">{isIncome ? 'Доход' : 'Расход'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-row__label">Категория</span>
                        <span className="detail-row__value">{category ? category.name : 'Без категории'}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-row__label">Дата</span>
                        <span className="detail-row__value">{formatDate(transaction.date)}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-row__label">ID операции</span>
                        <span className="detail-row__value">#{transaction.id}</span>
                    </div>
                    {transaction.comment && (
                        <div className="detail-row">
                            <span className="detail-row__label">Комментарий</span>
                            <span className="detail-row__value detail-row__value--comment">
                                «{transaction.comment}»
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}