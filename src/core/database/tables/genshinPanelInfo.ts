import { dir } from '@/dir'
import { Database, DatabaseType, createTable } from 'karin-plugin-mys-core/database'
import { GenshinPanelInfoTableType } from '../types/tables/genshinPanelInfo'

export const GenshinPanelInfoTable = createTable<GenshinPanelInfoTableType>(
  dir.DataDir, 'genshin_panel_data', DatabaseType.File, 'uid'
)

export const GenshinPanelInfoDB = await GenshinPanelInfoTable.init(
  [
    Database.PkColumn('uid', 'STRING'),
    Database.Column('nickname', 'STRING', '旅行者'),
    Database.Column('level', 'INTEGER', 1),
    Database.Column('worldLevel', 'INTEGER', 0),
    Database.Column('pfpsId', 'STRING', ''),
    Database.Column('namecardId', 'STRING', '')
  ]
)
