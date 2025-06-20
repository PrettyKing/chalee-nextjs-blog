import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import { Post } from "@/types/post";

async function getPost(id: string) {
  const post = (await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  })) as any;

  return post;
}

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return <PostForm post={post} isEditing={true} />;
}
