const LIKES_KEY = 'task7-likes';

let likes = {};

export function loadLikes() {
    try {
        const saved = localStorage.getItem(LIKES_KEY);
        likes = saved ? JSON.parse(saved) : {};
    } catch (e) {
        likes = {};
    }
    return likes;
}

export function saveLikes() {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
}

export function isLiked(postId) {
    return !!likes[String(postId)];
}

export function toggleLike(postId) {
    const id = String(postId);
    if (likes[id]) {
        delete likes[id];
        return false;
    }
    likes[id] = true;
    return true;
}

export function getLikes() {
    return likes;
}