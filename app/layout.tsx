import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '我的博客',
  description: '分享技术心得与生活感悟',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}