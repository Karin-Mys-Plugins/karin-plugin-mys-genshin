import { GenshinUIDInfoTableType, GenshinUserInfoDB } from '@/core/database'
import { BaseUserInfoTableType } from 'karin-plugin-mys-core/database'
import { BaseUserInfo, GameUserInfoBase, UidInfoType } from 'karin-plugin-mys-core/mys'

export class GenshinUserInfo extends BaseUserInfo<GenshinUIDInfoTableType & BaseUserInfoTableType> implements GameUserInfoBase<GenshinUIDInfoTableType & BaseUserInfoTableType> {
  get main_uid (): string {
    return this.UserInfo['gs-main']
  }

  get mainUIDInfo (): UidInfoType | undefined {
    return this.getUIDInfo(this.main_uid)
  }

  get bind_uids (): GenshinUIDInfoTableType['gs-uids'] {
    return this.UserInfo['gs-uids']
  }

  getUIDInfo (uid: string): UidInfoType | undefined {
    const bindUid = this.bind_uids[uid]
    if (!bindUid) return undefined

    const ltuidInfo = this.ltuidMap.get(bindUid.ltuid)
    if (!ltuidInfo) return undefined

    return {
      uid,
      userId: this.userId,
      ...ltuidInfo,
    }
  }

  get uidInfoList (): UidInfoType[] {
    const uidInfoList: UidInfoType[] = []

    Object.entries(this.bind_uids).forEach(([uid, bindUid]) => {
      const ltuidInfo = this.ltuidMap.get(bindUid!.ltuid)
      ltuidInfo && uidInfoList.push({
        uid,
        userId: this.userId,
        ...ltuidInfo,
      })
    })

    return uidInfoList
  }

  static async create (userId: string, initAll: boolean = false): Promise<GenshinUserInfo> {
    const userInfo = new GenshinUserInfo(userId)

    userInfo.refresh = async () => {
      const UserInfoData = await (await GenshinUserInfoDB()).findByPk(userId, true)

      await userInfo.initMysAccountInfo(UserInfoData, initAll)

      return userInfo
    }

    return userInfo.refresh()
  }
}
