import { Database, MysUserInfoTable, UidPermission } from 'karin-plugin-mys-core/database'
import { GAME, GenshinUIDInfoTableType, GenshinUserInfoSchemaDefineType } from '../types'

export const GenshinUserInfoDB = await MysUserInfoTable.addSchem<GenshinUIDInfoTableType, GenshinUserInfoSchemaDefineType>(
  [
    Database.Column(`${GAME}-main`, 'STRING', ''),
    Database.JsonColumn(`${GAME}-uids`, {})
  ],
  {
    [`${GAME}-uids` as const]: {
      defaultConfig: {
        perm: UidPermission.BIND, ltuid: ''
      }
    }
  }
)
