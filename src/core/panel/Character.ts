import { common } from '@/utils'
import { logger } from 'node-karin'
import { DefineAvatarMetaData, getAvatarMetaData } from './metaData'
import { AvatarBaseRes } from './resource'
import { AvatarElementsMetaDataType, AvatarMetaDataType, AvatarMetaId, ElementEnum } from './types'

export class Character<E extends ElementEnum> {
  id: AvatarMetaId
  declare name: AvatarMetaDataType<E>['name']
  declare abbr: AvatarMetaDataType<E>['abbr']
  declare star: AvatarMetaDataType<E>['star']
  declare weapon: AvatarMetaDataType<E>['weapon']
  declare element: AvatarMetaDataType<E>['element']

  declare basic: AvatarMetaDataType<E>['basic']

  declare materials: AvatarMetaDataType<E>['materials']

  declare costumes: AvatarMetaDataType<E>['costumes']

  declare attr: AvatarMetaDataType<E>['attr']

  declare talentId: AvatarMetaDataType<E>['talentId']
  declare talentCons: AvatarMetaDataType<E>['talentCons']
  declare talent: AvatarMetaDataType<E>['talent']
  declare talentData: AvatarMetaDataType<E>['talentData']

  declare cons: AvatarMetaDataType<E>['cons']

  declare passive: AvatarMetaDataType<E>['passive']

  declare version: AvatarMetaDataType<E>['version']
  declare eta: AvatarMetaDataType<E>['eta']

  #AvatarData: DefineAvatarMetaData<AvatarElementsMetaDataType>

  #AvatarRes: AvatarBaseRes
  constructor (id: AvatarMetaId, elem: E) {
    this.id = id

    this.#AvatarData = getAvatarMetaData(this.id)
    this.#AvatarRes = AvatarBaseRes.FromId(this.id)!

    const element = this.#AvatarData.checkElement(elem)

    const MetaData = this.#AvatarData.MetaData(element)

    const _this = this
    return new Proxy(this, {
      get (self, key, receiver) {
        if (key in MetaData) {
          return common.DataProxy(MetaData[key as keyof typeof MetaData], () => {
            logger.error('Cannot set value of readonly MetaData')
            return true
          })
        }

        const _key = key as keyof Character<E>
        // 如果是方法调用，绑定到原始实例
        if (typeof self[_key] === 'function') {
          return self[_key].bind(_this)
        }

        return Reflect.get(self, key, receiver)
      },
      set (target, key, newValue) {
        if (key in MetaData) {
          logger.error('Cannot set value of readonly MetaData')
          return true
        }

        return Reflect.set(target, key, newValue)
      }
    })
  }

  // 是否为实装官方角色
  get isRelease () {
    if (this.eta) {
      return this.eta < new Date().getTime()
    }
    return false
  }

  get sName () {
    return this.name.length < 4 ? this.name : (this.abbr || this.name)
  }

  getCalcRule () {
    const calcData = this.#AvatarData.CalcData(this.element)
    const calcBuffs = this.#AvatarData.CalcBuffs(this.element)

    return {
      dmgRankCalc: this.#AvatarData.DmgRankCalc(this.element),
      mainAttrs: this.#AvatarData.MainAttr(this.element),
      calcs: Array.from(calcData.data!.values()),
      buffs: Array.from(calcBuffs.data!.values())
    }
  }
}
