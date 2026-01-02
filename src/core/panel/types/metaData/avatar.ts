import { DmgAttrKeysEnum, DmgCalc, DmgTalentKeysEnum, ElementEnum } from '@/core/panel'
import * as avatarMetaDatas from '@/exports/meta/avatars'
import { WeaponTypeEnum } from '../Weapon'

/** 创建指定长度的元组类型 */
type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>

/** 属性详情类型 - keys 和 data 中每个数组的长度必须一致 */
export interface AttrDetails<Keys extends readonly string[] = string[]> {
  [key: string]: Tuple<number, Keys['length']>
}

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

export interface AvatarElementsMetaDataType {
  /** 角色ID */
  id: string
  elements: Partial<Record<ElementEnum, AvatarMetaDataType>> & {
    // 至少需要一个元素
    [K in ElementEnum]?: AvatarMetaDataType<K>
  }
}

/** 命座信息 */
export interface ConsInfoItemType {
  name: string
  desc: string[]
}

/** 固定6个命座的元组类型 */
export type ConsTupleType = [
  ConsInfoItemType, ConsInfoItemType, ConsInfoItemType, ConsInfoItemType, ConsInfoItemType, ConsInfoItemType
]

export interface PassiveBaseType {
  name: string
  desc: string[]
}

export interface PassiveTalentType extends PassiveBaseType {
  id: string
  tables: TalentTable[]
}

/** 角色元数据 */
export interface AvatarMetaDataType<E extends ElementEnum = ElementEnum> {
  /** 角色名称 */
  name: string
  /** 角色简称 */
  abbr?: string
  /** 角色星级 */
  star: number
  /** 角色武器类型 */
  weapon: WeaponTypeEnum
  /** 角色元素 */
  element: E
  basic: {
    title: string
    allegiance: string
    birth: string
    astro: string
    desc: string
    /** 中文CV */
    cncv: string
  }
  materials: {
    gem: string
    boss: string
    /** 地域特产 */
    specialty: string
    normal: string
    /** 天赋材料 */
    talent: string
    /** 周本材料 */
    weekly: string
  }
  /** 角色衣装列表 */
  costumes: string[]

  attr: {
    /** 基础属性 */
    base: Record<Extract<DmgAttrKeysEnum, 'hp' | 'atk' | 'def'>, number>
    /** 成长属性 */
    grow: {
      key: DmgAttrKeysEnum; value: number
    }
    details: AttrDetails<['hp', 'atk', 'def', DmgAttrKeysEnum]>
  }

  /** 天赋ID */
  talentId: Record<string, Extract<DmgTalentKeysEnum, 'a' | 'e' | 'q'>>
  /** 天赋等级提升对应命座 */
  talentCons: Partial<Record<Extract<DmgTalentKeysEnum, 'a' | 'e' | 'q'>, number>>
  /** 天赋信息 */
  talent: Record<Extract<DmgTalentKeysEnum, 'a' | 'e' | 'q'>, TalentInfo>
  /** 天赋数值数据 */
  talentData: Record<Extract<DmgTalentKeysEnum, 'a' | 'e' | 'q'>, TalentDataMap>

  /** 命座信息 - 固定6个 */
  cons: ConsTupleType

  /** 被动信息 */
  passive: (PassiveBaseType | PassiveTalentType)[]

  /** 实装版本 */
  version: number
  /** 实装时间戳 */
  eta: number
}

/** 伤害计算元数据参数 */
export type CalcMetaParam<Meta extends AvatarMetaDataType> = {
  element: Meta['element']
  talent: {
    [K in keyof Meta['talentData']]: Meta['talentData'][K] extends TalentDataMap ? ProcessedTalentData<Meta['talentData'][K]> : never
  }
}

/** 单个元素的伤害计算数据项 */
export type AvatarElementCalcDataItemType<
  EMeta extends AvatarElementsMetaDataType,
  E extends keyof EMeta['elements'] = keyof EMeta['elements']
> = E extends keyof EMeta['elements']
  ? EMeta['elements'][E] extends AvatarMetaDataType<infer El> ? {
    element: El
    dmgRank: string
    calcs: AvatarCalcDataItemType<EMeta['elements'][E]>[]
  } : never
  : never

/** 伤害计算项配置 */
export interface AvatarCalcDataItemType<Meta extends AvatarMetaDataType = AvatarMetaDataType> {
  /** 计算项标题 */
  title: string
  params?: Record<string, any>
  /** 伤害计算函数 */
  dmg: (meta: CalcMetaParam<Meta>, dmgCalc: DmgCalc) => { dmg: number; avg: number }
  check?: () => boolean

  ignore?: boolean
}

/** 辅助类型: 提取 title 字符串中所有 [key] 形式的 key */
export type ExtractPlaceholderKeys<S extends string> = S extends `${string}[${infer Key}]${infer Rest}` ? Key | ExtractPlaceholderKeys<Rest> : never

/** 辅助类型: 检查提取的键是否都存在于目标键集合中 */
export type AllKeysExist<ExtractedKeys extends string, TargetKeys extends string> = ExtractedKeys extends TargetKeys ? true : false

/** 验证单个 Buff 项 */
export type ValidatedBuffItem<T> = T extends { title: string; data: Record<string, number> }
  ? (ExtractPlaceholderKeys<T['title']> extends never ? T : AllKeysExist<ExtractPlaceholderKeys<T['title']>, Extract<keyof T['data'], string>> extends true ? T : { [key in Exclude<ExtractPlaceholderKeys<T['title']>, keyof T['data']>]: number } & T)
  : T

/** 验证 Buff 数组 - 使用映射类型保留原始类型信息 */
export type ValidatedBuffArray<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? [ValidatedBuffItem<First>, ...ValidatedBuffArray<Rest>]
  : T extends readonly [] ? [] : { [K in keyof T]: ValidatedBuffItem<T[K]> }

/** 验证元素 Buff 数组项 */
export type ValidatedElementBuffItem<T> = T extends { element: any; buffs: infer B extends readonly any[] }
  ? { element: T['element']; buffs: ValidatedBuffArray<B> }
  : T

/** 验证元素 Buff 数组 - 使用映射类型保留原始类型信息 */
export type ValidatedElementBuffArray<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? [ValidatedElementBuffItem<First>, ...ValidatedElementBuffArray<Rest>]
  : T extends readonly [] ? [] : { [K in keyof T]: ValidatedElementBuffItem<T[K]> }

/** Buff 计算项类型 */
export type AvatarCalcBuffItemType<
  Title extends string = string,
  Data extends Record<string, number> = Record<string, number>
> = {
  title: Title
  /** 激活被动 */
  passive?: number
  /** 激活命座 */
  cons?: number
  /** 检查函数 */
  check?: (args: BuffCheckArgs) => boolean
  data: Data

  ignore?: boolean
}

/** 辅助类型: Buff 参数类型,用于推导 */
export type BuffCheckArgs = { cons: number; params: Record<string, any> }

/** 单个元素的 Buff 数据项 */
export type AvatarElementCalcBuffItemType<
  EMeta extends AvatarElementsMetaDataType = AvatarElementsMetaDataType,
  E extends keyof EMeta['elements'] = keyof EMeta['elements']
> = E extends keyof EMeta['elements']
  ? EMeta['elements'][E] extends AvatarMetaDataType<infer El> ? {
    element: El
    buffs: AvatarCalcBuffItemType[]
  } : never
  : never

// 提取导出键名中的数字部分类型
type ExtractId<K extends keyof typeof avatarMetaDatas> = K extends `_${infer ID}` ? ID : never

export type AvatarMetaId = ExtractId<keyof typeof avatarMetaDatas>

export interface MainAttrListType {
  element: ElementEnum
  mainAttrs: DmgAttrKeysEnum[]
}

export interface AvatarCalcGradeItemType {
  /** 同时有多个评分规则时选取idx最小 */
  idx: number
  title: string
  check: () => boolean
  /** 评分规则 */
  grade: Record<Extract<DmgAttrKeysEnum, 'hp' | 'atk' | 'def' | 'cpct' | 'cdmg' | 'mastery' | 'dmg' | 'phy' | 'recharge' | 'heal'>, number>
}
