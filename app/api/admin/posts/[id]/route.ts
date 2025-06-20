import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/posts/[id] - 获取特定文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('📖 GET /api/admin/posts/[id] 被调用, ID:', params.id)
  
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      console.log('❌ 无效的文章 ID:', params.id)
      return NextResponse.json(
        { error: '无效的文章 ID' },
        { status: 400 }
      )
    }

    const post = await prisma.post.findUnique({
      where: { id },
    })

    if (!post) {
      console.log('❌ 文章不存在, ID:', id)
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    console.log('✅ 成功获取文章:', post.title)
    return NextResponse.json(post)
  } catch (error) {
    console.error('❌ 获取文章失败:', error)
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/posts/[id] - 更新特定文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('✏️ PUT /api/admin/posts/[id] 被调用, ID:', params.id)
  
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      console.log('❌ 无效的文章 ID:', params.id)
      return NextResponse.json(
        { error: '无效的文章 ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    console.log('📦 收到更新数据:', body)
    
    const { title, content, summary, slug, published } = body

    // 验证必填字段
    if (!title || !content || !slug) {
      console.log('❌ 缺少必填字段')
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
      console.log('❌ 要更新的文章不存在, ID:', id)
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
        console.log('❌ Slug 已被其他文章使用:', slug)
        return NextResponse.json(
          { error: 'URL 路径已被其他文章使用' },
          { status: 400 }
        )
      }
    }

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        summary: summary || '',
        slug,
        published: published || false,
        updatedAt: new Date(),
      },
    })

    console.log('✅ 文章更新成功:', updatedPost.title)
    return NextResponse.json(updatedPost)
    
  } catch (error) {
    console.error('❌ 更新文章失败:', error)
    return NextResponse.json(
      { 
        error: '更新文章失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/posts/[id] - 删除特定文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🗑️ DELETE /api/admin/posts/[id] 被调用, ID:', params.id)
  
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      console.log('❌ 无效的文章 ID:', params.id)
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
      console.log('❌ 要删除的文章不存在, ID:', id)
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 删除文章
    await prisma.post.delete({
      where: { id },
    })

    console.log('✅ 文章删除成功, 标题:', existingPost.title)
    return NextResponse.json({ 
      message: '文章删除成功',
      deletedPost: {
        id: existingPost.id,
        title: existingPost.title
      }
    })
    
  } catch (error) {
    console.error('❌ 删除文章失败:', error)
    return NextResponse.json(
      { 
        error: '删除文章失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
}