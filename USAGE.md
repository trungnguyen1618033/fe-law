# 📋 PH Lex Note - Hướng Dẫn Sử Dụng Toàn Diện

## 🎯 Tổng Quan Hệ Thống

**PH Lex Note** là hệ thống xem văn bản pháp luật Việt Nam với 6 chế độ xem chính:

1. **📖 Trang Chủ Luật** (`/law/[lawId]`) - Tổng quan văn bản
2. **📋 Mục Lục** (`/law/[lawId]/toc`) - Cấu trúc chương/điều có thể mở rộng
3. **📄 Chi Tiết Điều** (`/law/[lawId]/article/[articleNo]`) - Xem từng điều với chú thích
4. **📚 Tất Cả Điều** (`/law/[lawId]/all`) - Danh sách đầy đủ các điều
5. **🔍 Tìm Kiếm** (`/law/[lawId]/search`) - Tìm kiếm toàn văn nâng cao
6. **🧪 Test Data** (`/test`) - Kiểm tra tải dữ liệu và lưu JSON

## 🚀 Khởi Động Hệ Thống

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Truy cập: http://localhost:3001
```

## 📊 Cấu Trúc Dữ Liệu

Hệ thống sử dụng 3 file dữ liệu chính cho mỗi văn bản:

```
data/
├── 61-2020-QH14_law_tree.json      # Cấu trúc chương/điều
├── 61-2020-QH14_law_articles.jsonl # Chi tiết từng điều
├── 61-2020-QH14_search_index.json  # Index tìm kiếm
└── 61-2020-QH14_comments.json      # Ghi chú người dùng
```

## 🎨 Tính Năng Chính

### 1. **📋 Trang Mục Lục (`/toc`)**
- ✅ Hiển thị cấu trúc hierarchical của văn bản
- ✅ Mở rộng/thu gọn từng chương
- ✅ Tìm kiếm theo tên điều trong mục lục
- ✅ Thống kê số chương và điều
- ✅ Grid layout responsive cho các điều

### 2. **📄 Trang Chi Tiết Điều (`/article/[no]`)**
- ✅ Layout 4 cột: **Navigation | Content | Comments**
- ✅ **Sidebar điều hướng chương**: 
  - Cấu trúc hierarchical với trạng thái điều (✅ đã đọc, ➡️ hiện tại, ⚪ chưa đọc)
  - Auto-expand chương hiện tại
  - Progress bar theo tiến độ đọc
- ✅ **Nội dung điều**:
  - Điều chỉnh cỡ chữ (12-24px)
  - Chức năng in
  - Hiển thị chú thích và tham chiếu
  - Navigation prev/next điều
- ✅ **Hệ thống ghi chú**:
  - 4 loại ghi chú: Cá nhân, Công việc, Nghiên cứu, Quan trọng
  - Lưu vào localStorage
  - Xóa/chỉnh sửa ghi chú

### 3. **📚 Trang Tất Cả Điều (`/all`)**
- ✅ Danh sách compact tất cả điều
- ✅ Tìm kiếm realtime trong danh sách
- ✅ Theo dõi tiến độ đọc
- ✅ Filter theo chương
- ✅ Pagination thông minh

### 4. **🔍 Trang Tìm Kiếm (`/search`)**
- ✅ Tìm kiếm toàn văn với điểm relevance
- ✅ Highlight từ khóa trong kết quả
- ✅ Preview đoạn văn chứa từ khóa
- ✅ Filter theo chương
- ✅ Lưu lịch sử tìm kiếm
- ✅ Gợi ý từ khóa phổ biến

### 5. **🧪 Trang Test (`/test`)**
- ✅ Kiểm tra tải dữ liệu từ JSON/JSONL
- ✅ Test lưu ghi chú vào JSON file
- ✅ Hiển thị trạng thái các file dữ liệu
- ✅ Preview dữ liệu mẫu
- ✅ Links nhanh đến các trang test

## 🎨 Giao Diện & UX

### **Theme System**
```css
/* Custom Tailwind colors */
primary-50 → primary-900    # Xanh chủ đạo
gray-50 → gray-900         # Xám cơ bản
```

### **Dark Mode**
- ✅ Hỗ trợ đầy đủ dark/light theme
- ✅ Toggle tự động theo hệ thống
- ✅ Contrast tối ưu cho việc đọc

### **Typography Vietnameseization**
- ✅ Font system tối ưu cho tiếng Việt
- ✅ Line-height phù hợp với văn bản pháp luật
- ✅ Responsive typography scales

## 💾 Hệ Thống Dữ Liệu

### **Server-side Data Loading**
```typescript
// Example usage in page components
const lawService = new LawService();
const [lawTree, articles] = await Promise.all([
  lawService.getLawTree(lawId),
  lawService.getAllArticles(lawId)
]);
```

### **Client-side Features**
```typescript
// Comment system
const lawService = new LawServiceClient();
const comments = lawService.getComments(lawId, articleNo);
lawService.saveComment(comment);
```

### **API Endpoints**
```
GET  /api/test           # Test data loading
POST /api/test           # Save test comments
```

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** (`< 768px`): Stack layout, collapsible sidebars
- **Tablet** (`768px - 1024px`): 2-column layout
- **Desktop** (`> 1024px`): Full 4-column layout

### **Navigation Patterns**
- ✅ Sticky headers và sidebars
- ✅ Breadcrumb navigation
- ✅ Quick jump between articles
- ✅ Chapter-aware navigation

## 🔧 Cấu Hình Kỹ Thuật

### **Tailwind CSS Setup**
```javascript
// tailwind.config.js
content: [
  './src/pages/**/*.{js,ts,jsx,tsx}',
  './src/components/**/*.{js,ts,jsx,tsx}',
  './src/app/**/*.{js,ts,jsx,tsx}'
],
theme: {
  extend: {
    colors: {
      primary: { /* custom blue scale */ }
    }
  }
}
```

### **TypeScript Interfaces**
```typescript
interface Article {
  article_no: number;
  article_heading: string;
  article_text: string;
  annotations?: Annotation[];
}

interface LawTree {
  law_title: string;
  chapters: Chapter[];
}
```

## 🐛 Debugging & Testing

### **Test Data URL**
- Visit `/test` để kiểm tra data loading
- Test comment system với JSON file persistence
- Xem trạng thái các file dữ liệu

### **Common Issues & Fixes**

1. **URL Parameter Encoding**: 
   - Issue: `%5BlawId%5D` thay vì `61-2020-QH14`
   - Fix: Sử dụng `decodeURIComponent(params.lawId)`

2. **Port Conflicts**:
   ```bash
   lsof -ti:3001 | xargs kill -9
   npm run dev
   ```

3. **Missing Data Files**:
   - Kiểm tra `/test` page để verify file existence
   - Đảm bảo có đủ 3 file: `*_law_tree.json`, `*_law_articles.jsonl`, `*_search_index.json`

## 📝 Implementation Details

### **Key Components Created**

#### **Pages**
- `/app/law/[lawId]/toc/page.tsx` - Table of contents with server-side rendering
- `/app/law/[lawId]/article/[articleNo]/page.tsx` - Article detail with metadata
- `/app/law/[lawId]/all/page.tsx` - Complete article listing
- `/app/law/[lawId]/search/page.tsx` - Advanced search functionality
- `/app/test/page.tsx` - Data loading and testing interface

#### **Components**
- `TocComponent.tsx` - Interactive table of contents with search
- `ArticleComponent.tsx` - Article viewer with comments and navigation
- `ChapterNavigationComponent.tsx` - Hierarchical chapter navigation
- `AllArticlesComponent.tsx` - Full article listing with search
- `SearchComponent.tsx` - Advanced search with relevance scoring

#### **Services**
- `LawService.ts` - Server-side data loading (Node.js)
- `LawServiceClient.ts` - Client-side utilities (browser)

#### **API Routes**
- `/app/api/test/route.ts` - Testing data operations and comment persistence

### **Data Flow**
1. **Server-side**: Load JSON/JSONL data files using Node.js `fs`
2. **Client-side**: Use localStorage for comments and user preferences
3. **API**: Handle comment persistence to JSON files
4. **Navigation**: Dynamic routing with URL parameter decoding

## 📋 Testing Checklist

### **Essential Tests**
- [ ] `/test` - Verify all data files load correctly
- [ ] `/law/61-2020-QH14/toc` - Table of contents with expandable chapters
- [ ] `/law/61-2020-QH14/article/1` - Article detail with chapter navigation
- [ ] `/law/61-2020-QH14/all` - Complete article listing
- [ ] `/law/61-2020-QH14/search?q=đầu+tư` - Search functionality

### **Feature Tests**
- [ ] Chapter navigation auto-expansion
- [ ] Article progress tracking (✅ ➡️ ⚪)
- [ ] Comment system (add/delete/persist)
- [ ] Font size adjustment
- [ ] Dark/light mode toggle
- [ ] Search with highlighting
- [ ] Prev/next article navigation

## 🚀 Next Steps & Enhancements

1. **🔐 User Authentication** - Đăng nhập để đồng bộ ghi chú
2. **📊 Analytics** - Theo dõi usage patterns
3. **🔄 Real-time Sync** - Đồng bộ ghi chú real-time
4. **📱 PWA Support** - Offline reading capability
5. **🎯 Bookmarking System** - Đánh dấu điều quan trọng
6. **📈 Reading Progress** - Theo dõi tiến độ đọc chi tiết

## 📞 Support & Maintenance

### **File Structure**
```
src/
├── app/
│   ├── law/[lawId]/
│   │   ├── toc/page.tsx
│   │   ├── article/[articleNo]/page.tsx
│   │   ├── all/page.tsx
│   │   └── search/page.tsx
│   ├── test/page.tsx
│   └── api/test/route.ts
├── components/
│   ├── TocComponent.tsx
│   ├── ArticleComponent.tsx
│   ├── ChapterNavigationComponent.tsx
│   ├── AllArticlesComponent.tsx
│   └── SearchComponent.tsx
├── lib/
│   ├── lawService.ts
│   └── lawService.client.ts
└── types/law.ts
```

### **Configuration Files**
- `tailwind.config.js` - Tailwind CSS với custom colors
- `postcss.config.js` - PostCSS processing
- `CLAUDE.md` - Project instructions và specifications

---

**Phát triển bởi**: PH Lex Note Team  
**Phiên bản**: 1.0.0  
**Cập nhật cuối**: 2025-08-27