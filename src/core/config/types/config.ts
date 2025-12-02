import { ConfigDefine, ConfigDefineArray } from 'karin-plugin-mys-core/config'

export interface DefaultConfigType {
  key: string
  object: {
    a: string
    b: Record<string, { c: string, d: boolean }[]>
  }
  array: { a: string, b: string }[]
  list: {
    [key: string]: {
      a: { a: string, b: string }[], b: string
    }
  }
}

/**
 * @description 已在DefaultConfigType中写死的配置项不需要写在这里
 * @description 当缺失T中的键时会在保存时添加、含有T中定义之外的键会在保存时删除
 */
export interface DefaultConfigDefineType {
  object: {
    /** @description 类型为Record<string, Array<T>> */
    b: ConfigDefineArray<{ c: string, d: boolean }>
  }
  /** @description 类型为Array<T> */
  array: ConfigDefineArray<{ a: string, b: string }>
  /** @description 类型为Record<string, T> */
  list: ConfigDefine<{ a: ConfigDefineArray<{ a: string, b: string }>, b: string }>
}
