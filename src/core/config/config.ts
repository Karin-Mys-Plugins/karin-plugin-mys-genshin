import { dir } from '@/dir'
import { Config } from 'karin-plugin-mys-core/config'
import { MysAccountType } from 'karin-plugin-mys-core/database'
import { common, DefineDataPropEnum } from 'karin-plugin-mys-core/utils'
import { DefaultConfigType, ResourceSourceEnum, ResourceTypeEnum } from './types'

export const Cfg = new Config<DefaultConfigType>(`${dir.name}:config`, dir.ConfigDir, {
  prop: DefineDataPropEnum.Object,
  default: {
    panel: {
      prop: DefineDataPropEnum.Object,
      default: {
        source: {
          prop: DefineDataPropEnum.OArray,
          default: {
            [MysAccountType.cn]: 'MiniGG',
            [MysAccountType.os]: 'Enka'
          },
          defaultItem: {
            prop: DefineDataPropEnum.Value,
            type: 'string',
            default: 'Enka'
          },
          requiredDefault: [MysAccountType.cn, MysAccountType.os]
        },
        proxy: common.DefineValve(false),
      }
    },
    resources: {
      prop: DefineDataPropEnum.OArray,
      default: {},
      defaultItem: {
        prop: DefineDataPropEnum.Object,
        default: {
          source: common.DefineValve(ResourceSourceEnum.UnSet),
          customUrl: common.DefineValve(''),
        }
      },
      requiredDefault: [ResourceTypeEnum.BaseRes, ResourceTypeEnum.PanelRes]
    }
  }
}).watch()
