import { fetchPosts } from './api.js';
import { loadLikes, toggleLike } from './storage.js';
import { shuffle, expandPosts } from './utils.js';
import * as ui from './ui.js';

const SCROLL_THRESHOLD = 200;
const DEBOUNCE_DELAY = 300;
const INITIAL_VISIBLE = 20;
const PORTION_SIZE = 10;
const COPIES_PER_POST = 3;

let allPosts = [];
let visibleCount = INITIAL_VISIBLE;
let searchQuery = '';
let currentAuthor = 'all';
let debounceTimer = null;
let isLoading = false;

const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const scrollTopBtn = document.getElementById('scroll-top');

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
    const visible = filtered.slice(0, visibleCount);
    ui.renderPosts(visible);

    const allShown = visibleCount >= filtered.length;
    if (allShown && currentAuthor === 'all' && searchQuery.trim() === '') {
        ui.showEnd();
    } else {
        ui.hideEnd();
    }
}

async function loadAllPosts() {
    if (isLoading) return;
    isLoading = true;
    ui.showSkeletons();
    ui.hideError();

    try {
        const posts = await fetchPosts();
        const expanded = expandPosts(posts, COPIES_PER_POST);
        allPosts = shuffle(expanded);
    } catch (error) {
        ui.showError(`Не удалось загрузить посты: ${error.message}`);
    } finally {
        isLoading = false;
        ui.hideSkeletons();
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

    if (documentHeight - scrollPosition < SCROLL_THRESHOLD) {
        const filtered = getFilteredPosts();
        if (visibleCount < filtered.length) {
            visibleCount += PORTION_SIZE;
            render();
        }
    }
}

function handleSearchInput(event) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = event.target.value;
        visibleCount = INITIAL_VISIBLE;
        render();
    }, DEBOUNCE_DELAY);
}

function handleTabClick(event) {
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    currentAuthor = event.target.dataset.author;
    visibleCount = INITIAL_VISIBLE;
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
    await loadAllPosts();
    render();
}

init();