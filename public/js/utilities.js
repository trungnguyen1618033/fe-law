// PH Lex Note Frontend - Comment System and Utilities

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
}

// Font Size Management  
function initFontSize() {
    const fontSize = localStorage.getItem('fontSize') || 'medium';
    applyFontSize(fontSize);
}

function applyFontSize(size) {
    const body = document.body;
    body.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch(size) {
        case 'small':
            body.classList.add('text-sm');
            break;
        case 'large':
            body.classList.add('text-lg');
            break;
        default:
            body.classList.add('text-base');
    }
    
    localStorage.setItem('fontSize', size);
}

// Comment System
const COMMENT_TYPES = {
    personal: { label: 'Ghi chú cá nhân', color: 'blue' },
    analysis: { label: 'Phân tích pháp lý', color: 'purple' },
    case: { label: 'Án lệ liên quan', color: 'green' },
    question: { label: 'Thắc mắc', color: 'yellow' },
    important: { label: 'Quan trọng', color: 'red' }
};

function getStorageKey(lawId, articleNo) {
    return `comments_${lawId}_${articleNo}`;
}

function loadComments(lawId, articleNo) {
    const key = getStorageKey(lawId, articleNo);
    const comments = localStorage.getItem(key);
    return comments ? JSON.parse(comments) : [];
}

function saveComments(lawId, articleNo, comments) {
    const key = getStorageKey(lawId, articleNo);
    localStorage.setItem(key, JSON.stringify(comments));
    updateCommentStats();
}

function addComment(lawId, articleNo) {
    const commentText = document.getElementById('comment-text').value.trim();
    const commentType = document.getElementById('comment-type').value;
    
    if (!commentText) {
        alert('Vui lòng nhập nội dung ghi chú');
        return;
    }
    
    const comments = loadComments(lawId, articleNo);
    const newComment = {
        id: Date.now(),
        type: commentType,
        text: commentText,
        timestamp: new Date().toISOString(),
        lawId: lawId,
        articleNo: parseInt(articleNo)
    };
    
    comments.push(newComment);
    saveComments(lawId, articleNo, comments);
    
    // Clear form
    document.getElementById('comment-text').value = '';
    
    // Re-render comments
    renderComments(lawId, articleNo);
    
    // Show success message
    showNotification('Đã thêm ghi chú thành công', 'success');
}

function deleteComment(lawId, articleNo, commentId) {
    if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) {
        return;
    }
    
    const comments = loadComments(lawId, articleNo);
    const filteredComments = comments.filter(c => c.id !== commentId);
    saveComments(lawId, articleNo, filteredComments);
    
    renderComments(lawId, articleNo);
    showNotification('Đã xóa ghi chú', 'info');
}

function renderComments(lawId, articleNo) {
    const comments = loadComments(lawId, articleNo);
    const container = document.getElementById('comments-list');
    
    if (!container) return;
    
    if (comments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-sm italic">Chưa có ghi chú nào</p>';
        return;
    }
    
    container.innerHTML = comments
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(comment => renderSingleComment(comment, lawId, articleNo))
        .join('');
}

function renderSingleComment(comment, lawId, articleNo) {
    const typeInfo = COMMENT_TYPES[comment.type];
    const formattedDate = formatVietnameseDate(comment.timestamp);
    const escapedText = escapeHtml(comment.text);
    
    return `
        <div class="comment-item bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
            <div class="comment-header flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                    <span class="comment-type-badge type-${comment.type} px-2 py-1 rounded-full text-xs font-medium">
                        ${typeInfo.label}
                    </span>
                    <span class="timestamp text-xs text-gray-500 dark:text-gray-400">
                        ${formattedDate}
                    </span>
                </div>
                <button 
                    onclick="deleteComment('${lawId}', ${articleNo}, ${comment.id})"
                    class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    title="Xóa ghi chú"
                >
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
            <p class="comment-text text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${escapedText}</p>
        </div>
    `;
}

function updateCommentStats() {
    const totalCommentsElement = document.getElementById('total-comments');
    const articlesWithCommentsElement = document.getElementById('articles-with-comments');
    
    if (!totalCommentsElement) return;
    
    let totalComments = 0;
    let articlesWithComments = 0;
    
    // Count all comments in localStorage
    for (let key in localStorage) {
        if (key.startsWith('comments_')) {
            const comments = JSON.parse(localStorage.getItem(key) || '[]');
            totalComments += comments.length;
            if (comments.length > 0) {
                articlesWithComments++;
            }
        }
    }
    
    totalCommentsElement.textContent = totalComments;
    if (articlesWithCommentsElement) {
        articlesWithCommentsElement.textContent = articlesWithComments;
    }
}

function getCommentCount(lawId, articleNo) {
    const comments = loadComments(lawId, articleNo);
    return comments.length;
}

// Utility Functions
function formatVietnameseDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightSearchTerm(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
        'bg-blue-100 text-blue-800 border border-blue-200'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// Search highlighting
function highlightSearchResults(query) {
    if (!query) return;
    
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
            const wrapper = document.createElement('span');
            wrapper.innerHTML = highlightedText;
            textNode.parentNode.replaceChild(wrapper, textNode);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme (handled by React ThemeProvider now)
    // initTheme();
    
    // Initialize font size - use setTimeout to avoid hydration mismatch
    setTimeout(() => {
        initFontSize();
    }, 100);
    
    // Setup event listeners
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Font size controls
    const decreaseFont = document.getElementById('decrease-font');
    const resetFont = document.getElementById('reset-font');
    const increaseFont = document.getElementById('increase-font');
    
    if (decreaseFont) decreaseFont.addEventListener('click', () => applyFontSize('small'));
    if (resetFont) resetFont.addEventListener('click', () => applyFontSize('medium'));
    if (increaseFont) increaseFont.addEventListener('click', () => applyFontSize('large'));
    
    // Comment form submission
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const lawId = this.dataset.lawId;
            const articleNo = this.dataset.articleNo;
            if (lawId && articleNo) {
                addComment(lawId, articleNo);
            }
        });
    }
    
    // Load existing comments
    const currentLawId = document.body.dataset.lawId;
    const currentArticleNo = document.body.dataset.articleNo;
    
    if (currentLawId && currentArticleNo) {
        renderComments(currentLawId, currentArticleNo);
    }
    
    // Update comment statistics
    updateCommentStats();
    
    // Highlight search terms if present
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
        setTimeout(() => highlightSearchResults(query), 100);
    }
});