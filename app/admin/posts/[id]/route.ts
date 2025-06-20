import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的文章 ID' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的文章 ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, content, summary, slug, published } = body

    // 验证必填字段
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: '标题、内容和 URL 路径不能为空' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查 slug 是否被其他文章使用
    if (slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'URL 路径已被其他文章使用' },
          { status: 400 }
        )
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        summary: summary || '',
        slug,
        published: published || false,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: '无效的文章 ID' },
        { status: 400 }
      )
    }

    // 检查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: { id },
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