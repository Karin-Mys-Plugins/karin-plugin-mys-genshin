import { AvatarMetaDataType } from '../types'

export class Avatar {
  /** @description 角色 ID */
  id: string

  avatarData: AvatarMetaDataType

  constructor (id: string) {
    this.id = id

    this.avatarData = {} as AvatarMetaDataType
  }
}
