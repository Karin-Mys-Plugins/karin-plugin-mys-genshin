import { TemplateUIDInfoTableType } from '@/core/database'
import { BaseUserInfoTableType } from 'karin-plugin-mys-core/database'
import { MysGame, RegisterGameBase } from 'karin-plugin-mys-core/mys'
import { TemplateUserInfo } from './user'

const TemplateGame = new RegisterGameBase<TemplateUIDInfoTableType & BaseUserInfoTableType>(
  'template', '崩坏：因缘精灵', /temp/i, TemplateUserInfo, (info) => {
    const uids: string[] = []

    info.forEach(item => {
      if (item.game_biz === 'template') {
        uids.push(item.game_uid)
      }
    })

    return uids
  }
)

MysGame.RegisterGame(TemplateGame)
