// 导出工具函数

interface ExportOptions {
  title?: string;
  author?: string;
  date?: Date;
  format?: 'markdown' | 'html' | 'txt';
}

// 导出为Markdown文件
export const exportToMarkdown = (content: string, options: ExportOptions = {}) => {
  const { title = 'document', author, date } = options;
  
  let markdownContent = '';
  
  // 添加元数据
  if (author || date) {
    markdownContent += '---\n';
    if (title) markdownContent += `title: ${title}\n`;
    if (author) markdownContent += `author: ${author}\n`;
    if (date) markdownContent += `date: ${date.toISOString().split('T')[0]}\n`;
    markdownContent += '---\n\n';
  }
  
  markdownContent += content;
  
  downloadFile(markdownContent, `${title}.md`, 'text/markdown');
};

// 导出为HTML文件
export const exportToHTML = (content: string, options: ExportOptions = {}) => {
  const { title = 'document', author, date } = options;
  
  // 简单的Markdown到HTML转换
  const htmlContent = markdownToHTML(content);
  
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 2em;
            margin-bottom: 1em;
        }
        h1 { font-size: 2.5em; border-bottom: 2px solid #3498db; padding-bottom: 0.3em; }
        h2 { font-size: 2em; border-bottom: 1px solid #bdc3c7; padding-bottom: 0.3em; }
        h3 { font-size: 1.5em; }
        p { margin-bottom: 1em; }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 0;
            padding-left: 20px;
            font-style: italic;
            background: #f8f9fa;
            padding: 10px 20px;
        }
        code {
            background: #f1f2f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Monaco', 'Consolas', monospace;
        }
        pre {
            background: #2f3640;
            color: #f5f6fa;
            padding: 20px;
            border-radius: 5px;
            overflow-x: auto;
        }
        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        ul, ol {
            padding-left: 30px;
        }
        li {
            margin-bottom: 0.5em;
        }
        .meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 2em;
            padding-bottom: 1em;
            border-bottom: 1px solid #ecf0f1;
        }
        @media print {
            body { font-size: 12pt; }
            h1 { page-break-before: always; }
        }
    </style>
</head>
<body>
    ${author || date ? `<div class="meta">
        ${author ? `<p><strong>作者:</strong> ${author}</p>` : ''}
        ${date ? `<p><strong>日期:</strong> ${date.toLocaleDateString('zh-CN')}</p>` : ''}
    </div>` : ''}
    ${htmlContent}
</body>
</html>`;
  
  downloadFile(html, `${title}.html`, 'text/html');
};

// 导出为纯文本文件
export const exportToText = (content: string, options: ExportOptions = {}) => {
  const { title = 'document', author, date } = options;
  
  // 移除Markdown格式标记
  const textContent = markdownToText(content);
  
  let finalContent = '';
  if (author || date) {
    finalContent += `文档: ${title}\n`;
    if (author) finalContent += `作者: ${author}\n`;
    if (date) finalContent += `日期: ${date.toLocaleDateString('zh-CN')}\n`;
    finalContent += '\n' + '='.repeat(50) + '\n\n';
  }
  
  finalContent += textContent;
  
  downloadFile(finalContent, `${title}.txt`, 'text/plain');
};

// 简单的Markdown到HTML转换
const markdownToHTML = (markdown: string): string => {
  let html = markdown;
  
  // 标题
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 粗体和斜体
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 代码
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  
  // 引用
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // 列表
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // 包装列表项
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  
  // 段落
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // 清理空段落
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  
  return html;
};

// Markdown到纯文本转换
const markdownToText = (markdown: string): string => {
  let text = markdown;
  
  // 移除标题标记
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // 移除粗体和斜体标记
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '$1');
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // 移除代码标记
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```/g, '').trim();
  });
  text = text.replace(/`(.*?)`/g, '$1');
  
  // 移除链接标记，保留文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // 移除图片标记
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '[图片: $1]');
  
  // 移除引用标记
  text = text.replace(/^> /gm, '');
  
  // 移除列表标记
  text = text.replace(/^\* /gm, '• ');
  text = text.replace(/^\d+\. /gm, '');
  
  return text;
};

// 下载文件
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 复制到剪贴板
export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // 降级方案
    try {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError);
      return false;
    }
  }
};

// 分享文档（如果支持Web Share API）
export const shareDocument = async (title: string, content: string, url?: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        url: url || window.location.href
      });
      return true;
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  } else {
    // 降级到复制链接
    return await copyToClipboard(url || window.location.href);
  }
};

// 打印文档
export const printDocument = (content: string, title: string = 'document') => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = markdownToHTML(content);
  const html = `<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            margin: 2cm;
            color: #000;
        }
        h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        p, li {
            page-break-inside: avoid;
        }
        blockquote {
            border-left: 3px solid #ccc;
            margin: 0;
            padding-left: 15px;
        }
        code {
            background: #f5f5f5;
            padding: 2px 4px;
            border-radius: 3px;
        }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow: hidden;
        }
        @page {
            margin: 2cm;
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`;
  
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // 等待内容加载后打印
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// 导出选项类型
export interface ExportMenuOption {
  id: string;
  label: string;
  icon: string;
  action: (content: string, options: ExportOptions) => void;
  description: string;
}

// 预定义的导出选项
export const exportOptions: ExportMenuOption[] = [
  {
    id: 'markdown',
    label: 'Markdown',
    icon: '📝',
    action: exportToMarkdown,
    description: '导出为Markdown格式文件'
  },
  {
    id: 'html',
    label: 'HTML',
    icon: '🌐',
    action: exportToHTML,
    description: '导出为HTML网页文件'
  },
  {
    id: 'text',
    label: '纯文本',
    icon: '📄',
    action: exportToText,
    description: '导出为纯文本文件'
  }
];