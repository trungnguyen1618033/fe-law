import { Metadata } from 'next';
import { LawService } from '@/lib/lawService';
import Link from 'next/link';

interface LawPageProps {
  params: {
    lawId: string;
  };
}

export async function generateMetadata({ params }: LawPageProps): Promise<Metadata> {
  const lawService = new LawService();
  const lawId = decodeURIComponent(params.lawId);
  const lawTree = await lawService.getLawTree(lawId);
  
  if (!lawTree) {
    return {
      title: 'Không tìm thấy văn bản - PH Lex Note',
      description: 'Văn bản pháp luật không tồn tại hoặc đã bị xóa.',
    };
  }

  return {
    title: `${lawTree.law_title} - PH Lex Note`,
    description: `Xem và nghiên cứu ${lawTree.law_title} với giao diện chuyên nghiệp.`,
  };
}

export default async function LawPage({ params }: LawPageProps) {
  console.log('LawPage - Received params:', params);
  const lawId = decodeURIComponent(params.lawId);
  console.log('LawPage - Decoded lawId:', lawId);
  
  const lawService = new LawService();
  const lawTree = await lawService.getLawTree(lawId);
  const allArticles = await lawService.getAllArticles(lawId);

  if (!lawTree) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Không tìm thấy văn bản
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Văn bản pháp luật với ID "{lawId}" không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {lawTree.law_title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                ID: {lawId}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {lawTree.chapters.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Chương</div>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {allArticles.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Điều</div>
              </div>
              <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  2020
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Năm ban hành</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href={`/law/${lawId}/toc`}
                className="flex items-center justify-center px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <i className="fas fa-list mr-3"></i>
                <span className="font-medium">Mục lục</span>
              </Link>
              
              <Link
                href={`/law/${lawId}/all`}
                className="flex items-center justify-center px-6 py-4 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <i className="fas fa-file-alt mr-3"></i>
                <span className="font-medium">Toàn văn</span>
              </Link>
              
              <Link
                href={`/law/${lawId}/article/1`}
                className="flex items-center justify-center px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-play mr-3"></i>
                <span className="font-medium">Bắt đầu đọc</span>
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Danh sách chương
              </h2>
              <div className="space-y-2">
                {lawTree.chapters.map((chapter) => (
                  <div key={chapter.chapter_seq} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          Chương {chapter.chapter_seq}: {chapter.chapter_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {chapter.articles.length} điều
                        </p>
                      </div>
                      <Link
                        href={`/law/${lawId}/article/${chapter.articles[0]?.article_no || 1}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 text-sm font-medium"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}