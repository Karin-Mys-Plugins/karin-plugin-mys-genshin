import { BaseGameUIDInfoTableType, BaseUserInfoTableType, BindUidsItemType, DatabaseReturn, DatabaseType } from 'karin-plugin-mys-core/database'
import { DefineData } from 'karin-plugin-mys-core/utils'

export const GAME = 'gs' as const

export type GenshinUIDInfoTableType = BaseGameUIDInfoTableType<typeof GAME>

export type GenshinUserInfoType = DatabaseReturn<GenshinUIDInfoTableType & BaseUserInfoTableType>[DatabaseType.Db]

export type GenshinUserInfoSchemaDefineType = {
  [K in `${typeof GAME}-uids`]: DefineData<BindUidsItemType>
}
