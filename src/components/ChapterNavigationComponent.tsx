'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LawTree, Chapter, Article } from '@/types/law';

interface ChapterNavigationComponentProps {
  lawTree: LawTree;
  currentArticleNo: number;
  lawId: string;
}

export default function ChapterNavigationComponent({ 
  lawTree, 
  currentArticleNo, 
  lawId 
}: ChapterNavigationComponentProps) {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  // Find current chapter
  const currentChapter = lawTree.chapters.find(chapter => 
    chapter.articles.some(article => article.article_no === currentArticleNo)
  );

  // Auto-expand current chapter
  useState(() => {
    if (currentChapter && expandedChapter === null) {
      setExpandedChapter(currentChapter.chapter_seq);
    }
  });

  const toggleChapter = (chapterSeq: number) => {
    setExpandedChapter(expandedChapter === chapterSeq ? null : chapterSeq);
  };

  const getArticleStatus = (article: Article) => {
    if (article.article_no === currentArticleNo) return 'current';
    if (article.article_no < currentArticleNo) return 'completed';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return 'fas fa-arrow-right text-primary-600';
      case 'completed': return 'fas fa-check text-green-600';
      case 'upcoming': return 'fas fa-circle text-gray-400';
      default: return 'fas fa-circle text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <i className="fas fa-sitemap mr-2"></i>
          Cấu trúc văn bản
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {lawTree.law_title}
        </p>
      </div>

      {/* Chapter List */}
      <div className="max-h-96 overflow-y-auto">
        {lawTree.chapters.map((chapter) => (
          <div key={chapter.chapter_seq} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.chapter_seq)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                chapter.chapter_seq === currentChapter?.chapter_seq 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <i className={`fas ${expandedChapter === chapter.chapter_seq ? 'fa-chevron-down' : 'fa-chevron-right'} text-gray-400`}></i>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Chương {chapter.chapter_seq}
                    </span>
                    {chapter.chapter_seq === currentChapter?.chapter_seq && (
                      <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                        Hiện tại
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-6">
                    {chapter.chapter_title}
                  </p>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {chapter.articles.length} điều
                </span>
              </div>
            </button>

            {/* Chapter Articles */}
            {expandedChapter === chapter.chapter_seq && (
              <div className="bg-gray-50 dark:bg-gray-700/50">
                <div className="px-4 py-2">
                  <div className="grid grid-cols-1 gap-1">
                    {chapter.articles.map((article) => {
                      const status = getArticleStatus(article);
                      return (
                        <Link
                          key={article.article_no}
                          href={`/law/${lawId}/article/${article.article_no}`}
                          className={`flex items-center p-2 rounded transition-colors ${
                            article.article_no === currentArticleNo
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100'
                              : 'hover:bg-white dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <i className={`${getStatusIcon(status)} mr-3 text-sm`}></i>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              Điều {article.article_no}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {article.article_heading}
                            </div>
                          </div>
                          {article.article_no === currentArticleNo && (
                            <i className="fas fa-eye text-primary-600 ml-2"></i>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer with Stats */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div>
            <i className="fas fa-info-circle mr-1"></i>
            Điều {currentArticleNo} / {lawTree.chapters.reduce((total, ch) => total + ch.articles.length, 0)}
          </div>
          {currentChapter && (
            <div>
              Chương {currentChapter.chapter_seq} / {lawTree.chapters.length}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
          <div 
            className="bg-primary-600 h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${(currentArticleNo / lawTree.chapters.reduce((total, ch) => total + ch.articles.length, 0)) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}