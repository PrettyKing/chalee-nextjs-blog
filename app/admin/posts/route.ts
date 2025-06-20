import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/posts - 获取所有文章（包括草稿）
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        summary: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching admin posts:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/admin/posts - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, summary, slug, published } = body

    console.log('收到创建文章请求:', { title, slug, published })

    // 验证必填字段
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: '标题、内容和 URL 路径不能为空' },
        { status: 400 }
      )
    }

    // 检查 slug 是否已存在
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'URL 路径已存在，请使用其他路径' },
        { status: 400 }
      )
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary: summary || '',
        slug,
        published: published || false,
      },
    })

    console.log('文章创建成功:', post.id)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: '创建文章失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    )
  }
}