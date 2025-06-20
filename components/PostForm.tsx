'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
  id?: number
  title: string
  content: string
  summary: string
  slug: string
  published: boolean
}

interface PostFormProps {
  post?: Post
  isEditing?: boolean
}

export default function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Post>({
    title: post?.title || '',
    content: post?.content || '',
    summary: post?.summary || '',
    slug: post?.slug || '',
    published: post?.published || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 自动生成 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
      .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const submitData = {
        ...formData,
        published: asDraft ? false : formData.published
      }

      const url = isEditing ? `/api/admin/posts/${post?.id}` : '/api/admin/posts'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '保存失败')
      }

      const result = await response.json()
      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '发生未知错误')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? '编辑文章' : '写新文章'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* 标题 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入文章标题"
                required
              />
            </div>

            {/* URL Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL 路径 *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="url-path"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                文章的 URL 路径，如：my-first-post
              </p>
            </div>

            {/* 摘要 */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                文章摘要
              </label>
              <textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="简要描述文章内容..."
              />
            </div>

            {/* 内容 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                文章内容 *
              </label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={20}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="在这里写文章内容，支持 Markdown 格式..."
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                支持 Markdown 语法。使用 ## 表示标题，**粗体**，*斜体*，```代码块```
              </p>
            </div>

            {/* 发布状态 */}
            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  立即发布（取消勾选保存为草稿）
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            取消
          </button>
          
          <div className="space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存草稿'}
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? '发布中...' : formData.published ? '更新并发布' : '发布文章'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}