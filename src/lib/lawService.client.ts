import { Comment } from '@/types/law';

export class LawServiceClient {
  // Comment management (client-side methods)
  getCommentTypes() {
    return [
      { value: 'personal', label: 'Ghi chú cá nhân', color: 'blue' },
      { value: 'analysis', label: 'Phân tích pháp lý', color: 'purple' },
      { value: 'case', label: 'Án lệ liên quan', color: 'green' },
      { value: 'question', label: 'Thắc mắc', color: 'yellow' },
      { value: 'important', label: 'Quan trọng', color: 'red' }
    ];
  }

  // Utility methods
  formatVietnameseDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }

  // Local storage methods for comments
  getComments(lawId: string, articleNo: number): Comment[] {
    const saved = localStorage.getItem(`comments_${lawId}_${articleNo}`);
    return saved ? JSON.parse(saved) : [];
  }

  saveComments(lawId: string, articleNo: number, comments: Comment[]): void {
    localStorage.setItem(`comments_${lawId}_${articleNo}`, JSON.stringify(comments));
  }
}