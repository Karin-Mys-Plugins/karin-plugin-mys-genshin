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
      /** @description 名称 */
      nickname: string
      /** @description 等级 */
      level: number
      /** @description 签名 */
      signature: string
      /** @description 世界等级 */
      worldLevel: number
      /** @description 资料名片 ID */
      nameCardId: string
      /** @description 头像 ID */
      profilePictureId: string
    },
    avatarInfoList: (
      {
        /** @description 角色 ID */
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
