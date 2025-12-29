import { MysAccountType } from 'karin-plugin-mys-core/database'

export const enum ResourceSourceEnum {
  UnSet = '',
  GitHub = 'github',
  GitHubProxy = 'github-proxy',
  GitCode = 'gitcode',
  Custom = 'custom'
}

export const enum ResourceTypeEnum {
  BaseRes = 'base-res',
  PanelRes = 'panel-res'
}

export interface ResourceConfigItemType {
  source: ResourceSourceEnum
  customUrl: string
}

export interface DefaultConfigType {
  panel: {
    source: Record<MysAccountType, string>
    proxy: boolean
  }
  resources: Record<ResourceTypeEnum, ResourceConfigItemType>
}

export interface DefaultConfigDefineType {

}
