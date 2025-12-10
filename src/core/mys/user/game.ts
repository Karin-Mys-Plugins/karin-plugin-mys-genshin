import { GAME, GenshinUIDInfoTableType } from '@/core/database'
import { BaseUserInfoTableType, MysAccountType } from 'karin-plugin-mys-core/database'
import { MysGame, RegisterGameBase } from 'karin-plugin-mys-core/mys'
import { GenshinPanel } from '../panel'
import { GenshinRegionType } from '../types'
import { GenshinUserInfo } from './user'

export const GenshinGame = new RegisterGameBase<GenshinUIDInfoTableType & BaseUserInfoTableType>(
  GAME, '原神', ['原神', GAME, 'genshin'], GenshinUserInfo, async (GameRoleList) => {
    const uids: string[] = []

    for (const GameRole of GameRoleList) {
      if (GameRole.game_biz === GenshinBiz[MysAccountType.cn] || GameRole.game_biz === GenshinBiz[MysAccountType.os]) {
        uids.push(GameRole.game_uid)

        const panelInfo = await GenshinPanel.create(GameRole.game_uid)
        panelInfo.nickname = GameRole.nickname
        panelInfo.level = GameRole.level

        await panelInfo.save(false)
      }
    }

    return uids
  }
)

MysGame.RegisterGame(GenshinGame)

export const GenshinBiz = {
  [MysAccountType.cn]: 'hk4e_cn',
  [MysAccountType.os]: 'hk4e_global',
}

export const GenshinRegion: GenshinRegionType[] = [
  { region: 'cn_gf01', name: '天空岛', type: MysAccountType.cn },
  { region: 'cn_qd01', name: '世界树', type: MysAccountType.cn },
  ...['os_usa', 'os_euro', 'os_asia', 'os_cht'].map((region, idx) => {
    return { region, name: ['美服', '欧服', '亚服', '港澳台'][idx], type: MysAccountType.os }
  })
]

export const matchRegion = (uid: string): GenshinRegionType => {
  switch (uid.slice(0, -8)) {
    case '5':
      return GenshinRegion[1]
    case '6':
      return GenshinRegion[2]
    case '7':
      return GenshinRegion[3]
    case '8':
    case '18':
      return GenshinRegion[4]
    case '9':
      return GenshinRegion[5]
    default:
      return GenshinRegion[0]
  }
}
