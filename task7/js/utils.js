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

export function expandPosts(posts, copies) {
    const expanded = [];
    let newId = 1;

    posts.forEach(post => {
        for (let copy = 1; copy <= copies; copy++) {
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

export function getBaseLikes(postId) {
    return 5 + (postId * 3) % 50;
}