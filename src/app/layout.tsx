import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: '智能论文助手 - 智能化渐进式表单系统',
  description: '让AI帮助您创建高质量的学术论文',
  keywords: ['论文写作', 'AI助手', '学术写作', '智能表单'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}