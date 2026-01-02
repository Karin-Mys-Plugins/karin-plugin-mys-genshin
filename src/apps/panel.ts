import { GenshinGame } from '@/core/mys'
import karin from 'node-karin'

export const UpdataPanelData = karin.command(
  new RegExp(`^#?(${GenshinGame.prefixs.join('|')})更新面板$`, 'i'),
  async (e) => {

  }
)
