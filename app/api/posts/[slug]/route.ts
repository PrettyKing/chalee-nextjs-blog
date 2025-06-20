import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单篇文章
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }  // 👈 这里接收 slug 参数
) {
  try {
    // params.slug 就是 URL 中 [slug] 的实际值
    console.log('请求的文章 slug:', params.slug)
    
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,  // 👈 使用 slug 查询文章
        published: true,
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { title, content, summary, published } = body

    const updatedPost = await prisma.post.update({
      where: {
        slug: params.slug,  // 👈 根据 slug 更新文章
      },
      data: {
        title,
        content,
        summary,
        published,
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.delete({
      where: {
        slug: params.slug,  // 👈 根据 slug 删除文章
      },
    })

    return NextResponse.json({ message: '文章删除成功' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    )
  }
}