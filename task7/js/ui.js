import { getAvatarUrl, getBaseLikes } from './utils.js';
import { isLiked } from './storage.js';

let onLikeClick = null;
let onCardClick = null;

const el = {
    postsList: document.getElementById('posts-list'),
    skeletons: document.getElementById('skeletons'),
    errorMessage: document.getElementById('error-message'),
    endMessage: document.getElementById('end-message'),
    modal: document.getElementById('modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    modalAvatar: document.getElementById('modal-avatar'),
    modalAuthor: document.getElementById('modal-author'),
    modalId: document.getElementById('modal-id'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body')
};

export function initUI(handlers) {
    onLikeClick = handlers.onLikeClick;
    onCardClick = handlers.onCardClick;
}

export function showSkeletons() {
    el.skeletons.classList.remove('hidden');
}

export function hideSkeletons() {
    el.skeletons.classList.add('hidden');
}

export function showError(message) {
    el.errorMessage.textContent = message;
    el.errorMessage.classList.remove('hidden');
}

export function hideError() {
    el.errorMessage.classList.add('hidden');
}

export function showEnd() {
    el.endMessage.classList.remove('hidden');
}

export function hideEnd() {
    el.endMessage.classList.add('hidden');
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
    if (isLiked(post.id)) likeBtn.classList.add('liked');

    const heartSpan = document.createElement('span');
    heartSpan.className = 'heart';
    heartSpan.textContent = '💗';

    const countSpan = document.createElement('span');
    countSpan.textContent = getBaseLikes(post.id) + (isLiked(post.id) ? 1 : 0);

    likeBtn.appendChild(heartSpan);
    likeBtn.appendChild(countSpan);

    likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const liked = onLikeClick(post.id);
        likeBtn.classList.toggle('liked', liked);
        countSpan.textContent = getBaseLikes(post.id) + (liked ? 1 : 0);

        heartSpan.style.animation = 'none';
        void heartSpan.offsetWidth;
        heartSpan.style.animation = '';
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

    card.addEventListener('click', () => onCardClick(post));

    return card;
}

export function renderPosts(posts) {
    el.postsList.innerHTML = '';

    if (posts.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'end-message';
        emptyMsg.textContent = 'Ничего не найдено';
        el.postsList.appendChild(emptyMsg);
        return;
    }

    const fragment = document.createDocumentFragment();
    posts.forEach(post => {
        fragment.appendChild(createPostCard(post));
    });
    el.postsList.appendChild(fragment);
}

export function openModal(post) {
    el.modalAvatar.src = getAvatarUrl(post.userId);
    el.modalAuthor.textContent = `Автор #${post.userId}`;
    el.modalId.textContent = `Post ID: ${post.id}`;
    el.modalTitle.textContent = post.title;
    el.modalBody.textContent = post.body;
    el.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    el.modal.classList.add('hidden');
    document.body.style.overflow = '';
}

el.modalOverlay.addEventListener('click', closeModal);
el.modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});