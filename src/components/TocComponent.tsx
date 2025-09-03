'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LawTree, Chapter } from '@/types/law';

interface TocComponentProps {
  lawTree: LawTree;
  lawId: string;
}

export default function TocComponent({ lawTree, lawId }: TocComponentProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleChapter = (chapterSeq: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterSeq)) {
      newExpanded.delete(chapterSeq);
    } else {
      newExpanded.add(chapterSeq);
    }
    setExpandedChapters(newExpanded);
  };

  const expandAll = () => {
    setExpandedChapters(new Set(lawTree.chapters.map(ch => ch.chapter_seq)));
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  const filteredChapters = lawTree.chapters.filter(chapter => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      chapter.chapter_title.toLowerCase().includes(query) ||
      chapter.articles.some(article => 
        article.article_heading.toLowerCase().includes(query) ||
        article.article_no.toString().includes(query)
      )
    );
  });

  return (
    <div className="p-6">
      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Tìm kiếm trong mục lục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
          >
            <i className="fas fa-expand-arrows-alt mr-2"></i>
            Mở tất cả
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
          >
            <i className="fas fa-compress-arrows-alt mr-2"></i>
            Thu gọn
          </button>
        </div>
      </div>

      {/* Chapter List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => (
          <div key={chapter.chapter_seq} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Chapter Header */}
            <div
              onClick={() => toggleChapter(chapter.chapter_seq)}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <i className={`fas ${expandedChapters.has(chapter.chapter_seq) ? 'fa-chevron-down' : 'fa-chevron-right'} text-gray-500`}></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Chương {chapter.chapter_seq}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {chapter.chapter_title}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {chapter.articles.length} điều
              </div>
            </div>

            {/* Chapter Articles */}
            {expandedChapters.has(chapter.chapter_seq) && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {chapter.articles.map((article) => (
                    <Link
                      key={article.article_no}
                      href={`/law/${lawId}/article/${article.article_no}`}
                      className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-12 h-8 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center mr-3 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 transition-colors">
                        <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                          {article.article_no}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          Điều {article.article_no}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {article.article_heading}
                        </p>
                      </div>
                      <i className="fas fa-chevron-right text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"></i>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredChapters.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
          </p>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          Thống kê văn bản
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Tổng chương:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {lawTree.chapters.length}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Tổng điều:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {lawTree.chapters.reduce((total, chapter) => total + chapter.articles.length, 0)}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Đang hiển thị:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {filteredChapters.length} chương
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Đã mở rộng:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
              {expandedChapters.size} chương
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}