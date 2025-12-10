import { Cfg, DefaultConfigType, ResourceSourceEnum, ResourceTypeEnum } from '@/core/config'
import { AvatarResourceDataItemType } from '@/core/mys'
import { dir } from '@/dir'
import { CoreCfg } from 'karin-plugin-mys-core/core'
import { ReactRender } from 'karin-plugin-mys-core/render'
import { existsSync, existToMkdirSync, logger, requireFileSync } from 'node-karin'
import axios from 'node-karin/axios'
import fs from 'node:fs'
import path from 'node:path'

export interface DownloadResOptionType {
  path: string
  version: () => string
}

const downloadResOption = (name: string): DownloadResOptionType => {
  const resPath = path.join(dir.ResourcesDir, name)
  return {
    path: resPath.replace(/\\/g, '/'),
    version: () => {
      const pkg = requireFileSync(path.join(resPath, 'package.json'))
      return pkg?.version || '0.0.0'
    }
  }
}

const Options = {
  'download-base-res': downloadResOption('base-res'),
  'download-panel-res': downloadResOption('panel-res'),
  genshin: {
    name: 'Genshin',
    version: dir.version,
    logoPath: `${dir.pluginDir.replace(/\\/g, '/')}/resources/image/genshin-logo.webp`,
  }
}

export const Render = new ReactRender<
  {
    'download-base-res': DownloadResOptionType
    'download-panel-res': DownloadResOptionType
    genshin: { name: string, version: string, logoPath: string }
  },
  string
>(dir, Options)

const downloadBaseResUrls = {
  [ResourceSourceEnum.GitHub]: 'https://raw.githubusercontent.com/Karin-Mys-Plugins/karin-plugin-mys-core/refs/heads/resources/enka',
  [ResourceSourceEnum.GitCode]: 'https://raw.gitcode.com/Karin-Mys-Plugins/karin-plugin-mys-core/raw/resources/enka',
}

export const UpdataBaseResFuc = async (start?: boolean): Promise<{ success: number, fail: number, downloaded: number, error: string[] }> => {
  const Config = Cfg.get<DefaultConfigType[ResourceTypeEnum.BaseRes]>(ResourceTypeEnum.BaseRes)
  if (!Config.source) {
    if (start) {
      logger.error(`『${dir.name}』未设置资源更新源！请设置后使用 #gs资源更新 下载图片资源。`)
    }
    return { success: 0, fail: 0, downloaded: 0, error: ['未设置资源更新源！'] }
  }

  const baseUrl = Config.source === ResourceSourceEnum.GitHubProxy
    ? `${CoreCfg.get<string>('githubProxyUrl').replace(/\/$/, '')}/${downloadBaseResUrls[ResourceSourceEnum.GitHub]}`
    : Config.source === ResourceSourceEnum.Custom
      ? Config.customUrl.replace(/\/$/, '')
      : downloadBaseResUrls[Config.source]

  const Count = { success: 0, fail: 0, downloaded: 0, error: [] as string[] }

  const checkImage = (imageName: string, saveDir: string) => {
    const image = `${path.parse(imageName).name}.webp`
    const savePath = path.join(dir.ResourcesDir, ResourceTypeEnum.BaseRes, saveDir, image)

    if (existsSync(savePath)) {
      Count.downloaded++
      return { image, savePath, downloaded: true }
    }

    existToMkdirSync(path.join(dir.ResourcesDir, ResourceTypeEnum.BaseRes, saveDir))

    return { image, savePath, downloaded: false }
  }

  const downloadImage = async (image: string, savePath: string, maxRetries = 3) => {
    const startTime = Date.now()

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // 下载图片
        const response = await axios.get<ArrayBuffer>(`${baseUrl}/${image}`, { responseType: 'arraybuffer' })
        const imageBuffer = Buffer.from(response.data)

        fs.writeFileSync(savePath, imageBuffer)

        Count.success++
        logger.debug(`下载图片完成(${Config.source}): ${image} Size:${(imageBuffer.length / 1024).toFixed(2)}KB (${Date.now() - startTime}ms)${attempt > 1 ? ` [重试${attempt - 1}次]` : ''}`)
        return true
      } catch (error) {
        if (attempt < maxRetries) {
          logger.error(`下载图片失败(${Config.source}): ${image} (尝试 ${attempt}/${maxRetries})，正在重试...`)

          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        } else {
          Count.fail++
          Count.error.push(`下载图片失败(${Config.source}): ${image}`)
          logger.error(`下载图片失败(${Config.source}): ${image} (已重试${maxRetries}次)`, error instanceof Error ? error.message : String(error))
          return false
        }
      }
    }

    return false
  }

  const avatars = requireFileSync<AvatarResourceDataItemType[]>(`${Render.plugin.resources.default}/panel/avatars.json`)

  const downloadTasks: Array<{ image: string, savePath: string, downloaded: boolean }> = []

  // 遍历所有角色
  for (const avatar of avatars) {
    // 遍历角色的所有元素类型
    for (const element of avatar.Elements) {
      // 下载命座图标
      const saveConstsDir = path.join('avatars', avatar.Id, 'elements', element.Element, 'consts')
      for (const constIcon of element.Consts) {
        if (constIcon === 'None') continue
        downloadTasks.push(checkImage(constIcon, saveConstsDir))
      }

      // 下载技能图标
      const saveSkillsDir = path.join('avatars', avatar.Id, 'elements', element.Element, 'skills')
      for (const skillIcon of Object.values(element.Skills)) {
        if (skillIcon === 'None') continue
        downloadTasks.push(checkImage(skillIcon, saveSkillsDir))
      }
    }

    // 下载服装图标
    for (const costume of Object.entries(avatar.Costumes)) {
      const savePath = path.join('avatars', avatar.Id, 'costumes', costume[0])

      costume[1].Icon !== 'None' && downloadTasks.push(checkImage(costume[1].Icon, savePath))
      // costume[1].SideIcon !== 'None' && downloadTasks.push(checkImage(costume[1].SideIcon, savePath ))
      costume[1].GachaIcon !== 'None' && downloadTasks.push(checkImage(costume[1].GachaIcon, savePath))
    }
  }

  const pfps = requireFileSync<Record<string, { IconPath: string }>>(`${Render.plugin.resources.default}/panel/pfps.json`)

  for (const pfp of Object.values(pfps)) {
    downloadTasks.push(checkImage(pfp.IconPath, 'pfps'))
  }

  const namecards = requireFileSync<Record<string, { Icon: string }>>(`${Render.plugin.resources.default}/panel/namecards.json`)
  for (const namecard of Object.values(namecards)) {
    downloadTasks.push(checkImage(namecard.Icon, 'namecards'))
  }

  if (Count.downloaded < downloadTasks.length) {
    logger.info(`『${dir.name}』开始更新基础资源 (${Count.downloaded}/${downloadTasks.length})...`)

    // 分批并行下载,每批10张
    const batchSize = 10
    const Tasks = downloadTasks.filter(task => !task.downloaded)
    for (let i = 0; i < Tasks.length; i += batchSize) {
      const batch = Tasks.slice(i, i + batchSize)
      await Promise.all(batch.map(task => downloadImage(task.image, task.savePath)))
    }

    logger.info(`『${dir.name}』基础资源更新完成！成功: ${Count.success}，失败: ${Count.fail}`)
  }

  return Count
}

setTimeout(async () => {
  await UpdataBaseResFuc(true)
}, 5000)
