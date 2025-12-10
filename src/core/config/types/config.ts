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
  [ResourceTypeEnum.BaseRes]: ResourceConfigItemType
  [ResourceTypeEnum.PanelRes]: ResourceConfigItemType
}

export interface DefaultConfigDefineType {

}
