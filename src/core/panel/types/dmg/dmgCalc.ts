import { ElementEnum } from '../panel'
import { DmgAttrKeysEnum, DmgTalentKeysEnum, ElementReactionEnum } from './dmgAttr'

export interface DynamicDataType {
  /** @description 动态增伤 */
  dmg: number
  /** @description 动态物伤 */
  phy: number
  /** @description 动态暴击 */
  cpct: number
  /** @description 动态爆伤 */
  cdmg: number
}

export interface DmgCalcAttrItemType {
  /** @description 基础值 */
  base: number
  /** @description 加成值 */
  plus: number
  /** @description 百分比加成 */
  pct: number
  /** @description 提高：护盾增效&治疗增效 */
  inc: number
}

export interface DmgCalcTalentAttrItemType {
  /** @description 倍率加成 */
  pct: number
  /** @description 独立倍率乘区加成 */
  multi: number
  /** @description 伤害值提高 */
  plus: number
  /** @description 伤害提高 */
  dmg: number
  /** @description 承受伤害提高 */
  enemydmg: number
  /** @description 暴击提高 */
  cpct: number
  /** @description 爆伤提高 */
  cdmg: number
  /** @description 擢升 */
  elevated: number
  def: {
    /** @description 防御降低  */
    decr: number
    /** @description 无视防御 */
    ignore: number
  }
}

export interface DmgCalcAvatarDataType {
  level: number
  element: ElementEnum

  staticAttr: Record<DmgAttrKeysEnum, DmgCalcAttrItemType>
  baseAttr: Record<DmgAttrKeysEnum, DmgCalcAttrItemType>
  /** @description 技能属性 */
  skillAttr: Record<DmgTalentKeysEnum, DmgCalcTalentAttrItemType>
  /** @description 反应属性 */
  reactionAttr: Record<Exclude<ElementReactionEnum, 'phy'>, number>
  /** @description 倍率独立乘区 */
  multi: number
  /** @description 擢升 */
  elevated: number
  /** @description 敌人信息 */
  enemy: {
    level: number
    /** @description 防御降低 */
    def: number
    /** @description 无视防御 */
    ignore: number
    /** @description 物理防御 */
    phy: number
    /** @description 抗性降低 */
    RES: number
  }
  reactionDmg: {
    /** @description 反应基础伤害值提升（数值/受精通加成） */
    base: number
    /** @description 反应伤害值提升（数值/不受精通加成） */
    plus: number
    /** @description 反应伤害值提升（百分比/不受精通加成） */
    inc: number
    /** @description 反应基础伤害值提升（百分比/受精通加成） */
    pct: number
    /** @description 反应抗性降低 */
    RES: number
  }
}
