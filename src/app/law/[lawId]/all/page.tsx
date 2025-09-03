import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LawService } from '@/lib/lawService';
import AllArticlesComponent from '@/components/AllArticlesComponent';

interface AllArticlesPageProps {
  params: Promise<{
    lawId: string;
  }>;
}

export async function generateMetadata({ params }: AllArticlesPageProps): Promise<Metadata> {
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

  return {
    title: `Toàn văn - ${lawTree.law_title} - PH Lex Note`,
    description: `Toàn văn ${lawTree.law_title} với tất cả các điều được hiển thị liên tục để dễ dàng đọc và tìm kiếm.`,
  };
}

export default async function AllArticlesPage({ params }: AllArticlesPageProps) {
  const { lawId } = await params;
  console.log('AllArticlesPage - Received lawId:', lawId);
  
  // Decode URL parameters in case they're encoded
  const decodedLawId = decodeURIComponent(lawId);
  console.log('AllArticlesPage - Decoded lawId:', decodedLawId);
  
  const lawService = new LawService();
  
  // Fetch law tree and all articles in parallel
  const [lawTree, allArticles] = await Promise.all([
    lawService.getLawTree(decodedLawId),
    lawService.getAllArticles(decodedLawId)
  ]);

  if (!lawTree || !allArticles || allArticles.length === 0) {
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
                  Toàn văn
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  {lawTree.law_title}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <a 
                  href={`/law/${decodedLawId}/toc`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-list mr-2"></i>
                  Mục lục
                </a>
                <a 
                  href={`/law/${lawId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Quay lại
                </a>
                <button className="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 transition-colors">
                  <i className="fas fa-print mr-2"></i>
                  In toàn văn
                </button>
              </div>
            </div>
          </div>
        </div>

        <AllArticlesComponent 
          lawTree={lawTree}
          allArticles={allArticles}
          lawId={decodedLawId}
        />
      </div>
    </div>
  );
}