import { GenshinPanelInfoDB, GenshinPanelInfoTableType, GenshinPanelInfoType } from '@/core/database'
import { GenshinRegionType, matchRegion } from '@/core/mys'
import { common } from '@/utils'
import { logger } from 'node-karin'

export class GenshinPanel {
  uid: GenshinPanelInfoTableType['uid']
  region: GenshinRegionType

  /** 冒险等级 */
  declare level: GenshinPanelInfoType['level']
  /** 世界等级 */
  declare worldLevel: GenshinPanelInfoType['worldLevel']

  /** 昵称 */
  declare nickname: GenshinPanelInfoType['nickname']

  /** 游戏头像 */
  declare pfpsId: GenshinPanelInfoType['pfpsId']
  /** 名片 */
  declare namecardId: GenshinPanelInfoType['namecardId']

  /** 删除面板数据 */
  declare destroy: GenshinPanelInfoType['destroy']

  #PanelInfo: GenshinPanelInfoType

  constructor (uid: string, panelInfo: GenshinPanelInfoType) {
    this.uid = uid
    this.region = matchRegion(uid)

    this.#PanelInfo = panelInfo
  }

  static async create (uid: string): Promise<GenshinPanel> {
    const panelInfo = await (await GenshinPanelInfoDB()).findByPk(uid, true)

    const panel = new GenshinPanel(uid, panelInfo)

    return panel.init()
  }

  init () {
    const _this = this
    return new Proxy(this, {
      get (self, key, receiver) {
        if (key !== 'save' && key in _this.#PanelInfo) {
          return common.DataProxy(_this.#PanelInfo[key as keyof GenshinPanelInfoType])
        }

        const _key = key as keyof GenshinPanel
        // 如果是方法调用，绑定到原始实例
        if (typeof self[_key] === 'function') {
          return self[_key].bind(_this)
        }

        return Reflect.get(self, key, receiver)
      },
      set (target, key, newValue) {
        if (key in _this.#PanelInfo) {
          (_this.#PanelInfo as any)[key] = newValue
          return true
        }

        return Reflect.set(target, key, newValue)
      }
    })
  }

  async save (init: boolean) {
    const saveData = JSON.parse(JSON.stringify(this.#PanelInfo))

    logger.info(JSON.stringify(saveData))

    this.#PanelInfo = await this.#PanelInfo.save(saveData)

    init && this.init()
  }
}
