import { ElementEnum } from '@/core/panel'
import { DatabaseReturn, DatabaseType } from 'karin-plugin-mys-core/database'

export interface GenshinPanelInfoTableType {
  uid: string
  nickname: string

  level: number
  worldLevel: number

  pfpsId: string
  namecardId: string

  avatarInfo: Record<string, {
    /** @description 角色 ID */
    id: string
    elements: (GenshinPanelInfoAvatarElementInfoType<ElementEnum> & {
      /** @description 最后更新数据源 */
      source: string
      /** @description 最后更新时间 */
      update: number
    })[]
  }>
}

export interface GenshinPanelInfoAvatarElementInfoType<E extends ElementEnum> {
  /** @description 角色元素 */
  element: E
  /** @description 角色衣装 ID */
  costumeId: string
  /** @description 命之座 ID 列表 */
  talentIdList: string[]
  /** @description 天赋等级 Map */
  skillLevelMap: Record<string, number>
  weapon: {
    /** @description 武器 ID */
    id: string
    /** @description 武器等级 */
    level: number
    /** @description 武器突破等级 */
    promote: number
    /** @description 武器精炼等级 { itemId: 0-4 } */
    affix: number
  }
  reliquaries: {
    /** @description 圣遗物 ID */
    id: string
    /** @description 圣遗物等级 */
    level: number
    /** @description 圣遗物主属性 ID */
    mainPropId: string
    /** @description 圣遗物副属性 ID 列表 */
    appendPropIdList: string[]
  }[]
  /** @description 好感度等级 */
  fetter: number
}

export type GenshinPanelInfoType = DatabaseReturn<GenshinPanelInfoTableType>[DatabaseType.File]
