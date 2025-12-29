import * as avatarMetaDatas from '@/exports/meta/avatars'
import { AvatarCalcBuffItemType, AvatarCalcDataItemType, AvatarMetaDataType, ValidatedBuffArray } from '../types'

const AvatarMetaDataMap = new Map<string, DefineAvatarMetaData<any>>()

// 提取导出键名中的数字部分类型
type ExtractId<K extends keyof typeof avatarMetaDatas> = K extends `_${infer ID}` ? ID : never

type AvatarId = ExtractId<keyof typeof avatarMetaDatas>

export const getAvatarMetaData = <ID extends AvatarId> (id: ID): typeof avatarMetaDatas[`_${ID}`] | undefined => {
  return AvatarMetaDataMap.get(id) as typeof avatarMetaDatas[`_${ID}`] | undefined
}

export class DefineAvatarMetaData<Meta extends AvatarMetaDataType> {
  #MetaData: Meta

  /** @description 伤害计算 */
  #CalcData: AvatarCalcDataItemType<Meta>[]

  /** @description Buff计算 */
  #CalcBuffs: AvatarCalcBuffItemType[]

  constructor (
    meta: Meta,
    calc: AvatarCalcDataItemType<Meta>[],
    buffs: AvatarCalcBuffItemType[]
  ) {
    this.#MetaData = meta
    this.#CalcData = calc
    this.#CalcBuffs = buffs

    AvatarMetaDataMap.set(meta.id, this)
  }

  get MetaData () {
    return Object.freeze(this.#MetaData)
  }

  get CalcData () {
    return Object.freeze(this.#CalcData)
  }

  get CalcBuffs () {
    return Object.freeze(this.#CalcBuffs)
  }

  setCalc (fuc: (calc: AvatarCalcDataItemType<Meta>[]) => void) {
    fuc(this.#CalcData)
  }
}

/**
 * 辅助函数: 创建角色元数据定义
 * @description 提供类型安全的方式创建角色元数据,自动验证 buffs 中 title 的占位符
 */
export function defineAvatarMeta<
  Meta extends AvatarMetaDataType,
  const Buffs extends readonly any[]
> (
  meta: Meta,
  calc: AvatarCalcDataItemType<Meta>[],
  buffs: ValidatedBuffArray<Buffs> & Buffs
) {
  return new DefineAvatarMetaData(
    meta,
    calc,
    buffs as unknown as AvatarCalcBuffItemType[]
  )
}
