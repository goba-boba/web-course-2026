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
    try {
        return await request(`${BASE_URL}/transactions`);
    } catch (error) {
        console.error('getTransactions:', error);
        throw error;
    }
}

export async function addTransaction(data) {
    try {
        return await request(`${BASE_URL}/transactions`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('addTransaction:', error);
        throw error;
    }
}

export async function updateTransaction(id, data) {
    try {
        return await request(`${BASE_URL}/transactions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('updateTransaction:', error);
        throw error;
    }
}

export async function deleteTransaction(id) {
    try {
        const response = await fetch(`${BASE_URL}/transactions/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
        return true;
    } catch (error) {
        console.error('deleteTransaction:', error);
        throw error;
    }
}

export async function getCategories() {
    try {
        return await request(`${BASE_URL}/categories`);
    } catch (error) {
        console.error('getCategories:', error);
        throw error;
    }
}