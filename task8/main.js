import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getCategories
} from './api.js';

import {
    renderSummary,
    renderCategories,
    renderTransactions
} from './ui.js';

const elements = {
    form: document.getElementById('transaction-form'),
    formTitle: document.getElementById('form-title'),
    editId: document.getElementById('edit-id'),
    amount: document.getElementById('amount'),
    type: document.getElementById('type'),
    category: document.getElementById('category'),
    date: document.getElementById('date'),
    comment: document.getElementById('comment'),
    formError: document.getElementById('form-error'),
    submitBtn: document.getElementById('submit-btn'),
    cancelBtn: document.getElementById('cancel-btn'),
    list: document.getElementById('transactions-list'),
    emptyMsg: document.getElementById('empty-message'),
    loader: document.getElementById('loader'),
    income: document.getElementById('total-income'),
    expense: document.getElementById('total-expense'),
    balance: document.getElementById('total-balance')
};

let transactions = [];
let categories = [];

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    elements.date.value = today;
}

function resetForm() {
    elements.form.reset();
    elements.editId.value = '';
    elements.formTitle.textContent = 'Новая операция';
    elements.submitBtn.textContent = 'Добавить';
    elements.cancelBtn.classList.add('hidden');
    elements.formError.classList.add('hidden');
    [elements.amount, elements.category, elements.date].forEach(el => el.classList.remove('invalid'));
    setDefaultDate();
}

function showError(message) {
    elements.formError.textContent = message;
    elements.formError.classList.remove('hidden');
}

function clearError() {
    elements.formError.classList.add('hidden');
    elements.formError.textContent = '';
    [elements.amount, elements.category, elements.date].forEach(el => el.classList.remove('invalid'));
}

function validateForm() {
    let isValid = true;
    const amount = Number(elements.amount.value);
    const categoryId = elements.category.value;
    const date = elements.date.value;

    if (!amount || amount <= 0) {
        elements.amount.classList.add('invalid');
        isValid = false;
    }
    if (!categoryId) {
        elements.category.classList.add('invalid');
        isValid = false;
    }
    if (!date) {
        elements.date.classList.add('invalid');
        isValid = false;
    }

    if (!isValid) {
        showError('Заполните обязательные поля корректно');
        return false;
    }
    return true;
}

async function loadData() {
    elements.loader.classList.remove('hidden');
    try {
        const [txs, cats] = await Promise.all([getTransactions(), getCategories()]);
        transactions = txs;
        categories = cats;
        renderCategories(elements.category, categories);
        refreshUI();
    } catch (error) {
        elements.list.innerHTML = '';
        elements.emptyMsg.textContent = 'Не удалось загрузить данные. Проверьте, запущен ли сервер.';
        elements.emptyMsg.classList.remove('hidden');
    } finally {
        elements.loader.classList.add('hidden');
    }
}

function refreshUI() {
    renderSummary(transactions, elements);
    renderTransactions(
        transactions,
        categories,
        {
            onEdit: startEdit,
            onDelete: handleDelete
        },
        elements.list,
        elements.emptyMsg
    );
}

function startEdit(id) {
    const t = transactions.find(item => String(item.id) === String(id));
    if (!t) return;

    elements.editId.value = t.id;
    elements.amount.value = t.amount;
    elements.type.value = t.type;
    elements.category.value = t.categoryId;
    elements.date.value = t.date;
    elements.comment.value = t.comment || '';

    elements.formTitle.textContent = 'Редактирование операции';
    elements.submitBtn.textContent = 'Сохранить';
    elements.cancelBtn.classList.remove('hidden');
    clearError();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleDelete(id) {
    if (!confirm('Удалить эту операцию?')) return;
    try {
        await deleteTransaction(id);
        transactions = transactions.filter(t => String(t.id) !== String(id));
        refreshUI();
    } catch (error) {
        alert('Не удалось удалить операцию. Проверьте сервер.');
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    clearError();

    if (!validateForm()) return;

    const data = {
        amount: Number(elements.amount.value),
        type: elements.type.value,
        categoryId: elements.category.value,
        date: elements.date.value,
        comment: elements.comment.value.trim()
    };

    try {
        const editId = elements.editId.value;
        if (editId) {
            const updated = await updateTransaction(editId, data);
            transactions = transactions.map(t =>
                String(t.id) === String(editId) ? updated : t
            );
        } else {
            const created = await addTransaction(data);
            transactions.push(created);
        }
        resetForm();
        refreshUI();
    } catch (error) {
        showError('Не удалось сохранить операцию. Проверьте сервер.');
    }
}

elements.form.addEventListener('submit', handleSubmit);
elements.cancelBtn.addEventListener('click', () => {
    resetForm();
    clearError();
});

resetForm();
loadData();