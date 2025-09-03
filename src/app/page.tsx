export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full">
              <i className="fas fa-balance-scale text-4xl text-primary-600 dark:text-primary-400"></i>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            PH Lex Note
          </h1>
          
          <h2 className="text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            MOJ Taiwan-inspired Legal Document Viewer
          </h2>
          
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            🏛️ <strong>Professional legal document interface</strong> lấy cảm hứng từ MOJ Taiwan với tính năng 
            <strong> Comment System</strong> mạnh mẽ cho nghiên cứu pháp luật Việt Nam.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="text-purple-600 dark:text-purple-400 text-3xl mb-4">
              <i className="fas fa-comments"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 Comment System cho Legal Research
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
              <li><strong>5 loại comments</strong>: Cá nhân, Phân tích pháp lý, Án lệ, Thắc mắc, Quan trọng</li>
              <li><strong>Real-time sync</strong>: Comments hiển thị đồng bộ giữa TOC và Article pages</li>
              <li><strong>Color-coded badges</strong>: Dễ dàng phân biệt các loại ghi chú</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
            <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">
              <i className="fas fa-landmark"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🏛️ MOJ Taiwan-inspired Interface
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 leading-relaxed">
              <li><strong>Enhanced TOC</strong>: Professional 4-column layout với comment indicators</li>
              <li><strong>Article Page</strong>: 3-column layout với comment sidebar</li>
              <li><strong>Full Text</strong>: Toàn văn với sticky navigation</li>
            </ul>
          </div>
        </div>

        {/* Demo Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            <i className="fas fa-rocket text-primary-600 dark:text-primary-400 mr-2"></i>
            Demo Experience Center
          </h3>
          
          {/* Main Demos */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <a 
              href="/demo"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-xl mb-2">Basic Demo</h4>
                <p className="text-blue-100 text-sm mb-4">
                  Demo cơ bản với mock data và các tính năng chính
                </p>
                <div className="text-xs bg-blue-400/30 px-3 py-1 rounded-full inline-block">
                  Mock Data • Static Features
                </div>
              </div>
            </a>
            
            <a 
              href="/demo-modern"
              className="group bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="font-bold text-xl mb-2">Modern Demo</h4>
                <p className="text-green-100 text-sm mb-4">
                  Giao diện hiện đại với đầy đủ chức năng và thiết kế mới
                </p>
                <div className="text-xs bg-green-400/30 px-3 py-1 rounded-full inline-block">
                  Modern UI • Full Features
                </div>
              </div>
            </a>
            
            <a 
              href="/interactive"
              className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="font-bold text-xl mb-2">Interactive Demo</h4>
                <p className="text-purple-100 text-sm mb-4">
                  Demo tương tác với comment system và annotation editing
                </p>
                <div className="text-xs bg-purple-400/30 px-3 py-1 rounded-full inline-block">
                  Interactive • Editable
                </div>
              </div>
            </a>
          </div>

          {/* Production URLs */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
              🏛️ Production URLs - Luật Đầu tư 2014
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="/law/65-2014-QH13/toc" 
                className="group bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-primary-200 dark:border-primary-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                      <i className="fas fa-list-ul mr-2"></i>
                      MOJ-style TOC
                    </h5>
                    <p className="text-xs text-primary-700 dark:text-primary-300">
                      Professional table of contents với comment statistics
                    </p>
                  </div>
                  <i className="fas fa-arrow-right text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
              
              <a 
                href="/law/65-2014-QH13/article/1" 
                className="group bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                      <i className="fas fa-file-alt mr-2"></i>
                      Article với Comments
                    </h5>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      3-column layout với comment sidebar
                    </p>
                  </div>
                  <i className="fas fa-arrow-right text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
              
              <a 
                href="/law/65-2014-QH13/search?q=đầu+tư+kinh+doanh" 
                className="group bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      <i className="fas fa-search mr-2"></i>
                      Search
                    </h5>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Tìm kiếm với highlighting và filters
                    </p>
                  </div>
                  <i className="fas fa-arrow-right text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
              
              <a 
                href="/law/65-2014-QH13/all" 
                className="group bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                      <i className="fas fa-file-text mr-2"></i>
                      Full Text
                    </h5>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Toàn văn với sticky navigation và anchors
                    </p>
                  </div>
                  <i className="fas fa-arrow-right text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform"></i>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            🎨 Professional UI/UX Features
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mobile-first với breakpoints tối ưu</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-moon text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Chuyển đổi theme với một click</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-print text-green-600 dark:text-green-400 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Print-Friendly</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Layout tối ưu cho in ấn legal documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}