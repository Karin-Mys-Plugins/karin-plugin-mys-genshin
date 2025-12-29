import { BaseGameUIDInfoTableType, BaseUserInfoTableType, DatabaseReturn, DatabaseType } from 'karin-plugin-mys-core/database'

export const GAME = 'gs' as const

export type GenshinUIDInfoTableType = BaseGameUIDInfoTableType<typeof GAME>

export type GenshinUserInfoType = DatabaseReturn<GenshinUIDInfoTableType & BaseUserInfoTableType>[DatabaseType.Db]
