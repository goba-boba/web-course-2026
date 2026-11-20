import { fetchPosts } from './api.js';
import { loadLikes, toggleLike } from './storage.js';
import { shuffle } from './utils.js'; // <-- ДОБАВИЛИ ИМПОРТ SHUFFLE
import * as ui from './ui.js';

const DEBOUNCE_DELAY = 300;
const POSTS_PER_PAGE = 30; // <-- УВЕЛИЧИЛИ до 30, чтобы захватить 3 авторов
const MAX_POSTS = 100;     

let allPosts = [];          
let currentPage = 0;        
let searchQuery = '';
let currentAuthor = 'all';
let debounceTimer = null;
let isLoading = false;
let isEndReached = false;   

const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const scrollTopBtn = document.getElementById('scroll-top');
const sentinel = document.getElementById('sentinel');

function getFilteredPosts() {
    return allPosts.filter(post => {
        const matchesAuthor = currentAuthor === 'all' || String(post.userId) === String(currentAuthor);
        const matchesSearch = searchQuery.trim() === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesAuthor && matchesSearch;
    });
}

function render() {
    const filtered = getFilteredPosts();
    ui.renderPosts(filtered);

    if (isEndReached && currentAuthor === 'all' && searchQuery.trim() === '') {
        ui.showEnd();
    } else {
        ui.hideEnd();
    }
}

async function loadNextPortion() {
    if (isLoading || isEndReached) return;
    isLoading = true;
    
    if (currentPage === 0) ui.showSkeletons();
    ui.hideError();

    try {
        const start = currentPage * POSTS_PER_PAGE;
        const posts = await fetchPosts(start, POSTS_PER_PAGE);
        
        // --- ГЛАВНОЕ ИЗМЕНЕНИЕ: Перемешиваем новую порцию ---
        const shuffledPosts = shuffle(posts);
        
        if (shuffledPosts.length === 0 || allPosts.length + shuffledPosts.length >= MAX_POSTS) {
            isEndReached = true;
        }

        // Добавляем перемешанные посты к общему списку
        allPosts = [...allPosts, ...shuffledPosts];
        currentPage++;
        
    } catch (error) {
        ui.showError(`Не удалось загрузить посты: ${error.message}`);
    } finally {
        isLoading = false;
        ui.hideSkeletons();
        render();
    }
}

// Настройка слежки за низом страницы
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        if (currentAuthor === 'all' && searchQuery === '') {
            loadNextPortion();
        }
    }
}, { rootMargin: '200px' });

observer.observe(sentinel);

function handleSearchInput(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = event.target.value;
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

searchInput.addEventListener('input', handleSearchInput);
tabs.forEach(tab => tab.addEventListener('click', handleTabClick));
scrollTopBtn.addEventListener('click', scrollToTop);

ui.initUI({
    onLikeClick: (postId) => toggleLike(postId),
    onCardClick: (post) => ui.openModal(post)
});

async function init() {
    loadLikes();
    await loadNextPortion();
}

init();