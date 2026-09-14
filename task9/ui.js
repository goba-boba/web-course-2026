const ICONS = {
    '1': '🍔',
    '2': '💰',
    '3': '🚌',
    '4': '🎬',
    '5': '💻'
};

function getIcon(categoryId) {
    return ICONS[categoryId] || '💸';
}

function formatCurrency(value) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2
    }).format(value);
}

function formatDate(isoDate) {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}.${month}.${year}`;
}

export function renderSummary(transactions, elements) {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        const amount = Number(t.amount) || 0;
        if (t.type === 'income') income += amount;
        else expense += amount;
    });

    const balance = income - expense;
    elements.income.textContent = formatCurrency(income);
    elements.expense.textContent = formatCurrency(expense);
    elements.balance.textContent = formatCurrency(balance);
    elements.balance.style.color = balance >= 0 ? '#6a4c93' : '#e63946';
}

export function renderCategoryOptions(select, categories, includeEmptyOption = false) {
    select.innerHTML = '';
    if (includeEmptyOption) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Все категории';
        select.appendChild(opt);
    }
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        option.dataset.type = cat.type;
        select.appendChild(option);
    });
}

export function applyFilters(transactions, filters) {
    return transactions.filter(t => {
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.categoryId && String(t.categoryId) !== String(filters.categoryId)) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
    });
}

export function renderTransactions(transactions, categories, handlers, container, emptyMsg) {
    container.innerHTML = '';

    if (transactions.length === 0) {
        emptyMsg.classList.remove('hidden');
        return;
    }
    emptyMsg.classList.add('hidden');

    const fragment = document.createDocumentFragment();

    transactions.forEach(t => {
        const category = categories.find(c => String(c.id) === String(t.categoryId));
        const categoryName = category ? category.name : 'Без категории';
        const isIncome = t.type === 'income';

        const li = document.createElement('li');
        li.className = 'transaction';

        const iconEl = document.createElement('div');
        iconEl.className = 'transaction__icon';
        iconEl.textContent = getIcon(t.categoryId);

        const info = document.createElement('div');
        info.className = 'transaction__info';

        const catEl = document.createElement('span');
        catEl.className = 'transaction__category';
        catEl.textContent = categoryName;

        const meta = document.createElement('span');
        meta.className = 'transaction__meta';
        meta.textContent = formatDate(t.date);

        info.appendChild(catEl);
        info.appendChild(meta);

        if (t.comment && t.comment.trim() !== '') {
            const comment = document.createElement('span');
            comment.className = 'transaction__comment';
            comment.textContent = `«${t.comment}»`;
            info.appendChild(comment);
        }

        const right = document.createElement('div');
        right.className = 'transaction__right';

        const amount = document.createElement('span');
        amount.className = `transaction__amount transaction__amount--${isIncome ? 'income' : 'expense'}`;
        amount.textContent = `${isIncome ? '+' : '−'} ${formatCurrency(t.amount)}`;

        const actions = document.createElement('div');
        actions.className = 'transaction__actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.title = 'Редактировать';
        editBtn.textContent = '✏️';
        editBtn.addEventListener('click', () => handlers.onEdit(t.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn';
        deleteBtn.title = 'Удалить';
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', () => handlers.onDelete(t.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        right.appendChild(amount);
        right.appendChild(actions);

        li.appendChild(iconEl);
        li.appendChild(info);
        li.appendChild(right);

        fragment.appendChild(li);
    });

    container.appendChild(fragment);
}