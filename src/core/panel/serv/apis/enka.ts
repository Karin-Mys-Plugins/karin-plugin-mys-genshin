import { Cfg } from '@/core/config'
import { CoreCfg } from 'karin-plugin-mys-core/core'
import { MysAccountType } from 'karin-plugin-mys-core/database'
import { UidInfoType } from 'karin-plugin-mys-core/mys'
import { ElementEnum, PanelServ, PanelServResponseType } from '../../types'
import { PanelServHeaders, PanelServManage, RequestPanelData } from '../manage'

export interface EnkaDataType {
  playerInfo: EnkaPlayerInfoDataType
  avatarInfoList: EnkaAvatarInfoItemType[]
}

export interface EnkaPlayerInfoDataType {
  /** @description 名称 */
  nickname: string
  /** @description 等级 */
  level: number
  /** @description 签名 */
  signature: string
  /** @description 世界等级 */
  worldLevel: number
  /** @description 资料名片 ID */
  nameCardId: number
  /** @description 角色 ID 与等级的列表 */
  showAvatarInfoList: {
    /** @description 角色 ID */
    avatarId: number
    /** @description 角色等级 */
    level: number
    /** @description 角色衣装 ID */
    costumeId?: number
    /** @description 元素类型 */
    energyType?: number
  }[]
  /** @description 正在展示的名片 ID 列表 */
  showNameCardIdList: number[]
  /** @description 玩家头像 */
  profilePicture: {
    /** @description 角色 ID */
    avatarId?: number
    /** @description 头像 ID */
    id?: number
  }
}

export interface EnkaAvatarInfoItemType {
  /** @description 角色 ID */
  avatarId: number
  /** @description 命之座 ID 列表 */
  talentIdList?: number[]
  /** @description 天赋等级 Map */
  skillLevelMap: Record<string, number>
  /** @description 装备及圣遗物信息 */
  equipList: (EnkaAvatarWeaponInfoType | EnkaAvatarReliquaryInfoType)[]
  fetterInfo: {
    /** @description 好感度等级 */
    expLevel: number
  }
  /** @description 角色衣装 ID */
  costumeId: number
}

export interface EnkaAvatarWeaponInfoType {
  itemId: number
  weapon: {
    /** @description 武器等级 */
    level: number
    /** @description 武器突破等级 */
    promoteLevel: number
    /** @description 武器精炼等级 { itemId: 0-4 } */
    affixMap: {
      [key: string]: number
    }
  }
  flat: {
    itemType: 'ITEM_WEAPON'
  }
}

export interface EnkaAvatarReliquaryInfoType {
  itemId: number
  reliquary: {
    /** @description 圣遗物等级 */
    level: number
    /** @description 圣遗物主属性 ID */
    mainPropId: number
    /** @description 圣遗物副属性 ID 列表 */
    appendPropIdList: number[]
  }
  flat: {
    itemType: 'ITEM_RELIQUARY'
  }
}

const ElementList = [ElementEnum.火, ElementEnum.水, ElementEnum.草, ElementEnum.雷, ElementEnum.冰, ElementEnum.无, ElementEnum.风, ElementEnum.岩]

export const EnkaServ = new class EnkaServ implements PanelServ {
  key = 'Enka'
  name = 'Enka-Network'
  Support = [MysAccountType.cn, MysAccountType.os]

  async request (uidInfo: UidInfoType) {
    const proxyUrl = Cfg.get('panel.proxy') ? CoreCfg.get('proxy.hoyolab').replace(/\/+$/, '') : ''

    const result = await RequestPanelData<EnkaDataType>(new URL(`${proxyUrl}https://enka.network/api/uid/${uidInfo.uid}`), 'GET', PanelServHeaders)

    if (!result) {
      return {
        code: -1,
        message: `请求${this.name}面板数据失败，未获取到数据`
      }
    }

    return this.ProcessResult(uidInfo.uid, result)
  }

  async ProcessResult (uid: string, response: EnkaDataType): Promise<PanelServResponseType> {
    const { playerInfo, avatarInfoList } = response

    const result: PanelServResponseType['data'] = {
      uid,
      playerInfo: {
        nickname: playerInfo.nickname,
        level: playerInfo.level,
        signature: playerInfo.signature,
        worldLevel: playerInfo.worldLevel,
        nameCardId: playerInfo.nameCardId + '',
        profilePictureId: (playerInfo.profilePicture.id || playerInfo.profilePicture.avatarId) + ''
      },
      avatarInfoList: avatarInfoList.map(avatar => {
        const showAvatarInfo = playerInfo.showAvatarInfoList.find(item => item.avatarId === avatar.avatarId)!

        const weaponEquip = avatar.equipList.find(item => item.flat.itemType === 'ITEM_WEAPON') as EnkaAvatarWeaponInfoType | undefined
        const reliquaries = avatar.equipList.filter(item => item.flat.itemType === 'ITEM_RELIQUARY') as EnkaAvatarReliquaryInfoType[]

        return {
          id: avatar.avatarId + '',
          element: showAvatarInfo.energyType ? ElementList[showAvatarInfo.energyType - 1] : ElementEnum.无,
          costumeId: (avatar.costumeId || showAvatarInfo.costumeId || 'default') + '',
          talentIdList: avatar.talentIdList ? avatar.talentIdList.map(id => id + '') : [],
          skillLevelMap: avatar.skillLevelMap,
          fetter: avatar.fetterInfo.expLevel,
          weapon: {
            id: weaponEquip ? weaponEquip.itemId + '' : '',
            level: weaponEquip ? weaponEquip.weapon.level : 0,
            promote: weaponEquip ? weaponEquip.weapon.promoteLevel : 0,
            affix: weaponEquip ? weaponEquip.weapon.affixMap[weaponEquip.itemId + ''] || 0 : 0
          },
          reliquaries: reliquaries.map(r => ({
            id: r.itemId + '',
            level: r.reliquary.level,
            mainPropId: r.reliquary.mainPropId + '',
            appendPropIdList: r.reliquary.appendPropIdList.map(id => id + '')
          })),
        }
      })
    }

    return {
      code: 0, message: '请求成功', data: result
    }
  }
}()

PanelServManage.register(EnkaServ)
