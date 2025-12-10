import { GenshinGame, GenshinPanel, GenshinUserInfo } from '@/core'
import { Render, ShowBindUIDComponent, ShowBindUIDProps } from '@/template'
import { UidPermission } from 'karin-plugin-mys-core/database'
import karin, { Message, segment } from 'node-karin'

const ShowBindUIDHandlerFuc = async (args: any) => {
  const { e } = args as { e: Message }

  const renderData: ShowBindUIDProps = {
    User: {
      userId: e.userId,
      nickname: e.contact.name,
      avatar: await e.bot.getAvatarUrl(e.userId)
    },
    bindUids: []
  }

  const UserInfo = await GenshinUserInfo.create(e.userId)
  for (const uid in UserInfo.bind_uids) {
    if (UserInfo.bind_uids[uid]!.perm === UidPermission.DEL) continue

    const panelInfo = await GenshinPanel.create(uid)
    renderData.bindUids.push({
      uid,
      level: panelInfo.level,
      worldLevel: panelInfo.worldLevel,
      pfpsId: panelInfo.pfpsId,
      namecardId: panelInfo.namecardId,
      nickname: panelInfo.nickname,
      main: uid === UserInfo.main_uid,
      ...UserInfo.bind_uids[uid]!,
    })
  }

  renderData.bindUids.sort((a, b) => +a.uid - +b.uid)

  const image = await Render.template('ShowBindUID', ShowBindUIDComponent, renderData, {
    type: 'png'
  })
  image && e.reply(segment.image(image))

  return true
}

export const ShowBindUIDHandler = karin.handler(`MYS.${GenshinGame.game}.ShowUID`, ShowBindUIDHandlerFuc)

export const ShowBindUID = karin.command(
  new RegExp(`^#?(${GenshinGame.prefixs.join('|')})uid(列表)?$`, 'i'),
  async (e) => {
    return await ShowBindUIDHandlerFuc({ e })
  }
)
