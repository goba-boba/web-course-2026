import { fetchPosts } from './api.js';
import { loadLikes, toggleLike } from './storage.js';
import { getAvatarUrl } from './utils.js';
import * as ui from './ui.js';

const SCROLL_THRESHOLD = 200;
const DEBOUNCE_DELAY = 300;
const POSTS_PER_PAGE = 10; // Подгружаем по 10 штук
const MAX_POSTS = 100;     // Всего в API 100 постов

let allPosts = [];          // Сюда собираем всё, что загрузили
let currentPage = 0;        // Текущая страница (для запроса)
let searchQuery = '';
let currentAuthor = 'all';
let debounceTimer = null;
let isLoading = false;
let isEndReached = false;   // Флаг: данные закончились

const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const scrollTopBtn = document.getElementById('scroll-top');

function getFilteredPosts() {
    // Фильтруем по автору и поиску
    return allPosts.filter(post => {
        const matchesAuthor = currentAuthor === 'all' || String(post.userId) === String(currentAuthor);
        const matchesSearch = searchQuery.trim() === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesAuthor && matchesSearch;
    });
}

function render() {
    // Теперь мы просто показываем ВСЕ загруженные посты, которые подходят под фильтр
    const filtered = getFilteredPosts();
    ui.renderPosts(filtered);

    // Показываем сообщение, если всё загружено (100 постов) и фильтр "Все"
    if (isEndReached && currentAuthor === 'all' && searchQuery.trim() === '') {
        ui.showEnd();
    } else {
        ui.hideEnd();
    }
}

// Загрузка порции постов
async function loadNextPortion() {
    if (isLoading || isEndReached) return;
    isLoading = true;
    
    // Показываем скелетоны ТОЛЬКО если это первая загрузка, 
    // чтобы не было мерцания экрана при скролле
    if (currentPage === 0) ui.showSkeletons();
    ui.hideError();

    try {
        const start = currentPage * POSTS_PER_PAGE;
        const posts = await fetchPosts(start, POSTS_PER_PAGE);
        
        if (posts.length === 0 || allPosts.length + posts.length >= MAX_POSTS) {
            isEndReached = true;
        }

        allPosts = [...allPosts, ...posts];
        currentPage++;
        
    } catch (error) {
        ui.showError(`Не удалось загрузить посты: ${error.message}`);
    } finally {
        isLoading = false;
        ui.hideSkeletons();
        render();
    }
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }

    // Если до низа осталось 200px — грузим следующую порцию
    if (documentHeight - scrollPosition < SCROLL_THRESHOLD) {
        // Загружаем только если фильтр "Все" и нет поиска, иначе грузить бессмысленно
        if (currentAuthor === 'all' && searchQuery === '') {
            loadNextPortion();
        }
    }
}

function handleSearchInput(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = event.target.value;
        render();
    }, DEBOUNCE_DELAY);
}

function handleTabClick(event) {
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    currentAuthor = event.target.dataset.author;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', handleScroll);
searchInput.addEventListener('input', handleSearchInput);
tabs.forEach(tab => tab.addEventListener('click', handleTabClick));
scrollTopBtn.addEventListener('click', scrollToTop);

ui.initUI({
    onLikeClick: (postId) => toggleLike(postId),
    onCardClick: (post) => ui.openModal(post)
});

async function init() {
    loadLikes();
    await loadNextPortion(); // Загружаем первую порцию при старте
}

init();