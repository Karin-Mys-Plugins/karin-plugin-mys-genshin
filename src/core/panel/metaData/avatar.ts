import { logger } from 'node-karin'
import { AvatarCalcBuffItemType, AvatarCalcDataItemType, AvatarElementCalcBuffItemType, AvatarElementCalcDataItemType, AvatarElementsMetaDataType, AvatarMetaDataType, AvatarMetaId, ElementEnum, MainAttrListType, ValidatedElementBuffArray } from '../types'

const AvatarMetaDataMap = new Map<string, DefineAvatarMetaData<any>>()

export const getAvatarMetaData = <ID extends AvatarMetaId> (id: ID): DefineAvatarMetaData<AvatarElementsMetaDataType> => AvatarMetaDataMap.get(id)!

export const checkMetaID = (id: string): AvatarMetaId => AvatarMetaDataMap.has(id)
  ? id as AvatarMetaId
  : (() => { throw new Error(`Avatar Meta Data ID "${id}" not found`) })()

export class DefineAvatarMetaData<EMeta extends AvatarElementsMetaDataType> {
  #MetaData: EMeta

  /** 伤害计算 */
  #CalcData: {
    [K in keyof EMeta['elements']]: EMeta['elements'][K] extends AvatarMetaDataType ? Map<string, AvatarCalcDataItemType<EMeta['elements'][K]>> : never
  } = {} as any

  /** Buff计算 - 按元素分组 */
  #CalcBuffs: {
    [K in keyof EMeta['elements']]: EMeta['elements'][K] extends AvatarMetaDataType ? Map<string, AvatarCalcBuffItemType> : never
  } = {} as any

  #CalcGrades = new Map<string, number>()

  #MainAttr: {
    [K in keyof EMeta['elements']]: MainAttrListType['mainAttrs']
  } = {} as any

  DmgRankCalcTitle: {
    [K in keyof EMeta['elements']]: string
  } = {} as any

  constructor (
    meta: EMeta, calc: AvatarElementCalcDataItemType<EMeta>[], buffs: AvatarElementCalcBuffItemType<EMeta>[], mainAttr: MainAttrListType[]
  ) {
    this.#MetaData = meta

    calc.forEach(item => {
      if (!this.#CalcData[item.element]) {
        this.#CalcData[item.element] = new Map() as any
      }

      item.calcs.forEach(calcItem => {
        this.#CalcData[item.element]!.set(calcItem.title, calcItem)
      })
    })

    buffs.forEach(item => {
      if (!this.#CalcBuffs[item.element]) {
        this.#CalcBuffs[item.element] = new Map() as any
      }

      item.buffs.forEach(buffItem => {
        this.#CalcBuffs[item.element]!.set(buffItem.title, buffItem)
      })
    })

    mainAttr.forEach(item => {
      this.#MainAttr[item.element as keyof EMeta['elements']] = item.mainAttrs
    })

    AvatarMetaDataMap.set(meta.id, this)

    for (const element in meta.elements) {
      this.DmgRankCalcTitle[element as keyof EMeta['elements']] = this.#CalcData[element as keyof EMeta['elements']].keys().next().value ?? ''
    }
  }

  checkElement (element: ElementEnum) {
    if (!this.#MetaData.elements[element]) {
      throw new Error(`Avatar "${this.#MetaData.id}" has no element "${element}"`)
    }

    return element as keyof EMeta['elements']
  }

  MetaData<E extends keyof EMeta['elements']> (element: E) {
    return Object.freeze(this.#MetaData.elements[element as ElementEnum]!)
  }

  CalcData<E extends keyof EMeta['elements']> (element: E) {
    return {
      data: this.#CalcData[element],
      get: (title: string) => Object.freeze(this.#CalcData[element].get(title)!),
      add: (calcs: AvatarCalcDataItemType<EMeta['elements'][E] & AvatarMetaDataType>[]) => {
        calcs.forEach(calcItem => {
          this.#CalcData[element].set(calcItem.title, calcItem)
        })
      },
      clear: () => {
        this.#CalcData[element].forEach(calc => {
          calc.ignore = true
        })

        return this.CalcData(element)
      },
      delete: this.#CalcData[element]!.delete
    }
  }

  CalcBuffs<E extends keyof EMeta['elements']> (element: E) {
    return {
      data: this.#CalcBuffs[element],
      get: (title: string) => Object.freeze(this.#CalcBuffs[element].get(title)!),
      add: (buffs: AvatarCalcBuffItemType[]) => {
        buffs.forEach(buffItem => {
          this.#CalcBuffs[element].set(buffItem.title, buffItem)
        })
      },
      clear: () => {
        this.#CalcBuffs[element].forEach(buff => {
          buff.ignore = true
        })

        return this.CalcBuffs(element)
      },
      delete: this.#CalcBuffs[element]!.delete
    }
  }

  MainAttr (element: keyof EMeta['elements']) {
    return Object.freeze(this.#MainAttr[element])
  }

  DmgRankCalc (element: keyof EMeta['elements']) {
    return Object.freeze(this.CalcData(element).get(this.DmgRankCalcTitle[element])!)
  }

  addCalcs (calcs: AvatarElementCalcDataItemType<EMeta>[]) {
    calcs.forEach(item => {
      if (!this.#MetaData.elements[item.element]) {
        logger.error(`Avatar "${this.#MetaData.id}" has no element "${item.element}"`)
        return
      }

      if (!this.#CalcData[item.element]) {
        this.#CalcData[item.element] = new Map() as any
      }

      item.calcs.forEach(calcItem => {
        this.#CalcData[item.element]!.set(calcItem.title, calcItem)
      })
    })
  }

  addBuffs<const Buffs extends readonly any[]> (_buffs: ValidatedElementBuffArray<Buffs> & Buffs) {
    const buffs = _buffs as unknown as AvatarElementCalcBuffItemType<EMeta>[]

    buffs.forEach(item => {
      if (!this.#MetaData.elements[item.element]) {
        logger.error(`Avatar "${this.#MetaData.id}" has no element "${item.element}"`)
        return
      }

      if (!this.#CalcBuffs[item.element]) {
        this.#CalcBuffs[item.element] = new Map() as any
      }

      item.buffs.forEach(buffItem => {
        this.#CalcBuffs[item.element]!.set(buffItem.title, buffItem)
      })
    })
  }

  setMainAttrs (element: keyof EMeta['elements'], mainAttrs: MainAttrListType['mainAttrs']) {
    this.#MainAttr[element] = mainAttrs
  }

  setDmgRankCalcTitle (element: keyof EMeta['elements'], title: string) {
    if (!this.#CalcData[element].has(title)) {
      logger.error(`Avatar "${this.#MetaData.id}" setDmgDefault error: title "${title}" not found for "${String(element)}" calc`)
      return
    }

    this.DmgRankCalcTitle[element] = title
  }
}

/**
 * 辅助函数: 创建角色元数据定义
 * 提供类型安全的方式创建角色元数据,自动验证 buffs 中 title 的占位符
 */
export function defineAvatarMeta<EMeta extends AvatarElementsMetaDataType, const Buffs extends readonly any[]> (
  meta: EMeta,
  calc: AvatarElementCalcDataItemType<EMeta>[],
  buffs: ValidatedElementBuffArray<Buffs> & Buffs,
  mainAttr: MainAttrListType[]
) {
  return new DefineAvatarMetaData(meta, calc, buffs as unknown as AvatarElementCalcBuffItemType<EMeta>[], mainAttr)
}
