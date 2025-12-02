import { Render } from '@/core'
import { karin, logger, segment } from 'node-karin'

/**
 * 渲染demo
 * 触发指令: #测试渲染
 */
export const image = karin.command(/^#?测试渲染$/, async (e) => {
  try {
    /** 默认选择container进行截图 */
    const img = await Render.template('test', {}, {
      /** 为png时会禁用Body白色背景 */
      type: 'png',
      /** 自定义临时plugin参数 */
      plugin: {},
      /** 自定义截图参数 */
      render: {}
    })
    if (!img) return false

    await e.reply(segment.image(img))
    return true
  } catch (error) {
    logger.error(error)
    await e.reply(JSON.stringify(error))

    return true
  }
}, {
  /** 插件优先级 */
  priority: 9999,

  /** 插件触发是否打印触发日志 */
  log: true,

  /** 插件名称 */
  name: '测试渲染',

  /** 谁可以触发这个插件 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' */
  permission: 'all',

})
