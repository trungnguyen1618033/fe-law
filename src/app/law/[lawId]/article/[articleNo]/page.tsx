import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LawService } from '@/lib/lawService';
import ArticleComponent from '@/components/ArticleComponent';

interface ArticlePageProps {
  params: {
    lawId: string;
    articleNo: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const lawService = new LawService();
  const lawId = decodeURIComponent(params.lawId);
  const articleNo = parseInt(params.articleNo);
  const article = await lawService.getArticle(lawId, articleNo);
  const lawTree = await lawService.getLawTree(lawId);
  
  if (!article || !lawTree) {
    return {
      title: 'Không tìm thấy điều - PH Lex Note',
      description: 'Điều pháp luật không tồn tại hoặc đã bị xóa.',
    };
  }

  return {
    title: `Điều ${article.article_no} - ${article.article_heading} - ${lawTree.law_title} - PH Lex Note`,
    description: `Nội dung chi tiết của Điều ${article.article_no}: ${article.article_heading} trong ${lawTree.law_title}`,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const lawService = new LawService();
  const lawId = decodeURIComponent(params.lawId);
  const articleNo = parseInt(params.articleNo);
  
  // Fetch article and law tree in parallel
  const [article, lawTree, allArticles] = await Promise.all([
    lawService.getArticle(lawId, articleNo),
    lawService.getLawTree(lawId),
    lawService.getAllArticles(lawId)
  ]);

  if (!article || !lawTree) {
    notFound();
  }

  // Find current chapter
  const currentChapter = lawTree.chapters.find(chapter => 
    chapter.articles.some(art => art.article_no === articleNo)
  );

  // Find navigation info
  const articleIndex = allArticles.findIndex(art => art.article_no === articleNo);
  const prevArticle = articleIndex > 0 ? allArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex < allArticles.length - 1 ? allArticles[articleIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <a href={`/law/${lawId}`} className="hover:text-primary-600 dark:hover:text-primary-400">
            {lawTree.law_title}
          </a>
          <i className="fas fa-chevron-right text-xs"></i>
          {currentChapter && (
            <>
              <span>Chương {currentChapter.chapter_seq}: {currentChapter.chapter_title}</span>
              <i className="fas fa-chevron-right text-xs"></i>
            </>
          )}
          <span className="text-gray-900 dark:text-gray-100">
            Điều {article.article_no}
          </span>
        </nav>

        <ArticleComponent 
          article={article}
          lawId={lawId}
          lawTitle={lawTree.law_title}
          lawTree={lawTree}
          currentChapter={currentChapter}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />
      </div>
    </div>
  );
}