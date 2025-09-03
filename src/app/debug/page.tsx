import Link from 'next/link';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🐛 Debug URLs - Direct Links
        </h1>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Links:</h2>
            
            <div className="space-y-2">
              <div>
                <Link 
                  href="/law/61-2020-QH14" 
                  className="text-blue-600 hover:underline"
                >
                  📄 Law Main Page
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/law/61-2020-QH14/toc" 
                  className="text-blue-600 hover:underline"
                >
                  📋 Table of Contents
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/law/61-2020-QH14/article/1" 
                  className="text-blue-600 hover:underline"
                >
                  📄 Article 1
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/law/61-2020-QH14/all" 
                  className="text-blue-600 hover:underline"
                >
                  📚 All Articles
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/law/61-2020-QH14/search?q=đầu tư" 
                  className="text-blue-600 hover:underline"
                >
                  🔍 Search
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/test" 
                  className="text-green-600 hover:underline"
                >
                  🧪 Test Data
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 <strong>Debug Info:</strong> Use browser network tab to see actual requests and responses.
              Check if URLs resolve correctly or return 404.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}