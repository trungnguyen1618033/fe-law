'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LawTree, Article, SearchIndex } from '@/types/law';
import { LawServiceClient } from '@/lib/lawService.client';

interface SearchComponentProps {
  lawTree: LawTree;
  allArticles: Article[];
  searchIndex: SearchIndex[];
  lawId: string;
  initialQuery: string;
  searchParams: {
    q?: string;
    filter?: string;
    sort?: string;
  };
}

interface SearchResult extends SearchIndex {
  article: Article;
  chapter: any;
  relevanceScore: number;
}

export default function SearchComponent({ 
  lawTree, 
  allArticles, 
  searchIndex, 
  lawId, 
  initialQuery,
  searchParams 
}: SearchComponentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.sort || 'relevance');
  const [filterBy, setFilterBy] = useState(searchParams.filter || 'all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const lawService = new LawServiceClient();

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`search_history_${lawId}`);
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, [lawId]);

  // Save search to history
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem(`search_history_${lawId}`, JSON.stringify(newHistory));
  }, [searchHistory, lawId]);

  // Calculate relevance score
  const calculateRelevance = useCallback((item: SearchIndex, searchTerm: string): number => {
    if (!searchTerm) return 0;
    
    const term = searchTerm.toLowerCase();
    let score = 0;
    
    // Title matches get higher score
    const titleMatches = (item.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    score += titleMatches * 10;
    
    // Body matches
    const bodyMatches = (item.body.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    score += bodyMatches * 3;
    
    // Annotation matches
    const annotationMatches = (item.annotations_text.toLowerCase().match(new RegExp(term, 'g')) || []).length;
    score += annotationMatches * 5;
    
    // Boost for exact phrase matches
    if (item.title.toLowerCase().includes(term)) score += 20;
    if (item.body.toLowerCase().includes(term)) score += 10;
    
    return score;
  }, []);

  // Perform search
  const performSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const searchResults: SearchResult[] = searchIndex
        .map(item => {
          const article = allArticles.find(art => art.article_no === item.article_no);
          const chapter = lawTree.chapters.find(ch => ch.chapter_seq === item.chapter_seq);
          
          if (!article) return null;
          
          return {
            ...item,
            article,
            chapter,
            relevanceScore: calculateRelevance(item, searchTerm)
          };
        })
        .filter((item): item is SearchResult => item !== null && item.relevanceScore > 0);

      // Apply filters
      let filteredResults = searchResults;
      if (filterBy !== 'all') {
        filteredResults = searchResults.filter(result => {
          switch (filterBy) {
            case 'title':
              return result.title.toLowerCase().includes(searchTerm.toLowerCase());
            case 'content':
              return result.body.toLowerCase().includes(searchTerm.toLowerCase());
            case 'annotations':
              return result.annotations_text.toLowerCase().includes(searchTerm.toLowerCase());
            default:
              return true;
          }
        });
      }

      // Apply sorting
      filteredResults.sort((a, b) => {
        switch (sortBy) {
          case 'article':
            return a.article_no - b.article_no;
          case 'chapter':
            return a.chapter_seq - b.chapter_seq;
          case 'relevance':
          default:
            return b.relevanceScore - a.relevanceScore;
        }
      });

      setResults(filteredResults);
      saveToHistory(searchTerm);
    } finally {
      setIsLoading(false);
    }
  }, [searchIndex, allArticles, lawTree, calculateRelevance, sortBy, filterBy, saveToHistory]);

  // Handle search
  const handleSearch = useCallback((searchTerm: string, updateUrl: boolean = true) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
    
    if (updateUrl) {
      const params = new URLSearchParams();
      if (searchTerm) params.set('q', searchTerm);
      if (sortBy !== 'relevance') params.set('sort', sortBy);
      if (filterBy !== 'all') params.set('filter', filterBy);
      
      const newUrl = `/law/${lawId}/search${params.toString() ? '?' + params.toString() : ''}`;
      router.push(newUrl);
    }
  }, [lawId, sortBy, filterBy, performSearch, router]);

  // Initial search
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // Update search when sort/filter changes
  useEffect(() => {
    if (query) {
      performSearch(query);
      handleSearch(query, true);
    }
  }, [sortBy, filterBy, query, performSearch, handleSearch]);

  const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text;
    return lawService.highlightSearchTerm(text, searchTerm);
  };

  const getSnippet = (text: string, searchTerm: string, maxLength: number = 200): string => {
    if (!searchTerm) return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    
    const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (index === -1) return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + searchTerm.length + 150);
    
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Search Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-4">
          {/* Search Box */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm trong văn bản..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
              <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
              <button
                onClick={() => handleSearch(query)}
                disabled={isLoading}
                className="absolute right-2 top-2 px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Tìm'}
              </button>
            </div>
          </div>

          {/* Advanced Search */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                <i className="fas fa-sliders-h mr-2"></i>
                Tùy chọn tìm kiếm
              </h3>
              <i className={`fas fa-chevron-${showAdvanced ? 'up' : 'down'} text-gray-400`}></i>
            </button>
            
            {showAdvanced && (
              <div className="mt-4 space-y-4">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sắp xếp theo
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="relevance">Độ liên quan</option>
                    <option value="article">Số điều</option>
                    <option value="chapter">Chương</option>
                  </select>
                </div>

                {/* Filter By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tìm trong
                  </label>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="all">Toàn bộ</option>
                    <option value="title">Tiêu đề điều</option>
                    <option value="content">Nội dung</option>
                    <option value="annotations">Chú thích</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                <i className="fas fa-history mr-2"></i>
                Tìm kiếm gần đây
              </h3>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <i className="fas fa-clock mr-2"></i>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {results.length > 0 && (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                <i className="fas fa-chart-bar mr-2"></i>
                Thống kê
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kết quả:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{results.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Từ khóa:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">&quot;{query}&quot;</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          {/* Results Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Kết quả tìm kiếm
                {query && <span className="text-primary-600 dark:text-primary-400 ml-2">&quot;{query}&quot;</span>}
              </h2>
              {results.length > 0 && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {results.length} kết quả
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Đang tìm kiếm...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Không có kết quả nào cho từ khóa &quot;{query}&quot;
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                <p>Gợi ý:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Kiểm tra chính tả từ khóa</li>
                  <li>Sử dụng từ khóa ngắn gọn hơn</li>
                  <li>Thử tìm kiếm với từ khóa tương tự</li>
                </ul>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!query && (
            <div className="p-8 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Tìm kiếm trong văn bản
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nhập từ khóa để tìm kiếm nội dung trong {lawTree.law_title}
              </p>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result, index) => (
                <div key={`${result.article_no}-${index}`} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  {/* Result Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                          {result.article_no}
                        </span>
                      </div>
                      <div>
                        <Link
                          href={`/law/${lawId}/article/${result.article_no}`}
                          className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
                        >
                          Điều {result.article_no}
                        </Link>
                        {result.chapter && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Chương {result.chapter.chapter_seq}: {result.chapter.chapter_title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        Điểm: {result.relevanceScore}
                      </span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 
                    className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.title, query) 
                    }}
                  />

                  {/* Content Snippet */}
                  <div 
                    className="text-sm text-gray-600 dark:text-gray-400 mb-3"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(getSnippet(result.body, query), query) 
                    }}
                  />

                  {/* Annotations */}
                  {result.annotations_text && result.annotations_text.toLowerCase().includes(query.toLowerCase()) && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-3">
                      <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        <i className="fas fa-bookmark mr-1"></i>
                        Chú thích có chứa từ khóa
                      </h4>
                      <div 
                        className="text-xs text-blue-800 dark:text-blue-200"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(getSnippet(result.annotations_text, query, 150), query) 
                        }}
                      />
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex items-center space-x-4 text-sm">
                    <Link
                      href={`/law/${lawId}/article/${result.article_no}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 font-medium transition-colors"
                    >
                      <i className="fas fa-external-link-alt mr-1"></i>
                      Xem chi tiết
                    </Link>
                    <Link
                      href={`/law/${lawId}/all#article-${result.article_no}`}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      <i className="fas fa-file-alt mr-1"></i>
                      Xem trong toàn văn
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}