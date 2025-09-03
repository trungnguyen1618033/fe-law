'use client';

import { useState, useEffect } from 'react';
import { Article, Annotation, Chapter, Comment, LawTree } from '@/types/law';
import { LawServiceClient } from '@/lib/lawService.client';

interface ArticleComponentProps {
  article: Article;
  lawId: string;
  lawTitle: string;
  lawTree: LawTree;
  currentChapter?: Chapter;
  prevArticle?: Article | null;
  nextArticle?: Article | null;
}

export default function ArticleComponent({ 
  article, 
  lawId, 
  lawTitle,
  currentChapter,
  prevArticle,
  nextArticle
}: ArticleComponentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState({ type: 'personal' as const, text: '' });
  const [fontSize, setFontSize] = useState(16);
  
  const lawService = new LawServiceClient();

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`comments_${lawId}_${article.article_no}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [lawId, article.article_no]);

  const saveComment = () => {
    if (!newComment.text.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      type: newComment.type,
      text: newComment.text,
      timestamp: new Date().toISOString(),
      lawId,
      articleNo: article.article_no
    };

    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${lawId}_${article.article_no}`, JSON.stringify(updatedComments));
    
    setNewComment({ type: 'personal', text: '' });
    setShowCommentForm(false);
  };

  const deleteComment = (commentId: number) => {
    const updatedComments = comments.filter(c => c.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem(`comments_${lawId}_${article.article_no}`, JSON.stringify(updatedComments));
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'amendment': return 'fas fa-edit text-blue-600';
      case 'note': return 'fas fa-sticky-note text-yellow-600';
      case 'reference': return 'fas fa-link text-green-600';
      default: return 'fas fa-info-circle text-gray-600';
    }
  };

  const getCommentTypeInfo = (type: string) => {
    return lawService.getCommentTypes().find(t => t.value === type);
  };

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
  };

  const printArticle = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Article Header with Title and Action Buttons */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Điều {article.article_no}: {article.article_heading}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {lawTitle}
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
            <button 
              onClick={() => setShowCommentForm(!showCommentForm)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
            >
              <i className="fas fa-pen mr-2"></i>
              Đánh dấu
            </button>
            <button 
              onClick={printArticle}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
            >
              <i className="fas fa-copy mr-2"></i>
              Sao chép
            </button>
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={() => adjustFontSize(-2)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Giảm cỡ chữ"
              >
                <i className="fas fa-minus"></i>
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                {fontSize}px
              </span>
              <button
                onClick={() => adjustFontSize(2)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                title="Tăng cỡ chữ"
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Article Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-6">
              {currentChapter && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Chương {currentChapter.chapter_seq}: {currentChapter.chapter_title}
                  </span>
                </div>
              )}

              <div 
                className="prose dark:prose-invert max-w-none"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: article.article_text }}
              />

            </div>

          </div>
        </div>

        {/* Right Sidebar - References and Related Links */}
        <div className="space-y-6">
          {/* References and Links Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <i className="fas fa-link mr-2 text-blue-600"></i>
                Tham chiếu và điều liên quan
                <button className="ml-auto text-green-600 hover:text-green-700">
                  <i className="fas fa-edit"></i>
                  <span className="ml-1 text-sm">Chính sửa</span>
                </button>
              </h3>
            </div>
            
            <div className="p-4">
              {/* Internal References */}
              <div className="mb-6">
                <h4 className="flex items-center text-blue-600 font-medium mb-3">
                  <i className="fas fa-arrow-right mr-2"></i>
                  Liên kết trong luật
                </h4>
                <div className="space-y-2">
                  <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Điều 2: Đối tượng áp dụng
                  </a>
                  <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                    → Chương 2: Chuẩn bị đầu tư dự án PPP (Điều 6-8)
                  </a>
                </div>
              </div>
              
              {/* Related Documents */}
              <div>
                <h4 className="flex items-center text-green-600 font-medium mb-3">
                  <i className="fas fa-balance-scale mr-2"></i>
                  Văn bản liên quan
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-file-alt text-gray-400 mt-1"></i>
                    <div>
                      <a href="#" className="text-green-600 hover:text-green-800 text-sm font-medium block">
                        Luật Đầu tư số 61/2020/QH14
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-file-alt text-gray-400 mt-1"></i>
                    <div>
                      <a href="#" className="text-green-600 hover:text-green-800 text-sm font-medium block">
                        Nghị định 35/2021/NĐ-CP - Hướng dẫn thi hành
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-file-alt text-gray-400 mt-1"></i>
                    <div>
                      <a href="#" className="text-green-600 hover:text-green-800 text-sm font-medium block">
                        Thông tư 15/2021/TT-BKH - Quy định chi tiết
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* History Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <i className="fas fa-history mr-2 text-orange-600"></i>
                Lịch sử sửa đổi
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm">
                <div className="font-medium text-orange-600">17/06/2020: Ban hành Luật số 61/2020/QH14</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-orange-600">29/03/2021: Sửa đổi bởi Nghị định 35/2021/NĐ-CP</div>
              </div>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <i className="fas fa-comments mr-2"></i>
                  Ghi chú ({comments.length})
                </h3>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="text-blue-600 hover:text-blue-700"
                  title="Thêm ghi chú"
                >
                  <i className="fas fa-plus mr-1"></i>
                  <span className="text-sm">Thêm ghi chú</span>
                </button>
              </div>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="space-y-3">
                  <select
                    value={newComment.type}
                    onChange={(e) => setNewComment({ ...newComment, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100"
                  >
                    {lawService.getCommentTypes().map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={newComment.text}
                    onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                    placeholder="Nhập ghi chú của bạn..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowCommentForm(false)}
                      className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={saveComment}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm italic">Chưa có ghi chú nào</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {comments.map(comment => {
                    const typeInfo = getCommentTypeInfo(comment.type);
                    return (
                      <div key={comment.id} className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className={`comment-type-badge type-${comment.type}`}>
                            {typeInfo?.label}
                          </span>
                          <button
                            onClick={() => deleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-600 text-sm"
                            title="Xóa ghi chú"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {lawService.formatVietnameseDate(comment.timestamp)}
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
      
      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {prevArticle && (
                <a
                  href={`/law/${lawId}/article/${prevArticle.article_no}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-chevron-left mr-2"></i>
                  Điều {prevArticle.article_no}
                </a>
              )}
            </div>
            <div>
              <a
                href={`/law/${lawId}/toc`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-600 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors mx-2"
              >
                <i className="fas fa-list mr-2"></i>
                Mục lục
              </a>
            </div>
            <div>
              {nextArticle && (
                <a
                  href={`/law/${lawId}/article/${nextArticle.article_no}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Điều {nextArticle.article_no}
                  <i className="fas fa-chevron-right ml-2"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Annotations - if any */}
      {article.annotations && article.annotations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <i className="fas fa-bookmark mr-2 text-yellow-600"></i>
              Chú thích và tham chiếu từ hệ thống
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {article.annotations.map((annotation, index) => (
              <div 
                key={index} 
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <i className={getAnnotationIcon(annotation.type)}></i>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {annotation.text}
                    </div>
                    {(annotation.date || annotation.source) && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {annotation.date && <span>Ngày: {annotation.date}</span>}
                        {annotation.source && (
                          <span className={annotation.date ? 'ml-4' : ''}>
                            Nguồn: {annotation.source}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}