import { dir } from '@/dir'
import { Config } from 'karin-plugin-mys-core/config'
import { DefaultConfigDefineType, DefaultConfigType, ResourceSourceEnum, ResourceTypeEnum } from './types'

const defaultConfig: DefaultConfigType = {
  [ResourceTypeEnum.BaseRes]: {
    source: ResourceSourceEnum.UnSet,
    customUrl: ''
  },
  [ResourceTypeEnum.PanelRes]: {
    source: ResourceSourceEnum.UnSet,
    customUrl: ''
  }
}

const defaultConfigDefine: DefaultConfigDefineType = {

}

export const Cfg = new Config(`${dir.name}:config`, dir.ConfigDir, defaultConfig, defaultConfigDefine).watch()
