"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DeletePostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${params.id}`);
      if (response.ok) {
        const postData = await response.json();
        setPost(postData);
      } else {
        setError("文章不存在");
      }
    } catch (err) {
      setError("获取文章信息失败");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "删除失败");
      }
    } catch (err) {
      setError("删除失败");
    } finally {
      setIsDeleting(false);
    }
  };

  if (error && !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">错误</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            href="/admin"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            返回管理页面
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            确认删除文章
          </h1>

          <p className="text-gray-600 mb-2">
            你确定要删除以下文章吗？此操作不可撤销。
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-900">{post.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              创建于 {new Date(post.createdAt).toLocaleDateString("zh-CN")}
            </p>
          </div>

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="flex justify-center space-x-4">
            <Link
              href="/admin"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              取消
            </Link>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "删除中..." : "确认删除"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
