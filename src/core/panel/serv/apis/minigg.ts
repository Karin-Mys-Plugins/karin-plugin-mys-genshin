import { MysAccountType } from 'karin-plugin-mys-core/database'
import { UidInfoType } from 'karin-plugin-mys-core/mys'
import { PanelServ } from '../../types'
import { PanelServHeaders, PanelServManage, RequestPanelData } from '../manage'
import { EnkaDataType, EnkaServ } from './enka'

const MiniGGServ = new class MiniGG implements PanelServ {
  key = 'MiniGG'
  name = 'MiniGG-Api'
  Support = [MysAccountType.cn]

  async request (uidInfo: UidInfoType) {
    const result = await RequestPanelData<EnkaDataType>(new URL(`http://profile.microgg.cn/api/uid/${uidInfo.uid}`), 'GET', PanelServHeaders)

    if (!result) {
      return {
        code: -1,
        message: `请求${this.name}面板数据失败，未获取到数据`
      }
    }

    return EnkaServ.ProcessResult(uidInfo.uid, result)
  }
}()

PanelServManage.register(MiniGGServ)
