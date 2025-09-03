import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LawService } from '@/lib/lawService';
import SearchComponent from '@/components/SearchComponent';

interface SearchPageProps {
  params: Promise<{
    lawId: string;
  }>;
  searchParams: Promise<{
    q?: string;
    filter?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
  const lawService = new LawService();
  const { lawId } = await params;
  const decodedLawId = decodeURIComponent(lawId);
  const lawTree = await lawService.getLawTree(decodedLawId);
  
  if (!lawTree) {
    return {
      title: 'Không tìm thấy văn bản - PH Lex Note',
      description: 'Văn bản pháp luật không tồn tại hoặc đã bị xóa.',
    };
  }

  const searchParamsResolved = await searchParams;
  const query = searchParamsResolved.q ? decodeURIComponent(searchParamsResolved.q) : '';
  
  return {
    title: query 
      ? `Tìm kiếm "${query}" - ${lawTree.law_title} - PH Lex Note`
      : `Tìm kiếm - ${lawTree.law_title} - PH Lex Note`,
    description: query
      ? `Kết quả tìm kiếm cho "${query}" trong ${lawTree.law_title}`
      : `Tìm kiếm nội dung trong ${lawTree.law_title} với công cụ tìm kiếm mạnh mẽ`,
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { lawId } = await params;
  const searchParamsResolved = await searchParams;
  const decodedLawId = decodeURIComponent(lawId);
  const query = searchParamsResolved.q ? decodeURIComponent(searchParamsResolved.q) : '';
  
  const lawService = new LawService();
  
  // Fetch law data in parallel
  const [lawTree, allArticles, searchIndex] = await Promise.all([
    lawService.getLawTree(decodedLawId),
    lawService.getAllArticles(decodedLawId),
    lawService.searchArticles(decodedLawId, query)
  ]);

  if (!lawTree) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <i className="fas fa-search mr-3"></i>
                  Tìm kiếm
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {lawTree.law_title}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href={`/law/${lawId}/toc`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-list mr-2"></i>
                  Mục lục
                </a>
                <a 
                  href={`/law/${lawId}/all`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Toàn văn
                </a>
                <a 
                  href={`/law/${lawId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Quay lại
                </a>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải...</span>
            </div>
          </div>
        }>
          <SearchComponent 
            lawTree={lawTree}
            allArticles={allArticles}
            searchIndex={searchIndex}
            lawId={decodedLawId}
            initialQuery={query}
            searchParams={searchParamsResolved}
          />
        </Suspense>
      </div>
    </div>
  );
}