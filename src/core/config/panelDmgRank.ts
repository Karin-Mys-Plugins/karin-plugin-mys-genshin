import { dir } from '@/dir'
import { Config } from 'karin-plugin-mys-core/config'
import { DefineDataPropEnum } from 'karin-plugin-mys-core/utils'
import { PanelDmgRankConfigType } from './types/panelDmgRank'

export const PanelDmgRank = new Config<PanelDmgRankConfigType>(`${dir.name}:panel-dmg-rank`, dir.ConfigDir, {
  prop: DefineDataPropEnum.Object,
  default: {
    avatars: {
      prop: DefineDataPropEnum.OArray,
      default: {},
      defaultItem: {
        prop: DefineDataPropEnum.Object,
        default: {
          calcTitle: {
            prop: DefineDataPropEnum.Value,
            type: 'string',
            default: ''
          }
        }
      }
    }
  }
}).watch()
