'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LawTree, Article } from '@/types/law';
import { LawServiceClient } from '@/lib/lawService.client';

interface AllArticlesComponentProps {
  lawTree: LawTree;
  allArticles: Article[];
  lawId: string;
}

export default function AllArticlesComponent({ 
  lawTree, 
  allArticles, 
  lawId 
}: AllArticlesComponentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [showChapterHeaders, setShowChapterHeaders] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const lawService = new LawServiceClient();

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter articles based on search query
  const filteredArticles = allArticles.filter(article => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      article.article_heading.toLowerCase().includes(query) ||
      article.article_text.toLowerCase().includes(query) ||
      article.article_no.toString().includes(query) ||
      article.annotations?.some(annotation => 
        annotation.text.toLowerCase().includes(query)
      )
    );
  });

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
  };

  // Group articles by chapter for display
  const articlesByChapter = lawTree.chapters.map(chapter => ({
    ...chapter,
    articles: chapter.articles.filter(chapterArticle => 
      filteredArticles.some(filteredArticle => 
        filteredArticle.article_no === chapterArticle.article_no
      )
    ).map(chapterArticle => 
      allArticles.find(fullArticle => 
        fullArticle.article_no === chapterArticle.article_no
      )
    ).filter(Boolean) as Article[]
  })).filter(chapter => chapter.articles.length > 0);

  const totalArticles = allArticles.length;
  const filteredCount = filteredArticles.length;

  const highlightSearchTerm = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text;
    return lawService.highlightSearchTerm(text, searchTerm);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sticky Controls Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-4">
          {/* Search */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              <i className="fas fa-search mr-2"></i>
              Tìm kiếm
            </h3>
            <input
              type="text"
              placeholder="Tìm kiếm trong toàn văn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
            />
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {filteredCount} / {totalArticles} điều
              </div>
            )}
          </div>

          {/* Display Controls */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              <i className="fas fa-cog mr-2"></i>
              Hiển thị
            </h3>
            <div className="space-y-3">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cỡ chữ
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => adjustFontSize(-2)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Giảm cỡ chữ"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-2 min-w-[40px] text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={() => adjustFontSize(2)}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    title="Tăng cỡ chữ"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Chapter Headers Toggle */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showChapterHeaders}
                    onChange={(e) => setShowChapterHeaders(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Hiển thị tiêu đề chương
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Reading Progress */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              <i className="fas fa-chart-line mr-2"></i>
              Tiến độ đọc
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(scrollProgress)}% hoàn thành
            </div>
          </div>

          {/* Quick Jump */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              <i className="fas fa-list-ol mr-2"></i>
              Chuyển nhanh
            </h3>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {articlesByChapter.map((chapter) => (
                <div key={chapter.chapter_seq}>
                  <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Chương {chapter.chapter_seq}
                  </div>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {chapter.articles.map((article) => (
                      <button
                        key={article.article_no}
                        onClick={() => {
                          const element = document.getElementById(`article-${article.article_no}`);
                          element?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                      >
                        {article.article_no}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          {filteredCount === 0 ? (
            <div className="p-8 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Thử tìm kiếm với từ khóa khác
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {articlesByChapter.map((chapter, chapterIndex) => (
                <div key={chapter.chapter_seq}>
                  {/* Chapter Header */}
                  {showChapterHeaders && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Chương {chapter.chapter_seq}: {chapter.chapter_title}
                      </h2>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {chapter.articles.length} điều
                      </div>
                    </div>
                  )}

                  {/* Chapter Articles */}
                  {chapter.articles.map((article, articleIndex) => (
                    <article 
                      key={article.article_no}
                      id={`article-${article.article_no}`}
                      className="px-6 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Article Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-700 dark:text-primary-300">
                              {article.article_no}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Điều {article.article_no}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {article.article_heading}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/law/${lawId}/article/${article.article_no}`}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm font-medium"
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          Chi tiết
                        </Link>
                      </div>

                      {/* Article Content */}
                      <div 
                        className="prose dark:prose-invert max-w-none"
                        style={{ fontSize: `${fontSize}px` }}
                        dangerouslySetInnerHTML={{ 
                          __html: highlightSearchTerm(article.article_text, searchQuery) 
                        }}
                      />

                      {/* Annotations */}
                      {article.annotations && article.annotations.length > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            <i className="fas fa-bookmark mr-1"></i>
                            Chú thích và tham chiếu
                          </h4>
                          <div className="space-y-2">
                            {article.annotations.map((annotation, index) => (
                              <div key={index} className="text-sm text-blue-800 dark:text-blue-200">
                                <span 
                                  dangerouslySetInnerHTML={{ 
                                    __html: highlightSearchTerm(annotation.text, searchQuery) 
                                  }}
                                />
                                {annotation.date && (
                                  <span className="text-xs text-blue-600 dark:text-blue-400 ml-2">
                                    ({annotation.date})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {totalArticles}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Tổng điều</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {lawTree.chapters.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chương</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {filteredCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Đang hiển thị</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {Math.round(scrollProgress)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Đã đọc</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}