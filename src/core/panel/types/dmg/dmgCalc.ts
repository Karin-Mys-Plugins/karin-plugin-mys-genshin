import { ElementEnum } from '../panel'
import { DmgAttrKeysEnum, DmgTalentKeysEnum, ElementReactionEnum } from './dmgAttr'

export interface DynamicDataType {
  /** 动态增伤 */
  dmg: number
  /** 动态物伤 */
  phy: number
  /** 动态暴击 */
  cpct: number
  /** 动态爆伤 */
  cdmg: number
}

export interface DmgCalcAttrItemType {
  /** 基础值 */
  base: number
  /** 加成值 */
  plus: number
  /** 百分比加成 */
  pct: number
  /** 提高：护盾增效&治疗增效 */
  inc: number
}

export interface DmgCalcTalentAttrItemType {
  /** 倍率加成 */
  pct: number
  /** 独立倍率乘区加成 */
  multi: number
  /** 伤害值提高 */
  plus: number
  /** 伤害提高 */
  dmg: number
  /** 承受伤害提高 */
  enemydmg: number
  /** 暴击提高 */
  cpct: number
  /** 爆伤提高 */
  cdmg: number
  /** 擢升 */
  elevated: number
  def: {
    /** 防御降低  */
    decr: number
    /** 无视防御 */
    ignore: number
  }
}

export interface DmgCalcAvatarDataType {
  level: number
  element: ElementEnum

  staticAttr: Record<DmgAttrKeysEnum, DmgCalcAttrItemType>
  baseAttr: Record<DmgAttrKeysEnum, DmgCalcAttrItemType>
  /** 技能属性 */
  skillAttr: Record<DmgTalentKeysEnum, DmgCalcTalentAttrItemType>
  /** 反应属性 */
  reactionAttr: Record<Exclude<ElementReactionEnum, 'phy'>, number>
  /** 倍率独立乘区 */
  multi: number
  /** 擢升 */
  elevated: number
  /** 敌人信息 */
  enemy: {
    level: number
    /** 防御降低 */
    def: number
    /** 无视防御 */
    ignore: number
    /** 物理防御 */
    phy: number
    /** 抗性降低 */
    RES: number
  }
  reactionDmg: {
    /** 反应基础伤害值提升（数值/受精通加成） */
    base: number
    /** 反应伤害值提升（数值/不受精通加成） */
    plus: number
    /** 反应伤害值提升（百分比/不受精通加成） */
    inc: number
    /** 反应基础伤害值提升（百分比/受精通加成） */
    pct: number
    /** 反应抗性降低 */
    RES: number
  }
}
