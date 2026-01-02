import { GenshinPanelInfoAvatarElementInfoType } from '@/core/database'
import { MysAccountType } from 'karin-plugin-mys-core/database'
import { UidInfoType } from 'karin-plugin-mys-core/mys'
import { ElementEnum } from './panel'

export interface PanelServResponseType {
  code: number
  message: string
  data?: {
    uid: string
    playerInfo: {
      /** 名称 */
      nickname: string
      /** 等级 */
      level: number
      /** 签名 */
      signature: string
      /** 世界等级 */
      worldLevel: number
      /** 资料名片 ID */
      nameCardId: string
      /** 头像 ID */
      profilePictureId: string
    },
    avatarInfoList: (
      {
        /** 角色 ID */
        id: string
      } & GenshinPanelInfoAvatarElementInfoType<ElementEnum>
    )[]
  }
}

export declare class PanelServ {
  name: string

  key: string

  Support: MysAccountType[]

  request: (uidInfo: UidInfoType) => Promise<PanelServResponseType>
}
