import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET 方法 - 获取所有文章
export async function GET() {
  console.log('📝 GET /api/admin/posts 被调用')
  
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log('✅ 成功获取文章列表，数量:', posts.length)
    return NextResponse.json(posts)
  } catch (error) {
    console.error('❌ 获取文章列表失败:', error)
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// POST 方法 - 创建新文章
export async function POST(request: NextRequest) {
  console.log('📝 POST /api/admin/posts 被调用')
  
  try {
    // 解析请求体
    const body = await request.json()
    console.log('📦 收到的数据:', body)
    
    const { title, content, summary, slug, published } = body

    // 验证必填字段
    if (!title || !content || !slug) {
      console.log('❌ 缺少必填字段')
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
      console.log('❌ Slug 已存在:', slug)
      return NextResponse.json(
        { error: 'URL 路径已存在，请使用其他路径' },
        { status: 400 }
      )
    }

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        content,
        summary: summary || '',
        slug,
        published: published || false,
      },
    })

    console.log('✅ 文章创建成功，ID:', post.id)
    return NextResponse.json(post, { status: 201 })
    
  } catch (error) {
    console.error('❌ 创建文章失败:', error)
    return NextResponse.json(
      { 
        error: '创建文章失败', 
        details: error instanceof Error ? error.message : '未知错误' 
      },
      { status: 500 }
    )
  }
}