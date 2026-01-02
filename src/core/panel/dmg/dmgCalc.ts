import { DmgCalcAttrItemType, DmgCalcAvatarDataType, DmgTalentKeysEnum, DynamicDataType, ElementReactionEnum } from '../types'
import { cryBaseDmg, MasteryBaseDmg, ReactionTypeMeta } from './dmgCalcMeta'

export class DmgCalc {
  #avatarData: DmgCalcAvatarDataType

  constructor (avatarData: DmgCalcAvatarDataType) {
    this.#avatarData = avatarData
  }

  static calc (attrData: Partial<DmgCalcAttrItemType>) {
    return (attrData.base || 0) + (attrData.plus || 0) + ((attrData.base || 0) * (attrData.pct || 0) / 100)
  }

  #calcRet (
    args: {
      PctNum?: number; talent?: DmgTalentKeysEnum[]; basicNum?: number; mode?: 'talent' | 'basic'
    },
    reaction: ['scene', ElementReactionEnum | 'phy'] | [ElementReactionEnum | 'phy'] | ['scene'] | [] = [],
    dynamicData: Partial<DynamicDataType> = {}
  ) {
    const { PctNum = 0, talent = [], basicNum = 0, mode = 'talent' } = args
    const {
      dmg: dynamicDmg = 0, phy: dynamicPhy = 0, cpct: dynamicCpct = 0, cdmg: dynamicCdmg = 0
    } = dynamicData

    const { atk, dmg, phy, cdmg, cpct } = this.#avatarData.baseAttr

    // 攻击区
    const atkNum = DmgCalc.calc(atk)

    // 倍率独立乘区
    let multiNum = this.#avatarData.multi / 100

    const { plus: fyPlus, base: fyBase } = this.#avatarData.reactionDmg
    const fyPct = this.#avatarData.reactionDmg.pct / 100
    const fyInc = this.#avatarData.reactionDmg.inc / 100

    // 增伤区
    const elevatedNum = this.#avatarData.elevated / 100
    let dmgNum = 0

    if (reaction.length !== 1 || reaction[0] !== 'phy') {
      if (reaction[0] === 'scene') {
        const dmgPct = this.#avatarData.staticAttr.dmg.plus / 100
        if (dmgPct > 0) {
          dmgNum = (dmgNum - dmgPct) < 1 ? 1 : (dmgNum - dmgPct)
        }

        if (reaction.length > 1) reaction.shift()
      } else {
        dmgNum = 1 + (dmg.base + dmg.plus + dynamicDmg) / 100
      }
    } else {
      dmgNum = 1 + (phy.base + phy.plus + dynamicPhy) / 100
    }

    // 易伤区
    const enemydmgNum = 1

    // 暴击区
    let cpctNum = cpct.base / 100 + cpct.plus / 100 + dynamicCpct / 100

    // 爆伤区
    let cdmgNum = cdmg.base / 100 + cdmg.plus / 100 + dynamicCdmg / 100

    let enemyDef = this.#avatarData.enemy.def / 100
    let enemyIgnore = this.#avatarData.enemy.ignore / 100

    let plusNum = 0

    let pctNum = PctNum / 100
    if (talent.length > 0) {
      talent.forEach((t) => {
        if (this.#avatarData.skillAttr[t]) {
          const ds = this.#avatarData.skillAttr[t]

          pctNum += ds.pct / 100
          dmgNum += ds.dmg / 100
          cpctNum += ds.cpct / 100
          cdmgNum += ds.cdmg / 100
          enemyDef += ds.def.decr / 100
          enemyIgnore += ds.def.ignore / 100
          multiNum += ds.multi / 100
          plusNum += ds.plus
        }
      })
    }

    // 防御区
    const defNum = (this.#avatarData.level + 100) / ((this.#avatarData.level + 100) + (this.#avatarData.enemy.level + 100) * (1 - enemyDef) * (1 - enemyIgnore))

    // 抗性区
    let RES = this.#avatarData.enemy.RES
    let RESNum = 0.9
    if (reaction[0] === ElementReactionEnum.扩散) {
      RES = this.#avatarData.reactionDmg.RES
    }
    RES = 10 - RES
    if (RES >= 75) {
      RESNum = 1 / (1 + 3 * RES / 100)
    } else if (RES >= 0) {
      RESNum = 1 - RES / 100
    } else {
      RESNum = 1 - RES / 200
    }

    // 减伤区
    const dmgReduceNum = 1

    cpctNum = Math.max(0, Math.min(1, cpctNum))
    if (cpctNum === 0) cdmgNum = 0

    // 反应区
    let reactionNum = 1
    let reactionBase = 1
    if (reaction.length > 0 && reaction[0] !== 'phy' && reaction[0] !== 'scene') {
      reactionNum = ReactionTypeMeta.getBasePct(reaction[0]!, this.#avatarData.element)
      reactionBase = 1 + this.#avatarData.reactionAttr[reaction[0]!] / 100 + ReactionTypeMeta.getMultiple(reaction[0]!, DmgCalc.calc(this.#avatarData.baseAttr.mastery))
    }

    let dmgBase = (mode === 'basic') ? basicNum * (1 + multiNum) + plusNum : atkNum * pctNum * (1 + multiNum) + plusNum

    switch (reaction[0]) {
      case ElementReactionEnum.融化:
      case ElementReactionEnum.蒸发: {
        return {
          dmg: dmgBase * dmgNum * (1 + cdmgNum) * defNum * RESNum * reactionBase * reactionNum,
          avg: dmgBase * dmgNum * (1 + cpctNum * cdmgNum) * defNum * RESNum * reactionBase * reactionNum
        }
      }
      case ElementReactionEnum.燃烧:
      case ElementReactionEnum.超导:
      case ElementReactionEnum.扩散:
      case ElementReactionEnum.感电:
      case ElementReactionEnum.碎冰:
      case ElementReactionEnum.超载:
      case ElementReactionEnum.绽放:
      case ElementReactionEnum.烈绽放:
      case ElementReactionEnum.超绽放: {
        return {
          dmg: 0, avg: ((MasteryBaseDmg[this.#avatarData.level] * (1 + fyPct) + fyBase) * reactionBase * reactionNum + (MasteryBaseDmg[this.#avatarData.level] * fyInc) + fyPlus) * RESNum
        }
      }
      case ElementReactionEnum.月感电:
      case ElementReactionEnum.月绽放: {
        const lunarBase = dmgBase || MasteryBaseDmg[this.#avatarData.level]

        if (reaction[0] === ElementReactionEnum.月感电 && dmgBase) {
          reactionNum = 3
        } else {
          reactionNum = 1
        }

        return {
          avg: ((lunarBase * (1 + fyPct) + fyBase) * reactionBase * reactionNum + (lunarBase * fyInc) + fyPlus) * (1 + elevatedNum) * RESNum * (1 + cpctNum * cdmgNum),
          dmg: ((lunarBase * (1 + fyPct) + fyBase) * reactionBase * reactionNum + (lunarBase * fyInc) + fyPlus) * (1 + elevatedNum) * RESNum * (1 + cdmgNum)
        }
      }
      case ElementReactionEnum.结晶: {
        reactionBase *= cryBaseDmg[this.#avatarData.level]
        return {
          dmg: 0, avg: reactionBase * (DmgCalc.calc(this.#avatarData.baseAttr.shield) / 100) * (this.#avatarData.baseAttr.shield.inc / 100)
        }
      }
      case ElementReactionEnum.超激化:
      case ElementReactionEnum.蔓激化: {
        reactionBase *= MasteryBaseDmg[this.#avatarData.level]
        dmgBase += reactionBase * reactionNum
        return {
          dmg: dmgBase * dmgNum * (1 + cdmgNum) * defNum * RESNum,
          avg: dmgBase * dmgNum * (1 + cpctNum * cdmgNum) * defNum * RESNum
        }
      }
      default: {
        return {
          dmg: dmgBase * dmgNum * enemydmgNum * (1 + cdmgNum) * defNum * RESNum * dmgReduceNum,
          avg: dmgBase * dmgNum * enemydmgNum * (1 + cpctNum * cdmgNum) * defNum * RESNum * dmgReduceNum
        }
      }
    }
  }

  dmg (pctNum: number, talent: DmgTalentKeysEnum[], reaction?: ['scene', ElementReactionEnum | 'phy'] | [ElementReactionEnum | 'phy'] | ['scene'] | [], basicNum = 0, mode: 'talent' | 'basic' = 'talent', dynamicData?: Partial<DynamicDataType>) {
    return this.#calcRet({ PctNum: pctNum, talent, basicNum, mode }, reaction, dynamicData)
  }

  basic (basicNum: number, talent: DmgTalentKeysEnum[], reaction?: ['scene', ElementReactionEnum | 'phy'] | [ElementReactionEnum | 'phy'] | ['scene'] | [], dynamicData?: Partial<DynamicDataType>) {
    return this.#calcRet({ talent, basicNum, mode: 'basic' }, reaction, dynamicData)
  }

  reaction (reaction: ['scene', ElementReactionEnum | 'phy'] | [ElementReactionEnum | 'phy'] | ['scene'] | [], talent: DmgTalentKeysEnum[]) {
    return this.#calcRet({ talent, mode: 'basic' }, reaction)
  }

  dynamic (pctNum: number, talent: DmgTalentKeysEnum[], dynamicData: Partial<DynamicDataType>, reaction?: ['scene', ElementReactionEnum | 'phy'] | [ElementReactionEnum | 'phy'] | ['scene'] | []) {
    return this.#calcRet({ PctNum: pctNum, talent, mode: 'talent' }, reaction, dynamicData)
  }

  /** 治疗 */
  heal (pctNum: number) {
    return {
      dmg: 0, avg: pctNum * (1 + DmgCalc.calc(this.#avatarData.baseAttr.heal) / 100 + this.#avatarData.baseAttr.heal.inc / 100)
    }
  }

  /** 护盾 */
  shield (pctNum: number) {
    return {
      dmg: 0, avg: pctNum * (DmgCalc.calc(this.#avatarData.baseAttr.shield) / 100) * (this.#avatarData.baseAttr.shield.inc / 100)
    }
  }

  /** 扩散 */
  swirl () {
    return this.#calcRet({}, [ElementReactionEnum.扩散])
  }
}
