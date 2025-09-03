'use client';

import { useState, useEffect } from 'react';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  dataFiles?: {
    lawTree: boolean;
    articles: boolean;
    searchIndex: boolean;
  };
}

export default function TestPage() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  const runDataTest = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test');
      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to run test',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
    setLoading(false);
  };

  const saveTestComment = async () => {
    if (!commentText.trim()) return;
    
    setSaveStatus('Saving...');
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lawId: '61-2020-QH14',
          action: 'save_comment',
          data: {
            articleNo: 1,
            type: 'personal',
            text: commentText,
            lawId: '61-2020-QH14'
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setSaveStatus('✅ Comment saved successfully!');
        setCommentText('');
      } else {
        setSaveStatus('❌ Failed to save comment: ' + result.message);
      }
    } catch (error) {
      setSaveStatus('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  useEffect(() => {
    runDataTest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          🧪 PH Lex Note - Test Data Loading
        </h1>

        {/* Test Button */}
        <div className="mb-6">
          <button
            onClick={runDataTest}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : '🔄 Run Data Test'}
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Test Results
            </h2>
            
            <div className={`p-4 rounded-lg mb-4 ${testResult.success ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'}`}>
              <strong>{testResult.success ? '✅ SUCCESS' : '❌ FAILED'}</strong>
              <p>{testResult.message}</p>
              {testResult.error && <p className="text-sm mt-2">Error: {testResult.error}</p>}
            </div>

            {/* Data Files Status */}
            {testResult.dataFiles && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className={`p-3 rounded-lg text-center ${testResult.dataFiles.lawTree ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  <div className="text-lg">{testResult.dataFiles.lawTree ? '✅' : '❌'}</div>
                  <div className="text-sm">Law Tree JSON</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${testResult.dataFiles.articles ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  <div className="text-lg">{testResult.dataFiles.articles ? '✅' : '❌'}</div>
                  <div className="text-sm">Articles JSONL</div>
                </div>
                <div className={`p-3 rounded-lg text-center ${testResult.dataFiles.searchIndex ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                  <div className="text-lg">{testResult.dataFiles.searchIndex ? '✅' : '❌'}</div>
                  <div className="text-sm">Search Index JSON</div>
                </div>
              </div>
            )}

            {/* Loaded Data Preview */}
            {testResult.success && testResult.data && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">📊 Data Summary:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <li>Law Title: {testResult.data.lawTree?.law_title || 'N/A'}</li>
                    <li>Chapters: {testResult.data.lawTree?.chapters?.length || 0}</li>
                    <li>Articles: {testResult.data.articlesCount || 0}</li>
                    <li>Search Results: {testResult.data.searchResultsCount || 0}</li>
                  </ul>
                </div>

                {testResult.data.sampleArticle && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">📝 Sample Article:</h3>
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <strong>Điều {testResult.data.sampleArticle.article_no}:</strong> {testResult.data.sampleArticle.article_heading}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {testResult.data.sampleArticle.article_text.slice(0, 200)}...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Comment Save Test */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            💾 Test JSON File Saving
          </h2>
          
          <div className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Nhập test comment để lưu vào JSON file..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              rows={3}
            />
            
            <button
              onClick={saveTestComment}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              💾 Save Test Comment to JSON
            </button>
            
            {saveStatus && (
              <div className="text-sm mt-2">
                {saveStatus}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>📁 File sẽ được lưu tại: <code>data/61-2020-QH14_comments.json</code></p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            🔗 Test Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="/law/61-2020-QH14" 
              className="text-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              🏠 Main Law Page
            </a>
            <a 
              href="/law/61-2020-QH14/toc" 
              className="text-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📋 Table of Contents
            </a>
            <a 
              href="/law/61-2020-QH14/all" 
              className="text-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              📄 All Articles
            </a>
            <a 
              href="/law/61-2020-QH14/search?q=đầu+tư" 
              className="text-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              🔍 Search Test
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}