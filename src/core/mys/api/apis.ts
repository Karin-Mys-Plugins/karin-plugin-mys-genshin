import { MysAccountType } from 'karin-plugin-mys-core/database'
import { BaseMysRes, DefineApi, MysHosts } from 'karin-plugin-mys-core/mys'

export const templateApi = new DefineApi<
  /** Api请求response */
  BaseMysRes & {
    data: {}
  },
  /** data数据 */
  { test: string },
  /** UID相关 */
  { cookie: string }
>((self, data) => ({
  Url: new URL(MysHosts.hk4e[MysAccountType.cn] + `template/api?test=${data.test}`),
  Method: 'POST',
  Body: {
    test: data.test,
  },
  HeaderFn: self.CookieHeaders,
  Result: async (response) => {
    const newData = response.data
    /** 在这里可对数据进行处理 */
    return {
      data: newData,
      row: response.data,
    }
  }
}))

/**
 * 使用示例
 * data Api response数据
 * check recode检查
 */
const { data, check } = await templateApi.init({ cookie: 'your_cookie' }).request({ test: 'test_value' })

/** 优先使用缓存 */
const res = await templateApi.init({ cookie: 'your_cookie' }).requestCache('templateApi:id', 60, { test: 'test_value' })

/** 需要使用CookieHeaders或者device_fp */
const res = await (await templateApi.initDevice({ cookie: 'your_cookie' }, true)).request({ test: 'test_value' })
