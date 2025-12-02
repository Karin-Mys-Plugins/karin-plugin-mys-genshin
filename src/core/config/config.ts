import { dir } from '@/dir'
import { Config } from 'karin-plugin-mys-core/config'
import path from 'node:path'
import { DefaultConfigDefineType, DefaultConfigType } from './types'

const configPath = path.join(dir.ConfigDir, 'config.json')

const defaultConfig: DefaultConfigType = {
  key: 'value',
  object: {
    a: 'value',
    b: {}
  },
  array: [],
  list: {
    global: { a: [], b: 'value' }
  }
}

const defaultConfigDefine: DefaultConfigDefineType = {
  object: {
    b: {
      defaultConfig: [],
      defaultConfigItem: {
        defaultConfig: { c: '', d: false },
      }
    }
  },
  array: {
    defaultConfig: [],
    defaultConfigItem: {
      defaultConfig: { a: 'value', b: '' },
      /** @description 所有a值为 '' null undefined的元素会被移除 */
      required: ['a']
    }
  },
  list: {
    defaultConfig: {
      a: {
        defaultConfig: [],
        defaultConfigItem: {
          defaultConfig: { a: '', b: '' }
        }
      },
      b: ''
    }
  }
}

export const Cfg = new Config(`${dir.name}:config`, configPath, defaultConfig, defaultConfigDefine).watch()
