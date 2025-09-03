'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

// Interfaces
interface LawData {
  law_title: string | null;
  law_id: string;
  chapters: any[];
}

interface Article {
  article_no: number;
  article_heading: string;
  article_text?: string;
  article_html?: string;
  annotations: any[];
}

// Will be loaded from files
let mockLawTree = {
  law_title: "Luật Đầu tư",
  law_id: "65/2014/QH13",
  chapters: [
    {
      chapter_title: "Không phân chương",
      chapter_seq: 0,
      articles: [
        { article_no: 1, article_heading: "Phạm vi điều chỉnh" },
        { article_no: 2, article_heading: "Đối tượng áp dụng" },
        { article_no: 3, article_heading: "Giải thích từ ngữ" },
        { article_no: 4, article_heading: "Áp dụng Luật Đầu tư và các luật có liên quan" },
        { article_no: 5, article_heading: "Chính sách về đầu tư kinh doanh" },
        { article_no: 6, article_heading: "Ngành, nghề cấm đầu tư kinh doanh" },
        { article_no: 7, article_heading: "Ngành, nghề đầu tư kinh doanh có điều kiện" },
        { article_no: 8, article_heading: "Sửa đổi, bổ sung ngành, nghề cấm đầu tư kinh doanh" },
        { article_no: 9, article_heading: "Ngành, nghề và điều kiện tiếp cận thị trường đối với nhà đầu tư nước ngoài" }
      ]
    },
    {
      chapter_title: "ƯU ĐÃI VÀ HỖ TRỢ ĐẦU TƯ",
      chapter_seq: 3,
      articles: [
        { article_no: 2, article_heading: "Sửa đổi, bổ sung một số điều của Luật Đầu tư" }
      ]
    }
  ]
};

const mockArticles = [
  {
    article_no: 1,
    article_heading: "Phạm vi điều chỉnh",
    article_text: "<p>Luật này quy định về hoạt động đầu tư kinh doanh tại Việt Nam và hoạt động đầu tư kinh doanh từ Việt Nam ra nước ngoài.</p>",
    annotations: [{
      type: "note",
      text: "Đây là điều đầu tiên của Luật Đầu tư 2014, xác định rõ phạm vi điều chỉnh bao gồm cả đầu tư trong nước và ra nước ngoài.",
      date: "2014-11-26",
      source: "Quốc hội khóa XIII"
    }]
  },
  {
    article_no: 2,
    article_heading: "Đối tượng áp dụng", 
    article_text: "<p>Luật này áp dụng đối với nhà đầu tư và cơ quan, tổ chức, cá nhân liên quan đến hoạt động đầu tư kinh doanh.</p>",
    annotations: [{
      type: "reference",
      text: "Liên quan đến các luật về doanh nghiệp, thuế và các quy định pháp luật khác",
      source: "Hệ thống pháp luật Việt Nam"
    }]
  },
  {
    article_no: 3,
    article_heading: "Giải thích từ ngữ",
    article_text: "<p>Trong Luật này, các từ ngữ dưới đây được hiểu như sau:</p><p>1. <strong>Chấp thuận chủ trương đầu tư</strong> là việc cơ quan nhà nước có thẩm quyền chấp thuận về mục tiêu, địa điểm, quy mô, tiến độ...</p><p>2. <strong>Dự án đầu tư</strong> là tập hợp đề xuất bỏ vốn trung hạn hoặc dài hạn để tiến hành các hoạt động đầu tư kinh doanh...</p>",
    annotations: [{
      type: "guidance",
      text: "Điều này định nghĩa 23 thuật ngữ quan trọng trong luật đầu tư, bao gồm các khái niệm cơ bản về dự án, nhà đầu tư, khu kinh tế...",
      date: "2014-11-26",
      source: "Quốc hội khóa XIII"
    }]
  },
  {
    article_no: 5,
    article_heading: "Chính sách về đầu tư kinh doanh",
    article_text: "<p>1. Nhà đầu tư có quyền thực hiện hoạt động đầu tư kinh doanh trong các ngành, nghề mà Luật này không cấm.</p><p>2. Nhà đầu tư được tự quyết định và tự chịu trách nhiệm về hoạt động đầu tư kinh doanh...</p><p>3. Nhà nước đối xử bình đẳng giữa các nhà đầu tư; có chính sách khuyến khích...</p>",
    annotations: [{
      type: "note",
      text: "Điều này thể hiện chính sách mở cửa và khuyến khích đầu tư của Việt Nam, đảm bảo đối xử bình đẳng giữa các nhà đầu tư.",
      date: "2014-11-26",
      source: "Quốc hội khóa XIII"
    }]
  },
  {
    article_no: 6,
    article_heading: "Ngành, nghề cấm đầu tư kinh doanh",
    article_text: "<p>1. Cấm các hoạt động đầu tư kinh doanh sau đây:</p><p>a) Kinh doanh các chất ma túy...</p><p>b) Kinh doanh các loại hóa chất, khoáng vật...</p><p>c) Kinh doanh mẫu vật các loài thực vật, động vật hoang dã...</p>",
    annotations: [{
      type: "reference",
      text: "Chi tiết các chất cấm được quy định tại Phụ lục I, II, III của Luật này",
      source: "Các Phụ lục của Luật Đầu tư"
    }]
  }
];

interface Annotation {
  id: string;
  type: string;
  text: string;
  date?: string;
  source?: string;
  articleNo: number;
  createdAt: string;
  updatedAt?: string;
  isOriginal?: boolean;
}

export default function DemoPage() {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);
  const [lawData, setLawData] = useState<LawData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleChapter = (chapterSeq: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterSeq)) {
        newSet.delete(chapterSeq);
      } else {
        newSet.add(chapterSeq);
      }
      return newSet;
    });
  };

  const toggleArticle = (articleNo: number) => {
    setSelectedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleNo)) {
        newSet.delete(articleNo);
      } else {
        newSet.add(articleNo);
      }
      return newSet;
    });
  };

  // Load data from files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [treeResponse, articlesResponse] = await Promise.all([
          fetch('/65-2014-QH13_law_tree.json'),
          fetch('/65-2014-QH13_law_articles.jsonl')
        ]);

        const treeData = await treeResponse.json();
        setLawData(treeData);

        const articlesText = await articlesResponse.text();
        const articlesArray = articlesText
          .trim()
          .split('\n')
          .map(line => JSON.parse(line));
        setArticles(articlesArray);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load annotations from localStorage
  useEffect(() => {
    const savedAnnotations = localStorage.getItem('demo_annotations');
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations));
    } else {
      // Initialize with original annotations from mock data
      const originalAnnotations: Annotation[] = [];
      mockArticles.forEach(article => {
        article.annotations.forEach((ann, idx) => {
          originalAnnotations.push({
            id: `original-${article.article_no}-${idx}`,
            type: ann.type,
            text: ann.text,
            date: (ann as any).date,
            source: ann.source,
            articleNo: article.article_no,
            createdAt: '2020-06-17T00:00:00.000Z',
            isOriginal: true
          });
        });
      });
      setAnnotations(originalAnnotations);
    }
  }, []);

  // Save annotations to localStorage
  const saveAnnotations = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    localStorage.setItem('demo_annotations', JSON.stringify(newAnnotations));
  };

  // Add new note inline
  const addNote = (articleNo: number) => {
    const now = new Date().toISOString();
    const annotation: Annotation = {
      id: Date.now().toString(),
      type: 'note',
      text: '',
      articleNo,
      createdAt: now,
      date: now.split('T')[0]
    };

    saveAnnotations([...annotations, annotation]);
    setEditingAnnotation(annotation.id); // Start editing immediately
  };

  // Add new reference inline
  const addReference = (articleNo: number) => {
    const now = new Date().toISOString();
    const annotation: Annotation = {
      id: Date.now().toString(),
      type: 'reference',
      text: '',
      source: '',
      articleNo,
      createdAt: now,
      date: now.split('T')[0]
    };

    saveAnnotations([...annotations, annotation]);
    setEditingAnnotation(annotation.id); // Start editing immediately
  };

  // Delete annotation
  const deleteAnnotation = (annotationId: string) => {
    saveAnnotations(annotations.filter(ann => ann.id !== annotationId));
  };

  // Update annotation with timestamp
  const updateAnnotation = (annotationId: string, updates: Partial<Annotation>) => {
    const now = new Date().toISOString();
    saveAnnotations(annotations.map(ann => 
      ann.id === annotationId 
        ? { ...ann, ...updates, updatedAt: now }
        : ann
    ));
    setEditingAnnotation(null);
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get annotations for article
  const getArticleAnnotations = (articleNo: number) => {
    return annotations.filter(ann => ann.articleNo === articleNo);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải 368 điều luật...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-8">
          <div className="px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              🏛️ PH Lex Note - Demo Thực Tế
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {lawData?.law_title || 'Luật Đầu tư'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              ID: {lawData?.law_id}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {lawData?.chapters.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Chương</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {articles.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Điều</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              368
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng điều (thực tế)</div>
          </div>
        </div>

        {/* Integrated TOC with Article Details */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              📋 Mục Lục & Chi Tiết Điều
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cấu trúc hierarchical với chapters, articles và nội dung chi tiết tích hợp
            </p>
          </div>
          <div className="p-6">
            {lawData?.chapters.map((chapter, index) => (
              <div key={`chapter-${chapter.chapter_seq}-${index}`} className="mb-4 last:mb-0">
                <button
                  onClick={() => toggleChapter(chapter.chapter_seq)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <span className={`mr-2 text-gray-500 dark:text-gray-400 transition-transform ${
                      expandedChapters.has(chapter.chapter_seq) ? 'rotate-90' : ''
                    }`}>
                      ▶
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-left">
                      Chương {chapter.chapter_seq}: {chapter.chapter_title}
                    </h3>
                  </div>
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                    {chapter.articles.length} điều
                  </span>
                </button>
                
                {expandedChapters.has(chapter.chapter_seq) && (
                  <div className="mt-2 pl-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {chapter.articles.map((article: any, articleIndex: number) => (
                      <div key={`article-${chapter.chapter_seq}-${article.article_no}-${articleIndex}`} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleArticle(article.article_no)}
                          className={`w-full flex items-center justify-between p-3 text-sm text-left transition-colors ${
                            selectedArticles.has(article.article_no)
                              ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <span className={`font-medium mr-3 ${
                              selectedArticles.has(article.article_no) 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              Điều {article.article_no}
                            </span>
                            <span className={`truncate ${
                              selectedArticles.has(article.article_no) 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {article.article_heading}
                            </span>
                          </div>
                          <span className={`ml-2 transition-transform ${
                            selectedArticles.has(article.article_no) ? 'rotate-90' : ''
                          }`}>
                            ▶
                          </span>
                        </button>
                        
                        {selectedArticles.has(article.article_no) && (
                          <div className="border-t border-gray-200 dark:border-gray-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 animate-in slide-in-from-top-2 duration-200">
                            {(() => {
                              const fullArticle = articles.find(a => a.article_no === article.article_no);
                              if (!fullArticle) return (
                                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                  <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                                  <p className="text-sm">Không tìm thấy nội dung cho Điều {article.article_no}</p>
                                </div>
                              );
                              
                              return (
                                <div className="p-4">
                                  <div className="mb-4">
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                                      Điều {fullArticle.article_no}: {fullArticle.article_heading}
                                    </h4>
                                    <div 
                                      className="prose dark:prose-invert text-sm mb-4 leading-relaxed"
                                      dangerouslySetInnerHTML={{ __html: fullArticle.article_html || fullArticle.article_text || '' }}
                                    />
                                    
                                    {/* Annotations & References */}
                                    {(() => {
                                      const articleAnnotations = getArticleAnnotations(fullArticle.article_no);
                                      const notes = articleAnnotations.filter(ann => ann.type === 'note');
                                      const references = articleAnnotations.filter(ann => ann.type === 'reference');
                                      const amendments = articleAnnotations.filter(ann => ann.type === 'amendment');
                                      
                                      return (
                                        <div className="space-y-4">
                                          {/* Notes Section */}
                                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                              <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                <i className="fas fa-sticky-note text-yellow-600 dark:text-yellow-400 mr-2"></i>
                                                Ghi chú ({notes.length})
                                              </h5>
                                              <button
                                                onClick={() => addNote(fullArticle.article_no)}
                                                className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                                              >
                                                <i className="fas fa-plus mr-1"></i>
                                                Thêm ghi chú
                                              </button>
                                            </div>
                                            
                                            {notes.length > 0 ? (
                                              <div className="space-y-2">
                                                {notes.map((ann) => (
                                                  <div key={ann.id} className="p-2 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded">
                                                    {editingAnnotation === ann.id ? (
                                                      <div className="space-y-2">
                                                        <textarea
                                                          defaultValue={ann.text}
                                                          placeholder={ann.type === 'note' ? 'Nhập ghi chú...' : 'Nhập nội dung tham chiếu...'}
                                                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                          rows={2}
                                                          id={`edit-text-${ann.id}`}
                                                          autoFocus
                                                        />
                                                        {ann.type === 'reference' && (
                                                          <input
                                                            defaultValue={ann.source || ''}
                                                            placeholder="Nhập nguồn tham chiếu..."
                                                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                            id={`edit-source-${ann.id}`}
                                                          />
                                                        )}
                                                        <div className="flex justify-end space-x-1">
                                                          <button
                                                            onClick={() => setEditingAnnotation(null)}
                                                            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                          >
                                                            Hủy
                                                          </button>
                                                          <button
                                                            onClick={() => {
                                                              const textElement = document.getElementById(`edit-text-${ann.id}`) as HTMLTextAreaElement;
                                                              const sourceElement = document.getElementById(`edit-source-${ann.id}`) as HTMLInputElement;
                                                              
                                                              if (textElement && textElement.value.trim()) {
                                                                const updates: Partial<Annotation> = {
                                                                  text: textElement.value.trim()
                                                                };
                                                                
                                                                if (ann.type === 'reference' && sourceElement) {
                                                                  updates.source = sourceElement.value.trim() || undefined;
                                                                }
                                                                
                                                                updateAnnotation(ann.id, updates);
                                                              }
                                                            }}
                                                            className={`px-2 py-1 text-xs text-white rounded ${
                                                              ann.type === 'note' 
                                                                ? 'bg-yellow-600 hover:bg-yellow-700' 
                                                                : 'bg-blue-600 hover:bg-blue-700'
                                                            }`}
                                                          >
                                                            Lưu
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="flex items-start">
                                                        <span className="px-2 py-1 rounded text-xs mr-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                                                          📝
                                                        </span>
                                                        <div className="flex-1">
                                                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">
                                                            {ann.text}
                                                          </p>
                                                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                            {ann.isOriginal ? (
                                                              <>
                                                                {ann.date && <div>📅 Ngày: {ann.date}</div>}
                                                                {ann.source && <div>📄 Nguồn: {ann.source}</div>}
                                                                <div className="bg-gray-200 dark:bg-gray-600 px-1 rounded inline-block">Gốc</div>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <div>🆕 Tạo: {formatTimestamp(ann.createdAt)}</div>
                                                                {ann.updatedAt && ann.updatedAt !== ann.createdAt && (
                                                                  <div>✏️ Sửa: {formatTimestamp(ann.updatedAt)}</div>
                                                                )}
                                                                <div className="bg-green-200 dark:bg-green-600 px-1 rounded inline-block">Người dùng</div>
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                        {!ann.isOriginal && (
                                                          <div className="flex items-center space-x-1 ml-2">
                                                            <button
                                                              onClick={() => setEditingAnnotation(ann.id)}
                                                              className="p-1 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded"
                                                              title="Chỉnh sửa"
                                                            >
                                                              <i className="fas fa-edit text-xs"></i>
                                                            </button>
                                                            <button
                                                              onClick={() => deleteAnnotation(ann.id)}
                                                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                              title="Xóa"
                                                            >
                                                              <i className="fas fa-trash text-xs"></i>
                                                            </button>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-2">
                                                Chưa có ghi chú nào
                                              </p>
                                            )}
                                          </div>
                                          
                                          {/* References Section */}
                                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 p-3 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                              <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                <i className="fas fa-link text-blue-600 dark:text-blue-400 mr-2"></i>
                                                Tham chiếu ({references.length})
                                              </h5>
                                              <button
                                                onClick={() => addReference(fullArticle.article_no)}
                                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                              >
                                                <i className="fas fa-plus mr-1"></i>
                                                Thêm tham chiếu
                                              </button>
                                            </div>
                                            
                                            {references.length > 0 ? (
                                              <div className="space-y-2">
                                                {references.map((ann) => (
                                                  <div key={ann.id} className="p-2 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded">
                                                    {editingAnnotation === ann.id ? (
                                                      <div className="space-y-2">
                                                        <textarea
                                                          defaultValue={ann.text}
                                                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                          rows={2}
                                                          id={`edit-${ann.id}`}
                                                        />
                                                        <div className="flex justify-end space-x-1">
                                                          <button
                                                            onClick={() => setEditingAnnotation(null)}
                                                            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                          >
                                                            Hủy
                                                          </button>
                                                          <button
                                                            onClick={() => {
                                                              const textarea = document.getElementById(`edit-${ann.id}`) as HTMLTextAreaElement;
                                                              if (textarea) {
                                                                updateAnnotation(ann.id, { text: textarea.value });
                                                              }
                                                            }}
                                                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                                          >
                                                            Lưu
                                                          </button>
                                                        </div>
                                                      </div>
                                                    ) : (
                                                      <div className="flex items-start">
                                                        <span className="px-2 py-1 rounded text-xs mr-2 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                                                          🔗
                                                        </span>
                                                        <div className="flex-1">
                                                          <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">
                                                            {ann.text}
                                                          </p>
                                                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                                            {ann.isOriginal ? (
                                                              <>
                                                                {ann.date && <div>📅 Ngày: {ann.date}</div>}
                                                                {ann.source && <div>📄 Nguồn: {ann.source}</div>}
                                                                <div className="bg-gray-200 dark:bg-gray-600 px-1 rounded inline-block">Gốc</div>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <div>🆕 Tạo: {formatTimestamp(ann.createdAt)}</div>
                                                                {ann.updatedAt && ann.updatedAt !== ann.createdAt && (
                                                                  <div>✏️ Sửa: {formatTimestamp(ann.updatedAt)}</div>
                                                                )}
                                                                <div className="bg-green-200 dark:bg-green-600 px-1 rounded inline-block">Người dùng</div>
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                        {!ann.isOriginal && (
                                                          <div className="flex items-center space-x-1 ml-2">
                                                            <button
                                                              onClick={() => setEditingAnnotation(ann.id)}
                                                              className="p-1 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded"
                                                              title="Chỉnh sửa"
                                                            >
                                                              <i className="fas fa-edit text-xs"></i>
                                                            </button>
                                                            <button
                                                              onClick={() => deleteAnnotation(ann.id)}
                                                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                                              title="Xóa"
                                                            >
                                                              <i className="fas fa-trash text-xs"></i>
                                                            </button>
                                                          </div>
                                                        )}
                                                      </div>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            ) : (
                                              <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-2">
                                                Chưa có tham chiếu nào
                                              </p>
                                            )}
                                          </div>
                                          
                                          {/* Amendments Section */}
                                          {amendments.length > 0 && (
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 p-3 rounded-lg">
                                              <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                  <i className="fas fa-edit text-green-600 dark:text-green-400 mr-2"></i>
                                                  Sửa đổi & Bổ sung ({amendments.length})
                                                </h5>
                                              </div>
                                              
                                              <div className="space-y-2">
                                                {amendments.map((ann) => (
                                                  <div key={ann.id} className="p-2 bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 rounded">
                                                    <div className="flex items-start">
                                                      <span className="px-2 py-1 rounded text-xs mr-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                                                        ✏️
                                                      </span>
                                                      <div className="flex-1">
                                                        <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">
                                                          {ann.text}
                                                        </p>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400">
                                                          {ann.date && <span>📅 {ann.date}</span>}
                                                          {ann.source && <span className="ml-2">📄 {ann.source}</span>}
                                                          <span className="ml-2 bg-gray-200 dark:bg-gray-600 px-1 rounded">Gốc</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })()}
                                    
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features Demo */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              ⚡ Tính Năng Đã Implement
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">TOC Page</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Hierarchical navigation</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Article Detail</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">With annotations</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Comment System</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">localStorage persist</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Search</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Full-text with highlighting</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Chapter Nav</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Progress tracking</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Dark Mode</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Complete theming</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
              🎯 Explore More Demos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/demo-modern"
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Modern Demo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Giao diện hiện đại với đầy đủ chức năng và thiết kế mới
                </p>
              </Link>
              
              <Link 
                href="/interactive"
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Interactive Demo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Demo tương tác với comment system và editing features
                </p>
              </Link>
              
              <Link 
                href="/debug"
                className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl mb-2">🔧</div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Debug & Test</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Development tools và testing utilities
                </p>
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                🏠 Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}