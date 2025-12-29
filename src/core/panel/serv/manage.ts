import { Cfg } from '@/core/config'
import { matchRegion } from '@/core/mys'
import { dir } from '@/dir'
import { UidInfoType } from 'karin-plugin-mys-core/mys'
import { logger } from 'node-karin'
import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from 'node-karin/axios'
import { PanelServ, PanelServResponseType } from '../types'

export const PanelServManage = new class PanelServManage {
  #ApiMap = new Map<string, PanelServ>()

  register (serv: PanelServ) {
    this.#ApiMap.set(serv.key, serv)
  }

  async request (uidInfo: UidInfoType, source?: string): Promise<PanelServResponseType> {
    const region = matchRegion(uidInfo.uid)
    const _source = source || Cfg.get(`panel.source.${region.type}`)

    const panelApi = this.#ApiMap.get(_source)

    if (!panelApi) {
      return {
        code: -1,
        message: `未找到对应的面板服务：${_source}`
      }
    }

    if (!panelApi.Support.includes(region.type)) {
      return {
        code: -1,
        message: `面板服务：${panelApi.name} 不支持UID(${uidInfo.uid})所属的区服`
      }
    }

    return panelApi.request(uidInfo)
  }
}()

export const PanelServHeaders = new AxiosHeaders({
  'User-Agent': 'Karin-Mys-Genshin/1.0.0'
})

export async function RequestPanelData<T extends any> (Url: URL, Method: 'GET', Headers: AxiosHeaders, Body?: any): Promise<T | null>
export async function RequestPanelData<T extends any> (Url: URL, Method: 'POST', Headers: AxiosHeaders, Body: any): Promise<T | null>
export async function RequestPanelData<T extends any> (Url: URL, Method: 'GET' | 'POST', Headers: AxiosHeaders, Body?: any): Promise<T | null> {
  const params: AxiosRequestConfig = {
    url: Url.href, method: Method, data: Body, headers: Headers
  }

  const start = Date.now()
  let response: AxiosResponse<any, any>
  try {
    if (Method === 'GET') {
      response = await axios.get(params.url!, {
        headers: params.headers
      })
    } else if (Method === 'POST') {
      response = await axios.post(params.url!, params.data, {
        headers: params.headers
      })
    } else {
      response = await axios.request(params)
    }
  } catch (err) {
    logger.debug(`[${dir.name}] requst-error(${logger.green(`${Date.now() - start}ms`)}): ${JSON.stringify(params, null, 2)}`, err)

    return null
  }

  return response.data
}
