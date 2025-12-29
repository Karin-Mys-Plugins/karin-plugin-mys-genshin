import { DmgCalc } from '@/core/panel'

/** 天赋类型: a-普攻, e-元素战技, q-元素爆发 */
export type TalentType = 'a' | 'e' | 'q'

/** 天赋表格数据 */
export interface TalentTable {
  /** 属性名称 */
  name: string
  /** 单位 */
  unit: string
  /** 是否所有等级值相同 */
  isSame: boolean
  /** 各等级的值 */
  values: string[]
}

/** 天赋信息 */
export interface TalentInfo {
  /** 天赋ID */
  id: string
  /** 天赋名称 */
  name: string
  /** 天赋描述 */
  desc: string[]
  /** 天赋数据表格 */
  tables: TalentTable[]
}

/** 天赋数值数据 (键: 属性名, 值: 各等级的数值) */
export type TalentDataMap = Record<string, (number | number[])[]>

/** 处理后的天赋数据 (将所有值展平为number) */
export type ProcessedTalentData<T extends TalentDataMap> = {
  [K in keyof T]: number
}

/** 角色元数据 */
export interface AvatarMetaDataType {
  /** 角色ID */
  id: string

  /** 天赋信息 */
  talent: Record<TalentType, TalentInfo>

  /** 天赋数值数据 */
  talentData: Record<TalentType, TalentDataMap>
}

/** 伤害计算元数据参数 */
export type CalcMetaParam<Meta extends AvatarMetaDataType> = {
  talent: {
    [K in keyof Meta['talentData']]: Meta['talentData'][K] extends TalentDataMap ? ProcessedTalentData<Meta['talentData'][K]> : never
  }
}

/** 伤害计算项配置 */
export interface AvatarCalcDataItemType<Meta extends AvatarMetaDataType> {
  /** 计算项标题 */
  title: string
  params?: Record<string, any>
  /** 伤害计算函数 */
  dmg: (meta: CalcMetaParam<Meta>, dmgCalc: DmgCalc) => number
  /** 是否忽略此计算项 */
  ignore?: () => boolean
}

/** 辅助类型: 提取 title 字符串中所有 [key] 形式的 key */
export type ExtractPlaceholderKeys<S extends string> = S extends `${string}[${infer Key}]${infer Rest}` ? Key | ExtractPlaceholderKeys<Rest> : never

/** 辅助类型: 检查提取的键是否都存在于目标键集合中 */
export type AllKeysExist<ExtractedKeys extends string, TargetKeys extends string> = ExtractedKeys extends TargetKeys ? true : false

/** 验证单个 Buff 项 */
export type ValidatedBuffItem<T> = T extends { title: string; data: Record<string, number> }
  ? (ExtractPlaceholderKeys<T['title']> extends never ? T : AllKeysExist<ExtractPlaceholderKeys<T['title']>, Extract<keyof T['data'], string>> extends true ? T : { __error__: 'missing keys in data' } & T)
  : T

/** 验证 Buff 数组 - 使用映射类型保留原始类型信息 */
export type ValidatedBuffArray<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? [ValidatedBuffItem<First>, ...ValidatedBuffArray<Rest>] : T extends readonly [] ? [] : { [K in keyof T]: ValidatedBuffItem<T[K]> }

/** Buff 计算项类型 */
export type AvatarCalcBuffItemType<
  Title extends string = string,
  Data extends Record<string, number> = Record<string, number>
> = {
  title: Title
  /** @description 激活被动 */
  passive?: number
  /** @description 激活命座 */
  cons?: number
  /** @description 检查函数 */
  check?: (args: BuffCheckArgs) => boolean
  data: Data
}

/** 辅助类型: Buff 参数类型,用于推导 */
export type BuffCheckArgs = { cons: number; params: Record<string, any> }
