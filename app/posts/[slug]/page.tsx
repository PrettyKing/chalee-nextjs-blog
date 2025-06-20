import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Post } from "@/types/post";

async function getPost(slug: string) {
  const post = (await prisma.post.findUnique({
    where: {
      slug: slug,
      published: true,
    },
  })) as Post;

  return post;
}

export async function generateStaticParams() {
  const posts = (await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
    },
  })) as Post[];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: post.title,
    description: post.summary || post.content.substring(0, 160),
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← 返回首页
          </Link>
        </nav>

        <article className="bg-white rounded-lg shadow-md p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center text-gray-500 text-sm">
              <time>
                发布于{" "}
                {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.updatedAt !== post.createdAt && (
                <span className="mx-2">•</span>
              )}
              {post.updatedAt !== post.createdAt && (
                <time>
                  更新于{" "}
                  {new Date(post.updatedAt).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-800 leading-relaxed"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {post.content}
            </div>
          </div>
        </article>

        <nav className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回文章列表
          </Link>
        </nav>
      </div>
    </div>
  );
}
