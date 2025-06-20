import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始添加种子数据...')

  // 创建示例文章
  const posts = [
    {
      title: 'Next.js 14 新特性介绍',
      content: `Next.js 14 带来了许多令人兴奋的新特性和改进。

## 主要特性

### 1. App Router (稳定版)
App Router 现在已经稳定，提供了更好的性能和开发体验。

### 2. 服务器组件
React 服务器组件允许我们在服务器端渲染组件，减少客户端 JavaScript 包的大小。

### 3. 流式渲染
支持流式渲染，可以更快地显示页面内容。

### 4. 增强的图像优化
改进的图像优化功能，自动生成适合不同设备的图片格式。

## 总结

Next.js 14 为现代 web 开发提供了强大的工具和优秀的性能。`,
      summary: 'Next.js 14 版本的主要新特性和改进，包括稳定的 App Router、服务器组件、流式渲染等。',
      slug: 'nextjs-14-features',
      published: true,
    },
    {
      title: 'Prisma ORM 快速入门指南',
      content: `Prisma 是一个现代化的数据库工具包，让数据库访问变得简单和安全。

## 什么是 Prisma？

Prisma 是一个开源的数据库工具包，包含：
- Prisma Client：自动生成的类型安全数据库客户端
- Prisma Migrate：声明式数据库迁移工具
- Prisma Studio：数据库的可视化编辑器

## 主要优势

### 1. 类型安全
Prisma 为你的数据库生成完全类型安全的客户端代码。

### 2. 自动完成
IDE 中的智能提示和自动完成功能。

### 3. 简单的 API
直观的 API 设计，让数据库操作变得简单。

### 4. 数据库无关
支持 PostgreSQL、MySQL、SQLite、SQL Server 等多种数据库。

## 开始使用

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

创建你的第一个模型，运行迁移，然后开始查询数据！`,
      summary: 'Prisma ORM 的入门指南，介绍其主要特性、优势和基本使用方法。',
      slug: 'prisma-orm-guide',
      published: true,
    },
    {
      title: 'AWS Aurora 数据库性能优化',
      content: `Amazon Aurora 是 AWS 提供的云原生关系数据库，具有高性能、高可用性和易扩展性。

## Aurora 的优势

### 1. 高性能
- 比标准 MySQL 快 5 倍
- 比标准 PostgreSQL 快 3 倍
- 自动扩展存储，最高可达 128TB

### 2. 高可用性
- 6 个数据副本分布在 3 个可用区
- 自动故障检测和恢复
- 读取副本的自动故障转移

### 3. 安全性
- 静态和传输中的加密
- 网络隔离
- 审计日志记录

## 性能优化技巧

### 1. 连接池
使用连接池来管理数据库连接，避免频繁建立和断开连接。

### 2. 读写分离
利用 Aurora 的读取副本来分担读取负载。

### 3. 缓存策略
实施适当的缓存策略，减少数据库查询次数。

### 4. 索引优化
创建合适的索引来加速查询性能。

## 监控和调优

使用 CloudWatch 监控数据库性能指标，并根据需要调整配置。`,
      summary: 'AWS Aurora 数据库的特性介绍和性能优化技巧，包括高可用性、安全性和调优策略。',
      slug: 'aws-aurora-optimization',
      published: true,
    },
  ]

  for (const post of posts) {
    const result = await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
    console.log(`创建文章: ${result.title}`)
  }

  console.log('种子数据添加完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })