import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Post } from "@/types/post";

async function getPosts() {
  const posts = (await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      summary: true,
      slug: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as Post[];
  return posts;
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">我的博客</h1>
          <p className="text-xl text-gray-600">分享技术心得与生活感悟</p>
        </header>

        <main>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">暂无文章</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <Link href={`/posts/${post.slug}`}>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  {post.summary && (
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>

                    <Link
                      href={`/posts/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      阅读全文 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
