const BASE_URL = 'http://localhost:3001';

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!response.ok) {
        throw new Error(`Ошибка запроса: ${response.status}`);
    }
    return response.json();
}

export async function getTransactions() {
    return await request(`${BASE_URL}/transactions`);
}

export async function addTransaction(data) {
    return await request(`${BASE_URL}/transactions`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function updateTransaction(id, data) {
    return await request(`${BASE_URL}/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

export async function deleteTransaction(id) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
    return true;
}

export async function getCategories() {
    return await request(`${BASE_URL}/categories`);
}

export async function addCategory(data) {
    return await request(`${BASE_URL}/categories`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}