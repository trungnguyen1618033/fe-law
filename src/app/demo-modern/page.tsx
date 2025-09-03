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

// Mock data
const mockLawData = {
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

export default function DemoModernPage() {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([0]));
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());
  const [lawData, setLawData] = useState<LawData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(null);
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
        // Fallback to mock data
        setLawData(mockLawData);
        setArticles(mockArticles);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load annotations from localStorage
  useEffect(() => {
    const savedAnnotations = localStorage.getItem('demo_modern_annotations');
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations));
    } else {
      // Initialize with original annotations from loaded articles
      const originalAnnotations: Annotation[] = [];
      articles.forEach((article: Article) => {
        if (article.annotations) {
          article.annotations.forEach((ann: any, idx: number) => {
            originalAnnotations.push({
              id: `original-${article.article_no}-${idx}`,
              type: ann.type,
              text: ann.text,
              date: ann.date || '',
              source: ann.source,
              articleNo: article.article_no,
              createdAt: '2020-06-17T00:00:00.000Z',
              isOriginal: true
            });
          });
        }
      });
      setAnnotations(originalAnnotations);
    }
  }, [articles]);

  // Save annotations to localStorage
  const saveAnnotations = (newAnnotations: Annotation[]) => {
    setAnnotations(newAnnotations);
    localStorage.setItem('demo_modern_annotations', JSON.stringify(newAnnotations));
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu luật...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Header with Action Buttons */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="px-6 py-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {lawData?.law_title || 'Luật Đầu tư'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                ID: {lawData?.law_id} • Demo Hiện Đại PH Lex Note
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                <i className="fas fa-bookmark mr-2"></i>
                Lưu bookmark
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                <i className="fas fa-share mr-2"></i>
                Chia sẻ
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
                <i className="fas fa-search mr-2"></i>
                Tìm kiếm
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm">
                <i className="fas fa-download mr-2"></i>
                Xuất PDF
              </button>
            </div>
          </div>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 text-white rounded-lg mr-3">
                <i className="fas fa-layer-group"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {lawData?.chapters.length || 0}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Chương</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 text-white rounded-lg mr-3">
                <i className="fas fa-file-alt"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {lawData?.chapters.reduce((total, chapter) => total + chapter.articles.length, 0) || 0}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">Điều hiện có</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 text-white rounded-lg mr-3">
                <i className="fas fa-database"></i>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  368
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">Tổng điều</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Table of Contents */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <i className="fas fa-list mr-2 text-blue-600"></i>
                  Mục Lục & Chi Tiết Điều
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Giao diện hiện đại với thiết kế tối ưu cho trải nghiệm người dùng
                </p>
              </div>
              
              <div className="p-6">
                {lawData?.chapters.map((chapter, index) => (
                  <div key={`chapter-${chapter.chapter_seq}-${index}`} className="mb-4 last:mb-0">
                    <button
                      onClick={() => toggleChapter(chapter.chapter_seq)}
                      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 p-1 rounded transition-transform duration-200 ${
                          expandedChapters.has(chapter.chapter_seq) 
                            ? 'rotate-90 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          <i className="fas fa-chevron-right text-sm"></i>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-left">
                          Chương {chapter.chapter_seq}: {chapter.chapter_title}
                        </h3>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                        {chapter.articles.length} điều
                      </span>
                    </button>
                    
                    {expandedChapters.has(chapter.chapter_seq) && (
                      <div className="mt-3 pl-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
                        {chapter.articles.map((article, articleIndex: number) => (
                          <div key={`article-${chapter.chapter_seq}-${article.article_no}-${articleIndex}`} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
                            <button
                              onClick={() => toggleArticle(article.article_no)}
                              className={`w-full flex items-center justify-between p-4 text-sm text-left transition-all duration-200 ${
                                selectedArticles.has(article.article_no)
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-l-4 border-l-blue-500'
                                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-700 dark:hover:to-gray-600'
                              }`}
                            >
                              <div className="flex items-center flex-1">
                                <span className={`font-normal mr-4 px-2 py-1 rounded text-xs ${
                                  selectedArticles.has(article.article_no) 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}>
                                  Điều {article.article_no}
                                </span>
                                <span className={`truncate ${
                                  selectedArticles.has(article.article_no) 
                                    ? 'text-blue-700 dark:text-blue-300 font-medium' 
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                  {article.article_heading}
                                </span>
                              </div>
                              <div className={`ml-2 p-1 rounded transition-transform duration-200 ${
                                selectedArticles.has(article.article_no) 
                                  ? 'rotate-90 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-400'
                              }`}>
                                <i className="fas fa-chevron-right text-xs"></i>
                              </div>
                            </button>
                            
                            {selectedArticles.has(article.article_no) && (
                              <div className="border-t border-gray-200 dark:border-gray-600 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 animate-in slide-in-from-top-2 duration-200">
                                {(() => {
                                  const fullArticle = articles.find(a => a.article_no === article.article_no);
                                  if (!fullArticle) return (
                                    <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                      <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <i className="fas fa-exclamation-circle text-xl"></i>
                                      </div>
                                      <p className="text-sm">Không tìm thấy nội dung cho Điều {article.article_no}</p>
                                    </div>
                                  );
                                  
                                  return (
                                    <div className="p-6">
                                      <div className="mb-6">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
                                          <h4 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                                            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm mr-3">Điều {fullArticle.article_no}</span>
                                            <span className="flex-1">{fullArticle.article_heading}</span>
                                          </h4>
                                          <div className="max-h-96 overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                                            <div 
                                              className="prose dark:prose-invert text-sm leading-relaxed max-w-none"
                                              dangerouslySetInnerHTML={{ __html: fullArticle.article_html || fullArticle.article_text || '' }}
                                            />
                                          </div>
                                        </div>
                                        
                                        {/* Interactive Annotations & References */}
                                        {(() => {
                                          const articleAnnotations = getArticleAnnotations(fullArticle.article_no);
                                          const notes = articleAnnotations.filter(ann => ann.type === 'note');
                                          const references = articleAnnotations.filter(ann => ann.type === 'reference');
                                          // const amendments = articleAnnotations.filter(ann => ann.type === 'amendment'); // Unused variable
                                          
                                          return (
                                            <div className="space-y-4">
                                              {/* Notes Section */}
                                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                  <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                    <i className="fas fa-sticky-note text-blue-600 dark:text-blue-400 mr-2"></i>
                                                    Ghi chú ({notes.length})
                                                  </h5>
                                                  <button
                                                    onClick={() => addNote(fullArticle.article_no)}
                                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                                  >
                                                    <i className="fas fa-plus mr-1"></i>
                                                    Thêm
                                                  </button>
                                                </div>
                                                
                                                {notes.length > 0 ? (
                                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {notes.map((ann) => (
                                                      <div key={ann.id} className="p-3 bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-lg shadow-sm">
                                                        {editingAnnotation === ann.id ? (
                                                          <div className="space-y-2">
                                                            <textarea
                                                              defaultValue={ann.text}
                                                              placeholder="Nhập ghi chú..."
                                                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                              rows={2}
                                                              id={`edit-text-${ann.id}`}
                                                              autoFocus
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
                                                                  const textElement = document.getElementById(`edit-text-${ann.id}`) as HTMLTextAreaElement;
                                                                  
                                                                  if (textElement && textElement.value.trim()) {
                                                                    updateAnnotation(ann.id, {
                                                                      text: textElement.value.trim()
                                                                    });
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
                                                              📝
                                                            </span>
                                                            <div className="flex-1">
                                                              <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">
                                                                {ann.text || <span className="italic text-gray-500">Chưa có nội dung...</span>}
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
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-3">
                                                    Chưa có ghi chú
                                                  </p>
                                                )}
                                              </div>
                                              
                                              {/* References Section */}
                                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                  <h5 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center">
                                                    <i className="fas fa-link text-yellow-600 dark:text-yellow-400 mr-2"></i>
                                                    Tham chiếu ({references.length})
                                                  </h5>
                                                  <button
                                                    onClick={() => addReference(fullArticle.article_no)}
                                                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                                                  >
                                                    <i className="fas fa-plus mr-1"></i>
                                                    Thêm
                                                  </button>
                                                </div>
                                                
                                                {references.length > 0 ? (
                                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {references.map((ann) => (
                                                      <div key={ann.id} className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg shadow-sm">
                                                        {editingAnnotation === ann.id ? (
                                                          <div className="space-y-2">
                                                            <textarea
                                                              defaultValue={ann.text}
                                                              placeholder="Nhập nội dung tham chiếu..."
                                                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                              rows={2}
                                                              id={`edit-text-${ann.id}`}
                                                              autoFocus
                                                            />
                                                            <input
                                                              defaultValue={ann.source || ''}
                                                              placeholder="Nhập nguồn tham chiếu..."
                                                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-gray-100"
                                                              id={`edit-source-${ann.id}`}
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
                                                                  const textElement = document.getElementById(`edit-text-${ann.id}`) as HTMLTextAreaElement;
                                                                  const sourceElement = document.getElementById(`edit-source-${ann.id}`) as HTMLInputElement;
                                                                  
                                                                  if (textElement && textElement.value.trim()) {
                                                                    const updates: Partial<Annotation> = {
                                                                      text: textElement.value.trim()
                                                                    };
                                                                    
                                                                    if (sourceElement) {
                                                                      updates.source = sourceElement.value.trim() || undefined;
                                                                    }
                                                                    
                                                                    updateAnnotation(ann.id, updates);
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
                                                            <span className="px-2 py-1 rounded text-xs mr-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200">
                                                              🔗
                                                            </span>
                                                            <div className="flex-1">
                                                              <p className="text-xs text-gray-800 dark:text-gray-200 mb-1">
                                                                {ann.text || <span className="italic text-gray-500">Chưa có nội dung...</span>}
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
                                                                    {ann.source && <div>📄 Nguồn: {ann.source}</div>}
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
                                                  <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center py-3">
                                                    Chưa có tham chiếu
                                                  </p>
                                                )}
                                              </div>
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
          </div>
          
          {/* Right Sidebar - Features & Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Modern References Section */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <i className="fas fa-link mr-2 text-blue-600"></i>
                    Tham chiếu & liên kết
                    <button className="ml-auto text-green-600 hover:text-green-700 text-sm">
                      <i className="fas fa-edit mr-1"></i>
                      Chỉnh sửa
                    </button>
                  </h3>
                </div>
                <div className="p-4">
                  {/* Internal References */}
                  <div className="mb-4">
                    <h4 className="flex items-center text-blue-600 font-medium mb-3 text-sm">
                      <i className="fas fa-arrow-right mr-2"></i>
                      Liên kết trong luật
                    </h4>
                    <div className="space-y-2">
                      <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                        → Điều 2: Đối tượng áp dụng
                      </a>
                      <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                        → Chương 2: Chuẩn bị đầu tư dự án PPP
                      </a>
                    </div>
                  </div>
                  
                  {/* Related Documents */}
                  <div>
                    <h4 className="flex items-center text-green-600 font-medium mb-3 text-sm">
                      <i className="fas fa-balance-scale mr-2"></i>
                      Văn bản liên quan
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <i className="fas fa-file-alt text-gray-400 mt-1 text-xs"></i>
                        <a href="#" className="text-green-600 hover:text-green-800 text-xs">
                          Luật Đầu tư số 61/2020/QH14
                        </a>
                      </div>
                      <div className="flex items-start space-x-2">
                        <i className="fas fa-file-alt text-gray-400 mt-1 text-xs"></i>
                        <a href="#" className="text-green-600 hover:text-green-800 text-xs">
                          Nghị định 35/2021/NĐ-CP
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* History Section */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <i className="fas fa-history mr-2 text-orange-600"></i>
                    Lịch sử sửa đổi
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-orange-600">17/06/2020</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Ban hành Luật số 61/2020/QH14</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-orange-600">29/03/2021</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Sửa đổi bởi Nghị định 35/2021/NĐ-CP</div>
                  </div>
                </div>
              </div>
              
              {/* Features Demo */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <i className="fas fa-rocket mr-2 text-blue-600"></i>
                    Tính Năng
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Modern UI</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Giao diện hiện đại</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Action Buttons</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Các nút tác vụ trực quan</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-green-100 dark:bg-green-900/30 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 dark:text-green-400 text-sm">✅</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Sidebar Layout</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Bố cục tối ưu</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Demo Navigation */}
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                    <i className="fas fa-compass mr-2 text-green-600"></i>
                    Explore Demos
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <Link 
                    href="/demo"
                    className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 transition-all border border-blue-200 dark:border-blue-700"
                  >
                    <div className="text-lg mr-3">🏛️</div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300">Original Demo</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Demo gốc đầy đủ</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/interactive"
                    className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30 transition-all border border-purple-200 dark:border-purple-700"
                  >
                    <div className="text-lg mr-3">⚡</div>
                    <div>
                      <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Interactive Demo</h4>
                      <p className="text-xs text-purple-600 dark:text-purple-400">Tương tác & editing</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/"
                    className="flex items-center justify-center p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-900/30 dark:hover:to-green-800/30 transition-all border border-green-200 dark:border-green-700"
                  >
                    <i className="fas fa-home mr-2 text-green-600"></i>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Về trang chủ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}