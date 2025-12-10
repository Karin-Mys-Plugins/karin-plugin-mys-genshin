import { dir } from '@/dir'
import { Database, DatabaseType, createTable } from 'karin-plugin-mys-core/database'
import { GenshinPanelInfoTableType } from '../types/tables/genshinPanelInfo'

export const GenshinPanelInfoTable = createTable<GenshinPanelInfoTableType>(
  dir.DataDir, 'genshin_panel_data', DatabaseType.File, 'uid'
)

export const GenshinPanelInfoDB = await GenshinPanelInfoTable.init(
  {
    uid: Database.PkColumn('STRING'),
    nickname: Database.Column('STRING', '旅行者'),

    level: Database.Column('INTEGER', 0),
    worldLevel: Database.Column('INTEGER', 0),

    pfpsId: Database.Column('STRING', ''),
    namecardId: Database.Column('STRING', ''),

  }
)
