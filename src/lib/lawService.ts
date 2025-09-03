import { LawTree, Article, SearchIndex, Comment } from '@/types/law';
import * as fs from 'fs';
import * as path from 'path';

export class LawService {
  private readonly dataPath: string;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data');
  }

  async getLawTree(lawId: string): Promise<LawTree | null> {
    try {
      const filePath = path.join(this.dataPath, `${lawId}_law_tree.json`);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error loading law tree for ${lawId}:`, error);
      return null;
    }
  }

  async getArticle(lawId: string, articleNo: number): Promise<Article | null> {
    try {
      const filePath = path.join(this.dataPath, `${lawId}_law_articles.jsonl`);
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.trim().split('\n');
      
      for (const line of lines) {
        const article = JSON.parse(line) as Article;
        if (article.article_no === articleNo) {
          return article;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error loading article ${articleNo} for ${lawId}:`, error);
      return null;
    }
  }

  async getAllArticles(lawId: string): Promise<Article[]> {
    try {
      const filePath = path.join(this.dataPath, `${lawId}_law_articles.jsonl`);
      const data = fs.readFileSync(filePath, 'utf8');
      const lines = data.trim().split('\n');
      
      return lines.map(line => JSON.parse(line) as Article);
    } catch (error) {
      console.error(`Error loading articles for ${lawId}:`, error);
      return [];
    }
  }

  async searchArticles(lawId: string, query: string): Promise<SearchIndex[]> {
    try {
      const filePath = path.join(this.dataPath, `${lawId}_search_index.json`);
      const data = fs.readFileSync(filePath, 'utf8');
      const searchIndex = JSON.parse(data) as SearchIndex[];
      
      if (!query || query.trim() === '') {
        return searchIndex;
      }

      const normalizedQuery = query.toLowerCase().trim();
      return searchIndex.filter(item => 
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.body.toLowerCase().includes(normalizedQuery) ||
        item.annotations_text.toLowerCase().includes(normalizedQuery)
      );
    } catch (error) {
      console.error(`Error searching articles for ${lawId}:`, error);
      return [];
    }
  }

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
}