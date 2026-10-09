const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const SCROLL_THRESHOLD = 200;
const DEBOUNCE_DELAY = 300;
const LIKES_KEY = 'task7-likes';
const INITIAL_VISIBLE = 20;
const PORTION_SIZE = 10;
const COPIES_PER_POST = 3;

let allPosts = [];
let visibleCount = INITIAL_VISIBLE;
let searchQuery = '';
let currentAuthor = 'all';
let debounceTimer = null;
let likes = {};
let isLoading = false;

const postsList = document.getElementById('posts-list');
const skeletons = document.getElementById('skeletons');
const errorMessage = document.getElementById('error-message');
const endMessage = document.getElementById('end-message');
const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const scrollTopBtn = document.getElementById('scroll-top');
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalAvatar = document.getElementById('modal-avatar');
const modalAuthor = document.getElementById('modal-author');
const modalId = document.getElementById('modal-id');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function loadLikes() {
    try {
        const saved = localStorage.getItem(LIKES_KEY);
        likes = saved ? JSON.parse(saved) : {};
    } catch (e) {
        likes = {};
    }
}

function saveLikes() {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

function getAvatarUrl(userId) {
    return `https://i.pravatar.cc/80?u=${userId}`;
}

function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function expandPosts(posts) {
    const expanded = [];
    let newId = 1;

    posts.forEach(post => {
        for (let copy = 1; copy <= COPIES_PER_POST; copy++) {
            expanded.push({
                ...post,
                id: newId++,
                originalId: post.id,
                title: copy === 1
                    ? post.title
                    : `${post.title} · часть ${copy}`,
                body: copy === 1
                    ? post.body
                    : `${post.body}\n\n(продолжение истории, часть ${copy})`
            });
        }
    });

    return expanded;
}

async function loadAllPosts() {
    if (isLoading) return;
    isLoading = true;
    skeletons.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    try {
        const url = `${API_URL}?_limit=100`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        const onlyFiveAuthors = data.filter(p => p.userId <= 5);
        const expanded = expandPosts(onlyFiveAuthors);
        allPosts = shuffle(expanded);
    } catch (error) {
        errorMessage.textContent = `Не удалось загрузить посты: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        isLoading = false;
        skeletons.classList.add('hidden');
    }
}

function getFilteredPosts() {
    return allPosts.filter(post => {
        const matchesAuthor = currentAuthor === 'all' || String(post.userId) === String(currentAuthor);
        const matchesSearch = searchQuery.trim() === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesAuthor && matchesSearch;
    });
}

function toggleLike(postId, btn, countSpan) {
    const id = String(postId);
    if (likes[id]) {
        delete likes[id];
        btn.classList.remove('liked');
    } else {
        likes[id] = true;
        btn.classList.add('liked');
    }
    saveLikes();

    const base = 5 + (postId * 3) % 50;
    countSpan.textContent = base + (likes[id] ? 1 : 0);

    const heartEl = btn.querySelector('.heart');
    if (heartEl) {
        heartEl.style.animation = 'none';
        void heartEl.offsetWidth;
        heartEl.style.animation = '';
    }
}

function openModal(post) {
    modalAvatar.src = getAvatarUrl(post.userId);
    modalAuthor.textContent = `Автор #${post.userId}`;
    modalId.textContent = `Post ID: ${post.id}`;
    modalTitle.textContent = post.title;
    modalBody.textContent = post.body;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function createPostCard(post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.dataset.author = post.userId;

    const head = document.createElement('div');
    head.className = 'post-card__head';

    const avatar = document.createElement('img');
    avatar.className = 'post-card__avatar';
    avatar.src = getAvatarUrl(post.userId);
    avatar.alt = `Аватар автора ${post.userId}`;
    avatar.loading = 'lazy';

    const authorInfo = document.createElement('div');
    authorInfo.className = 'post-card__author-info';

    const author = document.createElement('span');
    author.className = 'post-card__author';
    author.textContent = `Автор #${post.userId}`;

    const idEl = document.createElement('span');
    idEl.className = 'post-card__id';
    idEl.textContent = `Post #${post.id}`;

    authorInfo.appendChild(author);
    authorInfo.appendChild(idEl);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'post-card__like';
    likeBtn.type = 'button';
    if (likes[String(post.id)]) likeBtn.classList.add('liked');

    const heartSpan = document.createElement('span');
    heartSpan.className = 'heart';
    heartSpan.textContent = '💗';

    const countSpan = document.createElement('span');
    const baseLikes = 5 + (post.id * 3) % 50;
    countSpan.textContent = baseLikes + (likes[String(post.id)] ? 1 : 0);

    likeBtn.appendChild(heartSpan);
    likeBtn.appendChild(countSpan);

    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(post.id, likeBtn, countSpan);
    });

    head.appendChild(avatar);
    head.appendChild(authorInfo);
    head.appendChild(likeBtn);

    const titleEl = document.createElement('h2');
    titleEl.className = 'post-card__title';
    titleEl.textContent = post.title;

    const bodyEl = document.createElement('p');
    bodyEl.className = 'post-card__body';
    bodyEl.textContent = post.body;

    card.appendChild(head);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);

    card.addEventListener('click', () => openModal(post));

    return card;
}

function renderPosts() {
    postsList.innerHTML = '';
    const filtered = getFilteredPosts();
    const visible = filtered.slice(0, visibleCount);

    if (visible.length === 0) {
        endMessage.classList.add('hidden');
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'end-message';
        emptyMsg.textContent = 'Ничего не найдено';
        postsList.appendChild(emptyMsg);
        return;
    }

    const fragment = document.createDocumentFragment();
    visible.forEach(post => {
        fragment.appendChild(createPostCard(post));
    });
    postsList.appendChild(fragment);

    if (visibleCount >= filtered.length && currentAuthor === 'all' && searchQuery.trim() === '') {
        endMessage.classList.remove('hidden');
    } else {
        endMessage.classList.add('hidden');
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
            renderPosts();
        }
    }
}

function handleSearchInput(event) {
    const value = event.target.value;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchQuery = value;
        visibleCount = INITIAL_VISIBLE;
        renderPosts();
    }, DEBOUNCE_DELAY);
}

function handleTabClick(event) {
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    currentAuthor = event.target.dataset.author;
    visibleCount = INITIAL_VISIBLE;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderPosts();
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', handleScroll);
searchInput.addEventListener('input', handleSearchInput);
tabs.forEach(tab => tab.addEventListener('click', handleTabClick));
scrollTopBtn.addEventListener('click', scrollToTop);
modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

async function init() {
    loadLikes();
    await loadAllPosts();
    renderPosts();
}

init();