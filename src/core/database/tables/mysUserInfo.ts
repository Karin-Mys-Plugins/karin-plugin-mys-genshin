import { GenshinGame } from '@/core/mys'
import { Database, MysUserInfoTable, UidPermission } from 'karin-plugin-mys-core/database'
import { GenshinUIDInfoTableType, GenshinUserInfoSchemaDDefineType } from '../types'

const SchemaDefine: GenshinUserInfoSchemaDDefineType = {
  [GenshinGame.columnKey.uids]: {
    defaultConfig: {
      perm: UidPermission.BIND, ltuid: ''
    }
  }
}

export const GenshinUserInfoDB = await MysUserInfoTable.addSchem<GenshinUIDInfoTableType>(
  {
    [GenshinGame.columnKey.main as 'gs-main']: Database.Column('STRING', ''),
    [GenshinGame.columnKey.uids as 'gs-uids']: Database.JsonColumn(GenshinGame.columnKey.uids, {})
  },
  SchemaDefine
)
