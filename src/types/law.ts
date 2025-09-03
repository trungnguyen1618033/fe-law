export interface LawTree {
  law_title: string;
  law_id: string;
  chapters: Chapter[];
}

export interface Chapter {
  chapter_title: string;
  chapter_seq: number;
  branch_path: string;
  articles: Article[];
}

export interface Article {
  article_no: number;
  article_heading: string;
  article_text: string;
  annotations: Annotation[];
}

export interface Annotation {
  type: 'amendment' | 'note' | 'reference';
  text: string;
  date?: string;
  source?: string;
}

export interface SearchIndex {
  title: string;
  body: string;
  annotations_text: string;
  article_no: number;
  chapter_seq: number;
}

export interface Comment {
  id: number;
  type: 'personal' | 'analysis' | 'case' | 'question' | 'important';
  text: string;
  timestamp: string;
  lawId: string;
  articleNo: number;
}

export interface CommentTypeInfo {
  value: string;
  label: string;
  color: string;
}