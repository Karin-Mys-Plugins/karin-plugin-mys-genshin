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
    /** 角色 ID */
    id: string
    elements: (GenshinPanelInfoAvatarElementInfoType<ElementEnum> & {
      /** 最后更新数据源 */
      source: string
      /** 最后更新时间 */
      update: number
    })[]
  }>
}

export interface GenshinPanelInfoAvatarElementInfoType<E extends ElementEnum> {
  /** 角色元素 */
  element: E
  /** 角色衣装 ID */
  costumeId: string
  /** 命之座 ID 列表 */
  talentIdList: string[]
  /** 天赋等级 Map */
  skillLevelMap: Record<string, number>
  weapon: {
    /** 武器 ID */
    id: string
    /** 武器等级 */
    level: number
    /** 武器突破等级 */
    promote: number
    /** 武器精炼等级 { itemId: 0-4 } */
    affix: number
  }
  reliquaries: {
    /** 圣遗物 ID */
    id: string
    /** 圣遗物等级 */
    level: number
    /** 圣遗物主属性 ID */
    mainPropId: string
    /** 圣遗物副属性 ID 列表 */
    appendPropIdList: string[]
  }[]
  /** 好感度等级 */
  fetter: number
}

export type GenshinPanelInfoType = DatabaseReturn<GenshinPanelInfoTableType>[DatabaseType.File]
