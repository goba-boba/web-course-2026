const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export async function fetchPosts() {
    const url = `${API_URL}?_limit=100`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    return data.filter(p => p.userId <= 5);
}