const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchPosts(start, limit) {
    const url = `${API_URL}?_start=${start}&_limit=${limit}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.json();
}