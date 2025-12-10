import { GenshinGame } from '@/core/mys'
import { BaseGameUIDInfoTableType, BaseUserInfoTableType, BindUidsItemType, DatabaseReturn, DatabaseType } from 'karin-plugin-mys-core/database'
import { DefineData } from 'karin-plugin-mys-core/utils'

export const GAME = 'gs'

export type GenshinUIDInfoTableType = BaseGameUIDInfoTableType<typeof GAME>

export type GenshinUserInfoType = DatabaseReturn<GenshinUIDInfoTableType & BaseUserInfoTableType>[DatabaseType.Db]

export interface GenshinUserInfoSchemaDDefineType {
  [GenshinGame.columnKey.uids]: DefineData<BindUidsItemType>
}
