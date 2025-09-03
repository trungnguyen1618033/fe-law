import { NextRequest, NextResponse } from 'next/server';
import { LawService } from '@/lib/lawService';
import * as fs from 'fs';
import * as path from 'path';

export async function GET(request: NextRequest) {
  const lawService = new LawService();
  const lawId = '61-2020-QH14';

  try {
    // Test loading data
    console.log('Testing data loading for lawId:', lawId);
    
    const lawTree = await lawService.getLawTree(lawId);
    const allArticles = await lawService.getAllArticles(lawId);
    const searchResults = await lawService.searchArticles(lawId, 'đầu tư');

    return NextResponse.json({
      success: true,
      message: 'Data loading test successful',
      data: {
        lawTree: lawTree,
        articlesCount: allArticles.length,
        searchResultsCount: searchResults.length,
        sampleArticle: allArticles[0],
        sampleSearchResult: searchResults[0]
      }
    });
  } catch (error) {
    console.error('Data loading test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Data loading test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      dataFiles: {
        lawTree: fs.existsSync(path.join(process.cwd(), 'data', `${lawId}_law_tree.json`)),
        articles: fs.existsSync(path.join(process.cwd(), 'data', `${lawId}_law_articles.jsonl`)),
        searchIndex: fs.existsSync(path.join(process.cwd(), 'data', `${lawId}_search_index.json`))
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lawId, action, data } = await request.json();

    if (action === 'save_comment') {
      // Save comment to JSON file
      const commentsPath = path.join(process.cwd(), 'data', `${lawId}_comments.json`);
      let comments = [];
      
      if (fs.existsSync(commentsPath)) {
        const existingData = fs.readFileSync(commentsPath, 'utf8');
        comments = JSON.parse(existingData);
      }

      comments.push({
        id: Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });

      fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));

      return NextResponse.json({
        success: true,
        message: 'Comment saved successfully',
        commentId: comments[comments.length - 1].id
      });
    }

    if (action === 'get_comments') {
      const commentsPath = path.join(process.cwd(), 'data', `${lawId}_comments.json`);
      
      if (fs.existsSync(commentsPath)) {
        const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));
        return NextResponse.json({
          success: true,
          comments: comments.filter((c: any) => c.articleNo === data.articleNo)
        });
      }

      return NextResponse.json({
        success: true,
        comments: []
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'API error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}