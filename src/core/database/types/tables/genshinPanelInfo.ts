import { DatabaseReturn, DatabaseType } from 'karin-plugin-mys-core/database'

export interface GenshinPanelInfoTableType {
  uid: string
  nickname: string

  level: number
  worldLevel: number

  pfpsId: string
  namecardId: string
}

export type GenshinPanelInfoType = DatabaseReturn<GenshinPanelInfoTableType>[DatabaseType.File]
