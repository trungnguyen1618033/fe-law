import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FontSizeProvider } from '@/components/FontSizeProvider';
import { FontSizeControls } from '@/components/FontSizeControls';

export const metadata: Metadata = {
  title: 'PH Lex Note - Legal Document Viewer',
  description: 'Professional legal document interface inspired by MOJ Taiwan with powerful Comment System for Vietnamese legal research.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="text-base">
        <ThemeProvider>
          <FontSizeProvider>
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      <i className="fas fa-balance-scale mr-2"></i>
                      PH Lex Note
                    </h1>
                  </div>
                  <div className="hidden md:ml-6 md:flex md:space-x-8">
                    <a href="/" className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium">
                      Trang chủ
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <FontSizeControls />
                </div>
              </div>
            </nav>
          </header>
          
          <main className="min-h-screen">
            {children}
          </main>

          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© 2024 PH Lex Note - Professional Legal Document Viewer</p>
                <p className="mt-1">Inspired by MOJ Taiwan with Vietnamese legal research focus</p>
              </div>
            </div>
          </footer>

          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}