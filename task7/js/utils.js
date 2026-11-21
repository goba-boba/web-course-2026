export function getAvatarUrl(userId) {
    return `https://i.pravatar.cc/80?u=${userId}`;
}

export function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function getBaseLikes(postId) {
    return 5 + (postId * 3) % 50;
}