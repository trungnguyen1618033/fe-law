'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data (same structure as demo-modern)
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

interface Comment {
  id: number;
  type: 'personal' | 'work' | 'research' | 'important';
  text: string;
  timestamp: string;
  articleNo: number;
}

interface Annotation {
  id: number;
  type: string;
  text: string;
  date?: string;
  source?: string;
  articleNo: number;
  isOriginal?: boolean;
  updatedAt?: string;
}

interface Article {
  article_no: number;
  article_heading: string;
  article_text?: string;
  article_html?: string;
  annotations?: any[];
}

interface LawData {
  law_title: string | null;
  law_id: string;
  chapters: any[];
}

const commentTypes = [
  { value: 'personal', label: '👤 Cá nhân', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' },
  { value: 'work', label: '💼 Công việc', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' },
  { value: 'research', label: '🔬 Nghiên cứu', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' },
  { value: 'important', label: '⭐ Quan trọng', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' }
];

// Function to process and group articles into chapters properly
const processChapters = (articlesArray: any[]) => {
  // Group articles by chapter
  const chapterMap = new Map();
  
  articlesArray.forEach(article => {
    const chapterKey = `${article.chapter_seq}-${article.chapter_title || 'Không có tên'}`;
    
    if (!chapterMap.has(chapterKey)) {
      chapterMap.set(chapterKey, {
        chapter_seq: article.chapter_seq,
        chapter_title: article.chapter_title || (article.chapter_seq === 0 ? 'Không phân chương' : `Chương ${article.chapter_seq}`),
        articles: []
      });
    }
    
    // Add article to chapter
    chapterMap.get(chapterKey).articles.push({
      article_no: article.article_no,
      article_heading: article.article_heading,
      article_text: article.article_text,
      article_html: article.article_html,
      annotations: article.annotations || []
    });
  });
  
  // Convert to array and sort by chapter_seq
  const chaptersArray = Array.from(chapterMap.values()).sort((a, b) => a.chapter_seq - b.chapter_seq);
  
  // Sort articles within each chapter by article_no
  chaptersArray.forEach(chapter => {
    chapter.articles.sort((a, b) => a.article_no - b.article_no);
  });
  
  console.log('Processed chapters:', chaptersArray.length, 'Total articles:', articlesArray.length);
  
  return chaptersArray;
};

export default function InteractivePage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState<{ type: 'personal' | 'work' | 'research' | 'important'; text: string; }>({ type: 'personal', text: '' });
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editingAnnotationId, setEditingAnnotationId] = useState<number | null>(null);
  const [editingReferences, setEditingReferences] = useState<boolean>(false);
  const [showAnnotationForm, setShowAnnotationForm] = useState<boolean>(false);
  const [newAnnotation, setNewAnnotation] = useState({ type: 'note', text: '', date: '', source: '' });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const [lawData, setLawData] = useState<LawData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<string>>(new Set());

  // Load data from files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [treeResponse, articlesResponse] = await Promise.all([
          fetch('/65-2014-QH13_law_tree.json'),
          fetch('/65-2014-QH13_law_articles.jsonl')
        ]);

        const treeData = await treeResponse.json();
        console.log('Loading treeData:', treeData?.law_title, treeData?.chapters?.length);

        const articlesText = await articlesResponse.text();
        const articlesArray = articlesText
          .trim()
          .split('\n')
          .map(line => JSON.parse(line));
        
        // Process and reorganize chapters to group articles properly
        const processedChapters = processChapters(articlesArray);
        const processedLawData = {
          ...treeData,
          chapters: processedChapters
        };
        
        setLawData(processedLawData);
        setArticles(articlesArray);

        // Set first article as selected
        if (articlesArray.length > 0) {
          setSelectedArticle(articlesArray[0]);
        } else if (treeData?.chapters?.[0]?.articles?.[0]) {
          // Enhance first article with basic structure for interactive features
          const firstArticle = treeData.chapters[0].articles[0];
          const enhancedArticle = {
            ...firstArticle,
            article_text: firstArticle.article_text || "<p>Nội dung bài viết đang được tải...</p>",
            annotations: firstArticle.annotations || []
          };
          setSelectedArticle(enhancedArticle);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data
        setLawData(mockLawData);
        setArticles([]);
        // Set first article from mock data with more complete structure
        const firstArticle = mockLawData.chapters[0]?.articles[0];
        if (firstArticle) {
          // Enhance with text content for interactive features
          const enhancedArticle = {
            ...firstArticle,
            article_text: "<p>Luật này quy định về hoạt động đầu tư kinh doanh tại Việt Nam và hoạt động đầu tư kinh doanh từ Việt Nam ra nước ngoài.</p>",
            annotations: []
          };
          setSelectedArticle(enhancedArticle);
        }
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load comments and annotations from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem('interactive_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }

    const savedAnnotations = localStorage.getItem('interactive_annotations');
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations));
    }
  }, []);

  // Save comment
  const saveComment = () => {
    if (!newComment.text.trim()) return;

    let updatedComments;
    
    if (editingComment) {
      // Edit existing comment
      updatedComments = comments.map(c => 
        c.id === editingComment.id 
          ? { ...c, type: newComment.type, text: newComment.text, timestamp: new Date().toISOString() }
          : c
      );
      setEditingComment(null);
    } else {
      // Add new comment
      const comment: Comment = {
        id: Date.now(),
        type: newComment.type,
        text: newComment.text,
        timestamp: new Date().toISOString(),
        articleNo: selectedArticle?.article_no || 0
      };
      updatedComments = [...comments, comment];
    }

    setComments(updatedComments);
    localStorage.setItem('interactive_comments', JSON.stringify(updatedComments));
    
    setNewComment({ type: 'personal', text: '' });
    setShowCommentForm(false);
  };

  // Edit comment
  const editComment = (comment: Comment) => {
    setEditingComment(comment);
    setNewComment({ type: comment.type, text: comment.text });
    setShowCommentForm(true);
  };

  // Delete comment
  const deleteComment = (commentId: number) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem('interactive_comments', JSON.stringify(updatedComments));
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingComment(null);
    setNewComment({ type: 'personal', text: '' });
    setShowCommentForm(false);
  };

  // Add new annotation
  const addAnnotation = () => {
    if (!newAnnotation.text.trim()) return;

    const annotation = {
      id: Date.now(),
      type: newAnnotation.type,
      text: newAnnotation.text,
      date: new Date().toISOString().split('T')[0], // Auto set current date
      source: undefined, // Remove source for user annotations
      articleNo: selectedArticle?.article_no || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedAnnotations = [...annotations, annotation];
    setAnnotations(updatedAnnotations);
    localStorage.setItem('interactive_annotations', JSON.stringify(updatedAnnotations));

    // Reset form
    setNewAnnotation({ type: 'note', text: '', date: '', source: '' });
    setShowAnnotationForm(false);
  };

  // Delete annotation
  const deleteAnnotation = (annotationId: number) => {
    const updatedAnnotations = annotations.filter(a => a.id !== annotationId);
    setAnnotations(updatedAnnotations);
    localStorage.setItem('interactive_annotations', JSON.stringify(updatedAnnotations));
  };

  // Update annotation
  const updateAnnotation = (annotationId: number, updates: any) => {
    const updatedAnnotations = annotations.map(a => 
      a.id === annotationId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );
    setAnnotations(updatedAnnotations);
    localStorage.setItem('interactive_annotations', JSON.stringify(updatedAnnotations));
    setEditingAnnotationId(null); // Exit edit mode after save
  };

  // Start editing specific annotation
  const startEditingAnnotation = (annotationId: number) => {
    setEditingAnnotationId(annotationId);
  };

  // Cancel editing annotation
  const cancelEditingAnnotation = () => {
    setEditingAnnotationId(null);
  };

  // Get annotations for current article
  const currentAnnotations = selectedArticle ? [
    ...(selectedArticle.annotations || []).map(ann => ({ ...ann, isOriginal: true })),
    ...annotations.filter(a => a.articleNo === selectedArticle.article_no)
  ] : [];

  // Function to select article with full content
  const selectArticle = (basicArticle: any) => {
    // Try to find full article content from loaded articles array
    const fullArticle = articles.find(a => a.article_no === basicArticle.article_no);
    
    if (fullArticle) {
      setSelectedArticle(fullArticle);
    } else {
      // Fallback: enhance basic article with placeholder content
      const enhancedArticle = {
        ...basicArticle,
        article_text: basicArticle.article_text || "<p>Nội dung chi tiết đang được tải...</p>",
        annotations: basicArticle.annotations || []
      };
      setSelectedArticle(enhancedArticle);
    }
  };

  // Get comments for current article
  const articleComments = selectedArticle ? comments.filter(c => c.articleNo === selectedArticle.article_no) : [];

  // Toggle chapter collapse
  const toggleChapterCollapse = (chapterKey: string) => {
    const newCollapsed = new Set(collapsedChapters);
    if (newCollapsed.has(chapterKey)) {
      newCollapsed.delete(chapterKey);
    } else {
      newCollapsed.add(chapterKey);
    }
    setCollapsedChapters(newCollapsed);
  };

  // Get comment type info
  const getCommentTypeInfo = (type: string) => {
    return commentTypes.find(t => t.value === type);
  };

  // Format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get annotation icon
  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'amendment': return 'fas fa-edit text-blue-600';
      case 'note': return 'fas fa-sticky-note text-yellow-600';
      case 'reference': return 'fas fa-link text-green-600';
      default: return 'fas fa-info-circle text-gray-600';
    }
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
      {/* Add New Annotation Modal */}
      {showAnnotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAnnotationForm(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <i className="fas fa-plus mr-2"></i>
                Thêm chú thích mới
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Loại chú thích
                  </label>
                  <select
                    value={newAnnotation.type}
                    onChange={(e) => setNewAnnotation({ ...newAnnotation, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="note">📝 Ghi chú</option>
                    <option value="reference">🔗 Tham chiếu</option>
                    <option value="amendment">✏️ Sửa đổi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nội dung chú thích *
                  </label>
                  <textarea
                    value={newAnnotation.text}
                    onChange={(e) => setNewAnnotation({ ...newAnnotation, text: e.target.value })}
                    placeholder="Nhập nội dung chú thích..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-medium mb-1">Thông tin thêm:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Chú thích sẽ được lưu cho <strong>Điều {selectedArticle?.article_no}</strong></li>
                        <li>Dữ liệu được lưu trong trình duyệt (localStorage)</li>
                        <li>Ngày tạo và cập nhật sẽ được tự động ghi nhận</li>
                        <li>Chú thích người dùng không có trường nguồn</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setNewAnnotation({ type: 'note', text: '', date: '', source: '' });
                  setShowAnnotationForm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={addAnnotation}
                disabled={!newAnnotation.text.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-save mr-2"></i>
                Lưu chú thích
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  🏛️ Interactive Demo - PH Lex Note
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {lawData?.law_title || 'Luật Đầu tư'}
                </p>
              </div>
              <Link 
                href="/demo"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ← Back to Demo
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* TOC Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg sticky top-6">
              {/* TOC Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <i className="fas fa-list mr-2"></i>
                  Mục Lục (TOC)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Cấu trúc hierarchical với chapters và articles
                </p>
              </div>

              {/* Chapters */}
              <div className="max-h-[80vh] overflow-y-auto">
                {lawData?.chapters.map((chapter, chapterIndex: number) => {
                  const chapterKey = `${chapter.chapter_seq}-${chapterIndex}`;
                  const isCollapsed = collapsedChapters.has(chapterKey);
                  
                  return (
                    <div key={`chapter-${chapter.chapter_seq}-${chapterIndex}`} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <button
                        onClick={() => toggleChapterCollapse(chapterKey)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-down'} mr-2 text-sm text-gray-500`}></i>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-left">
                              Chương {chapter.chapter_seq}: {chapter.chapter_title}
                            </h4>
                          </div>
                          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                            {chapter.articles.length} điều
                          </span>
                        </div>
                      </button>
                      
                      {/* Articles - Show/Hide based on collapse state */}
                      {!isCollapsed && (
                        <div className="bg-gray-50 dark:bg-gray-700/50">
                      {chapter.articles.map((article: any, articleIndex: number) => {
                        const isSelected = selectedArticle?.article_no === article.article_no;
                        const articleCommentsCount = comments.filter(c => c.articleNo === article.article_no).length;
                        
                        return (
                          <button
                            key={`article-${chapter.chapter_seq}-${article.article_no}-${articleIndex}`}
                            onClick={() => selectArticle(article)}
                            className={`w-full text-left p-3 hover:bg-white dark:hover:bg-gray-600 transition-colors ${
                              isSelected 
                                ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600' 
                                : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <span className={`font-medium mr-2 ${isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Điều {article.article_no}
                                  </span>
                                  {isSelected && <i className="fas fa-arrow-right text-primary-600 mr-2"></i>}
                                  {articleCommentsCount > 0 && (
                                    <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full mr-2">
                                      {articleCommentsCount}
                                    </span>
                                  )}
                                </div>
                                <div className={`text-xs truncate ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {article.article_heading}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
              {/* Article Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Điều {selectedArticle?.article_no}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                      {selectedArticle?.article_heading}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Giảm cỡ chữ"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                      {fontSize}px
                    </span>
                    <button
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="Tăng cỡ chữ"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      title="In điều này"
                    >
                      <i className="fas fa-print"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="px-6 py-6">
                {selectedArticle ? (
                  <>
                    <div 
                      className="prose dark:prose-invert max-w-none mb-6"
                      style={{ fontSize: `${fontSize}px` }}
                      dangerouslySetInnerHTML={{ __html: selectedArticle?.article_html || selectedArticle?.article_text || '' }}
                    />
                
                    {/* Quick Reference Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <button className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        <i className="fas fa-bookmark mr-1"></i>
                        Lưu bookmark
                      </button>
                      <button className="inline-flex items-center px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                        <i className="fas fa-share mr-1"></i>
                        Chia sẻ
                      </button>
                      <button className="inline-flex items-center px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
                        <i className="fas fa-highlighter mr-1"></i>
                        Đánh dấu
                      </button>
                      <button className="inline-flex items-center px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors">
                        <i className="fas fa-copy mr-1"></i>
                        Sao chép
                      </button>
                    </div>

                    {/* Annotations */}
                    {selectedArticle && ((selectedArticle.annotations?.length || 0) > 0 || annotations.filter(a => a.articleNo === selectedArticle.article_no).length > 0) && (
                      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            <i className="fas fa-bookmark mr-2"></i>
                            Chú thích và tham chiếu
                          </h3>
                          <button
                            onClick={() => setShowAnnotationForm(true)}
                            className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                          >
                            <i className="fas fa-plus mr-1"></i>
                            Thêm chú thích
                          </button>
                        </div>
                        <div className="space-y-4">
                          {currentAnnotations.map((annotation, index) => {
                            const isEditing = editingAnnotationId === annotation.id;
                            return (
                              <div 
                                key={annotation.isOriginal ? `original-${index}` : annotation.id} 
                                className={`p-4 border rounded-lg relative ${
                                  annotation.isOriginal 
                                    ? 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <i className={getAnnotationIcon(annotation.type)}></i>
                                  <div className="flex-1">
                                    {isEditing ? (
                                      <div className="space-y-3">
                                        <textarea
                                          id={`edit-text-${annotation.id}`}
                                          defaultValue={annotation.text}
                                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                                          rows={3}
                                          placeholder="Nội dung chú thích..."
                                        />
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <button 
                                              onClick={() => {
                                                const textInput = document.getElementById(`edit-text-${annotation.id}`) as HTMLTextAreaElement;
                                                if (textInput.value.trim()) {
                                                  updateAnnotation(annotation.id, {
                                                    text: textInput.value.trim()
                                                  });
                                                }
                                              }}
                                              className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                            >
                                              <i className="fas fa-save mr-1"></i>
                                              Lưu
                                            </button>
                                            <button 
                                              onClick={cancelEditingAnnotation}
                                              className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                            >
                                              <i className="fas fa-times mr-1"></i>
                                              Hủy
                                            </button>
                                          </div>
                                          {!annotation.isOriginal && (
                                            <button 
                                              onClick={() => deleteAnnotation(annotation.id)}
                                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                              title="Xóa chú thích"
                                            >
                                              <i className="fas fa-trash mr-1"></i>
                                              Xóa
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <div className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                                              {annotation.text}
                                            </div>
                                            {/* Date info */}
                                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                              {annotation.isOriginal ? (
                                                // Original annotations: show source date
                                                <>  
                                                  {(annotation as any).date && (
                                                    <div>📅 Ngày: {(annotation as any).date}</div>
                                                  )}
                                                  {annotation.source && (
                                                    <div>📄 Nguồn: {annotation.source}</div>
                                                  )}
                                                </>
                                              ) : (
                                                // User annotations: show created/updated dates
                                                <>
                                                  <div>🆕 Người dùng thêm</div>
                                                  {(annotation as any).createdAt && (
                                                    <div>📅 Tạo: {new Date((annotation as any).createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                                                  )}
                                                  {(annotation as any).updatedAt && (annotation as any).updatedAt !== (annotation as any).createdAt && (
                                                    <div>✏️ Sửa: {new Date((annotation as any).updatedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                          {!annotation.isOriginal && (
                                            <div className="flex items-center space-x-1 ml-3">
                                              <button 
                                                onClick={() => startEditingAnnotation(annotation.id)}
                                                className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors" 
                                                title="Chỉnh sửa"
                                              >
                                                <i className="fas fa-edit text-xs"></i>
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* References and Related Articles */}
                    <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          <i className="fas fa-link mr-2"></i>
                          Tham chiếu và điều liên quan
                        </h3>
                        <button
                          onClick={() => setEditingReferences(!editingReferences)}
                          className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          <i className="fas fa-edit mr-1"></i>
                          {editingReferences ? 'Xong' : 'Chỉnh sửa'}
                        </button>
                      </div>
                      
                      {/* Cross References */}
                      <div className="space-y-4">
                        <div className={`p-4 border rounded-lg relative ${editingReferences ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'}`}>
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-exchange-alt text-blue-600 mt-1"></i>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Liên kết trong luật</h4>
                                {editingReferences && (
                                  <button className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded" title="Thêm liên kết">
                                    <i className="fas fa-plus text-xs"></i>
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center group">
                                  {editingReferences ? (
                                    <div className="flex-1 flex items-center space-x-2">
                                      <input
                                        type="text"
                                        defaultValue={`Điều ${selectedArticle?.article_no === 1 ? 2 : selectedArticle?.article_no === 2 ? 3 : 1}`}
                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                                      />
                                      <input
                                        type="text"
                                        defaultValue={selectedArticle?.article_no === 1 ? 'Đối tượng áp dụng' : selectedArticle?.article_no === 2 ? 'Giải thích từ ngữ' : 'Phạm vi điều chỉnh'}
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                                      />
                                      <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Xóa">
                                        <i className="fas fa-trash text-xs"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-blue-700 dark:text-blue-300 hover:underline cursor-pointer text-sm">
                                      → Điều {selectedArticle?.article_no === 1 ? 2 : selectedArticle?.article_no === 2 ? 3 : 1}: 
                                      {selectedArticle?.article_no === 1 ? 'Đối tượng áp dụng' : selectedArticle?.article_no === 2 ? 'Giải thích từ ngữ' : 'Phạm vi điều chỉnh'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center group">
                                  {editingReferences ? (
                                    <div className="flex-1 flex items-center space-x-2">
                                      <input
                                        type="text"
                                        defaultValue="Chương 2"
                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                                      />
                                      <input
                                        type="text"
                                        defaultValue="Chuẩn bị đầu tư dự án PPP (Điều 6-8)"
                                        className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                                      />
                                      <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Xóa">
                                        <i className="fas fa-trash text-xs"></i>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-blue-700 dark:text-blue-300 hover:underline cursor-pointer text-sm">
                                      → Chương 2: Chuẩn bị đầu tư dự án PPP (Điều 6-8)
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-4 border rounded-lg relative ${editingReferences ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'}`}>
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-balance-scale text-green-600 mt-1"></i>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-green-900 dark:text-green-100">Văn bản liên quan</h4>
                                {editingReferences && (
                                  <button className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded" title="Thêm văn bản">
                                    <i className="fas fa-plus text-xs"></i>
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {[
                                  'Luật Đầu tư số 61/2020/QH14',
                                  'Nghị định 35/2021/NĐ-CP - Hướng dẫn thi hành',
                                  'Thông tư 15/2021/TT-BKH - Quy định chi tiết'
                                ].map((doc, idx) => (
                                  <div key={`doc-${idx}`} className="flex items-center group">
                                    {editingReferences ? (
                                      <div className="flex-1 flex items-center space-x-2">
                                        <input
                                          type="text"
                                          defaultValue={doc}
                                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-green-600 focus:border-green-600 dark:bg-gray-600 dark:text-gray-100"
                                        />
                                        <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Xóa">
                                          <i className="fas fa-trash text-xs"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <span className="text-green-700 dark:text-green-300 hover:underline cursor-pointer text-sm">
                                        📄 {doc}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-4 border rounded-lg relative ${editingReferences ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' : 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20'}`}>
                          <div className="flex items-start space-x-3">
                            <i className="fas fa-history text-yellow-600 mt-1"></i>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Lịch sử sửa đổi</h4>
                                {editingReferences && (
                                  <button className="p-1 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded" title="Thêm sự kiện">
                                    <i className="fas fa-plus text-xs"></i>
                                  </button>
                                )}
                              </div>
                              <div className="space-y-2">
                                {[
                                  { date: '17/06/2020', event: 'Ban hành Luật số 61/2020/QH14' },
                                  { date: '29/03/2021', event: 'Sửa đổi bội Nghị định 35/2021/NĐ-CP' }
                                ].map((item, idx) => (
                                  <div key={`history-${idx}`} className="flex items-center group">
                                    {editingReferences ? (
                                      <div className="flex-1 flex items-center space-x-2">
                                        <input
                                          type="text"
                                          defaultValue={item.date}
                                          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-600 focus:border-yellow-600 dark:bg-gray-600 dark:text-gray-100"
                                          placeholder="DD/MM/YYYY"
                                        />
                                        <input
                                          type="text"
                                          defaultValue={item.event}
                                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-yellow-600 focus:border-yellow-600 dark:bg-gray-600 dark:text-gray-100"
                                        />
                                        <button className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded" title="Xóa">
                                          <i className="fas fa-trash text-xs"></i>
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                                        <span className="font-medium">{item.date}:</span> {item.event}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <i className="fas fa-arrow-left text-4xl mb-4"></i>
                    <p className="text-lg">Đang tải dữ liệu...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden sticky top-6">
              {/* Comments Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    <i className="fas fa-comments mr-2"></i>
                    Ghi chú ({articleComments.length})
                  </h3>
                  <button
                    onClick={() => setShowCommentForm(!showCommentForm)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
                    title="Thêm ghi chú"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Comment Form */}
              {showCommentForm && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <div className="space-y-3">
                    {editingComment && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2">
                        <i className="fas fa-edit mr-2"></i>
                        <span>Chỉnh sửa ghi chú</span>
                      </div>
                    )}
                    <select
                      value={newComment.type}
                      onChange={(e) => setNewComment({ ...newComment, type: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:text-gray-100"
                    >
                      {commentTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={newComment.text}
                      onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                      placeholder="Nhập ghi chú của bạn..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={editingComment ? cancelEdit : () => setShowCommentForm(false)}
                        className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={saveComment}
                        className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
                      >
                        {editingComment ? 'Cập nhật' : 'Lưu'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments List */}
              <div className="max-h-96 overflow-y-auto">
                {articleComments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <i className="fas fa-comment-alt text-2xl mb-2"></i>
                    <p className="text-sm">Chưa có ghi chú nào</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {articleComments.map(comment => {
                      const typeInfo = getCommentTypeInfo(comment.type);
                      return (
                        <div key={comment.id} className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${typeInfo?.color || 'bg-gray-100 text-gray-800'}`}>
                              {typeInfo?.label}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editComment(comment)}
                                className="text-gray-400 hover:text-blue-600 text-sm"
                                title="Chỉnh sửa ghi chú"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-600 text-sm"
                                title="Xóa ghi chú"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                            {comment.text}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.timestamp)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}