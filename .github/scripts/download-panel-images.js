#!/usr/bin/env node

import axios from 'axios'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 米哈游 CDN 基础 URL
const CDN_BASE_URL = 'https://enka.network/ui'

// JSON 文件所在目录
const PANEL_DIR = path.join(__dirname, '../../resources/panel')
// 图片输出目录
const OUTPUT_DIR = path.join(__dirname, '../../enka')

// 重试配置
const MAX_RETRIES = 3 // 最大重试次数
const RETRY_DELAY = 1000 // 重试延迟（毫秒）
const TIMEOUT = 30000 // 请求超时时间（30秒）

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// 延迟函数
function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 下载文件并转换为 webp 格式（核心函数，不含重试逻辑）
async function downloadFileOnce (url, outputPath) {
  // 将输出路径改为 .webp 扩展名
  const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')

  const dir = path.dirname(webpPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 使用 axios 下载图片
  const response = await axios.get(url, { responseType: 'arraybuffer', timeout: TIMEOUT })

  // 将响应数据转换为 Buffer
  const buffer = Buffer.from(response.data)

  // 使用 sharp 转换为 webp 格式
  await sharp(buffer)
    .webp({ quality: 90, effort: 6 }) // 高质量 webp
    .toFile(webpPath)

  return webpPath
}

// 带重试机制的下载函数
async function downloadFile (url, outputPath, retries = MAX_RETRIES) {
  // 将输出路径改为 .webp 扩展名
  const webpPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')

  // 如果 webp 文件已存在，跳过下载
  if (fs.existsSync(webpPath)) {
    console.log(`✓ 跳过已存在的文件: ${path.basename(webpPath)}`)
    return
  }

  console.log(`⬇ 下载: ${url}`)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await downloadFileOnce(url, outputPath)
      console.log(`✓ 已转换为 webp: ${path.basename(result)}`)
      return // 成功，退出
    } catch (err) {
      const isLastAttempt = attempt === retries

      if (isLastAttempt) {
        console.error(`✗ 下载失败 (${attempt}/${retries}): ${err.message} - ${url}`)
        return // 最后一次尝试失败，放弃但不抛出错误
      } else {
        console.warn(`⚠ 重试 ${attempt}/${retries}: ${err.message}`)
        await delay(RETRY_DELAY * attempt) // 指数退避
      }
    }
  }
}

// 提取 JSON 中的所有图片文件名
function extractImagePaths (obj, paths = new Set()) {
  if (typeof obj === 'string') {
    // 匹配 .png, .jpg, .jpeg, .webp 等图片文件
    if (/\.(png|jpg|jpeg|webp)$/i.test(obj)) {
      paths.add(obj)
    }
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractImagePaths(item, paths))
  } else if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(value => extractImagePaths(value, paths))
  }
  return paths
}

// 处理单个 JSON 文件
async function processJsonFile (filePath) {
  console.log(`\n📄 处理文件: ${path.basename(filePath)}`)

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    // 提取所有图片路径
    const imagePaths = extractImagePaths(data)

    console.log(`  找到 ${imagePaths.size} 个图片文件`)

    // 下载所有图片
    const downloadPromises = []
    for (const imagePath of imagePaths) {
      // 移除路径中的目录部分，只保留文件名
      const filename = path.basename(imagePath)
      const url = `${CDN_BASE_URL}/${imagePath}`
      const outputPath = path.join(OUTPUT_DIR, filename)

      downloadPromises.push(downloadFile(url, outputPath))

      // 批量下载，每次最多 10 个并发
      if (downloadPromises.length >= 10) {
        await Promise.all(downloadPromises)
        downloadPromises.length = 0
      }
    }

    // 下载剩余的图片
    if (downloadPromises.length > 0) {
      await Promise.all(downloadPromises)
    }

  } catch (error) {
    console.error(`✗ 处理文件失败: ${error.message}`)
  }
}

// 主函数
async function main () {
  console.log('🚀 开始同步面板图片...\n')
  console.log(`📁 JSON 目录: ${PANEL_DIR}`)
  console.log(`📁 输出目录: ${OUTPUT_DIR}\n`)

  // 读取所有 JSON 文件
  const files = fs.readdirSync(PANEL_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(PANEL_DIR, file))

  if (files.length === 0) {
    console.log('⚠ 未找到 JSON 文件')
    return
  }

  console.log(`找到 ${files.length} 个 JSON 文件\n`)

  // 按顺序处理每个文件
  for (const file of files) {
    await processJsonFile(file)
  }

  console.log('\n✅ 同步完成！')
}

// 运行主函数
main().catch(console.error)
