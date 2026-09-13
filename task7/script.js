const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const POSTS_PER_PAGE = 10;
const TOTAL_POSTS = 100;
const SCROLL_THRESHOLD = 200;
const DEBOUNCE_DELAY = 300;

let allPosts = [];
let filteredPosts = [];
let currentPage = 0;
let isLoading = false;
let isEndReached = false;
let searchQuery = '';
let debounceTimer = null;

const postsList = document.getElementById('posts-list');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const endMessage = document.getElementById('end-message');
const searchInput = document.getElementById('search-input');

async function fetchPosts() {
    if (isLoading || isEndReached) return;

    isLoading = true;
    loader.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    try {
        const start = currentPage * POSTS_PER_PAGE;
        const url = `${API_URL}?_start=${start}&_limit=${POSTS_PER_PAGE}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            isEndReached = true;
            endMessage.classList.remove('hidden');
        } else {
            allPosts = [...allPosts, ...data];
            currentPage++;
            applyFilter();
        }
    } catch (error) {
        errorMessage.textContent = `Не удалось загрузить посты: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        isLoading = false;
        loader.classList.add('hidden');
    }
}

function applyFilter() {
    if (searchQuery.trim() === '') {
        filteredPosts = allPosts;
    } else {
        const query = searchQuery.toLowerCase();
        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(query)
        );
    }
    renderPosts();
}

function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';

    const idEl = document.createElement('span');
    idEl.className = 'post-card__id';
    idEl.textContent = `Автор #${post.userId}`;

    const titleEl = document.createElement('h2');
    titleEl.className = 'post-card__title';
    titleEl.textContent = post.title;

    const bodyEl = document.createElement('p');
    bodyEl.className = 'post-card__body';
    bodyEl.textContent = post.body;

    card.appendChild(idEl);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);

    return card;
}

function renderPosts() {
    postsList.innerHTML = '';

    if (filteredPosts.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'end-message';
        emptyMsg.textContent = 'Ничего не найдено';
        postsList.appendChild(emptyMsg);
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredPosts.forEach(post => {
        fragment.appendChild(createPostCard(post));
    });
    postsList.appendChild(fragment);
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (documentHeight - scrollPosition < SCROLL_THRESHOLD) {
        fetchPosts();
    }
}

function handleSearchInput(event) {
    const value = event.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = value;
        applyFilter();
    }, DEBOUNCE_DELAY);
}

window.addEventListener('scroll', handleScroll);
searchInput.addEventListener('input', handleSearchInput);

fetchPosts();