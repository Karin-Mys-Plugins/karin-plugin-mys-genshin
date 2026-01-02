import { ElementEnum } from './panel'

export interface AvatarCostumeItemType {
  SideIcon: string
  Icon: string
  GachaIcon: string
}

export interface AvatarElementItemType {
  Element: ElementEnum
  Consts: string[]
  Skills: Record<string, string>
}

export interface AvatarResourceDataItemType {
  Id: string
  Elements: AvatarElementItemType[]
  Costumes: {
    default: AvatarCostumeItemType
    [costumeId: string]: AvatarCostumeItemType
  }
}
