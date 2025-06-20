import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function getAllPosts() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return posts
}

export default async function AdminPage() {
  const posts = await getAllPosts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          + 写新文章
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">所有文章</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">还没有文章，赶快写第一篇吧！</p>
            <Link
              href="/admin/posts/new"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              写文章
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {post.title}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? '已发布' : '草稿'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      <span>创建于 {new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                      {post.updatedAt !== post.createdAt && (
                        <span className="ml-2">
                          • 更新于 {new Date(post.updatedAt).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {post.published && (
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        target="_blank"
                      >
                        查看
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      编辑
                    </Link>
                    {/* <button
                      className="text-red-600 hover:text-red-800 text-sm"
                      onClick={() => {
                        if (confirm('确定要删除这篇文章吗？')) {
                          // 这里需要添加删除功能
                          window.location.href = `/admin/posts/${post.id}/delete`
                        }
                      }}
                    >
                      删除
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}