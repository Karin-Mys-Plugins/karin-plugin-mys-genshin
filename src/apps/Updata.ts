import { Cfg, DefaultConfigType, ResourceSourceEnum, ResourceTypeEnum } from '@/core/config'
import { GenshinGame } from '@/core/mys'
import { UpdataBaseResFuc } from '@/template'
import karin, { logger, segment } from 'node-karin'
import axios from 'node-karin/axios'

export const UpdataBaseRes = karin.command(
  new RegExp(`^#?(${GenshinGame.prefixs.join('|')})(图片)?资源更新$`, 'i'),
  async (e) => {
    const resType = ResourceTypeEnum.BaseRes
    const source = Cfg.get<DefaultConfigType[typeof resType]['source']>(`${resType}.source`)

    if (source === ResourceSourceEnum.UnSet) {
      e.reply('请选择更新源序号并发送：\n1. GitHub \n2. GitHub Proxy \n3. GitCode \n4. 自定义链接')

      const ctx = await karin.ctx(e, { time: 60 })
      if (!ctx) return true

      switch (parseInt(ctx.msg.trim())) {
        case 1:
          Cfg.set(`${resType}.source`, ResourceSourceEnum.GitHub, true)
          break
        case 2:
          Cfg.set(`${resType}.source`, ResourceSourceEnum.GitHubProxy, true)
          break
        case 3:
          Cfg.set(`${resType}.source`, ResourceSourceEnum.GitCode, true)
          break
        case 4: {
          e.reply('请发送自定义资源链接。')

          const ctx1 = await karin.ctx(e, { time: 60 })
          if (!ctx1) return true

          try {
            const url = new URL(ctx1.msg.trim())
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              e.reply('链接格式错误，操作已取消。')
              return true
            }

            const image = await axios.get<ArrayBuffer>(`${url.href}/UI_Talent_S_Ayaka_01.webp`, { responseType: 'arraybuffer' })

            if (image.status !== 200) {
              e.reply('无法使用此链接获取图片，操作已取消。')
              return true
            }
          } catch (error) {
            logger.error(error instanceof Error ? error.message : String(error))
            e.reply('设置链接失败，操作已取消。')

            return true
          }

          Cfg.set(`${resType}.customUrl`, ctx1.msg.trim(), false)
          Cfg.set(`${resType}.source`, ResourceSourceEnum.Custom, true)

          break
        }
        default:
          ctx.reply('输入有误，操作已取消。')

          return true
      }
    }

    e.reply(`正在更新『${GenshinGame.name}』 基础资源 (Source: ${Cfg.get<ResourceSourceEnum>(`${resType}.source`)})，请稍候……`)

    const result = await UpdataBaseResFuc()
    if (result.error.length > 0) {
      e.bot.sendForwardMsg(e.contact, [
        segment.node(e.selfId, e.bot.selfName, [
          segment.text(`『${GenshinGame.name}』资源更新完成！`),
          segment.text(`成功:${result.success}，失败:${result.fail}，已下载:${result.downloaded}`),
          ...result.error.map(item => segment.text(item))
        ])
      ])
    } else {
      e.reply(`『${GenshinGame.name}』资源更新完成！\n成功: ${result.success}，失败: ${result.fail}，已下载: ${result.downloaded}。`)
    }

    return true
  },
  { perm: 'master' }
)
