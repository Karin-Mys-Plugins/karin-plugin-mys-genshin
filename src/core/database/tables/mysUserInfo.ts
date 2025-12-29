import { MysUserInfoTable, UidPermission } from 'karin-plugin-mys-core/database'
import { common, DefineDataPropEnum } from 'karin-plugin-mys-core/utils'
import { GAME, GenshinUIDInfoTableType } from '../types'

export const GenshinUserInfoDB = await MysUserInfoTable.addSchem<GenshinUIDInfoTableType>(
  {
    prop: DefineDataPropEnum.Object,
    default: {
      [`${GAME}-main` as const]: common.DefineValve(''),
      [`${GAME}-uids` as const]: {
        prop: DefineDataPropEnum.OArray,
        default: {},
        defaultItem: {
          prop: DefineDataPropEnum.Object,
          default: {
            ltuid: common.DefineValve(''),
            perm: common.DefineValve(UidPermission.BIND),
          }
        }
      }
    }
  }
)
