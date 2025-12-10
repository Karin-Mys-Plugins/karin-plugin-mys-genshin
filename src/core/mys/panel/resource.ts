import { Render } from '@/template'
import { absPath, requireFileSync, watch } from 'node-karin'
import lodash from 'node-karin/lodash'
import path from 'node:path'
import { AvatarCostumeItemType, AvatarElementItemType, AvatarResourceDataItemType, ElementEnum } from '../types'

const avatars = requireFileSync<AvatarResourceDataItemType[]>(`${Render.plugin.resources.default}/panel/avatars.json`)
const AvatarBaseResMap: Map<string, AvatarResourceDataItemType> = new Map(avatars.map(avt => [avt.Id, avt]))
watch(`${Render.plugin.resources.default}/panel/avatars.json`, () => {
  AvatarBaseResMap.clear()

  const avatars = requireFileSync<AvatarResourceDataItemType[]>(`${Render.plugin.resources.default}/panel/avatars.json`)

  avatars.forEach(avt => AvatarBaseResMap.set(avt.Id, avt))
})

export class AvatarBaseRes {
  Id: AvatarResourceDataItemType['Id']

  #Elements: Map<ElementEnum, AvatarElementItemType> = new Map()

  #Costumes: Map<string, AvatarCostumeItemType> = new Map()

  constructor (avatarRes: AvatarResourceDataItemType) {
    this.Id = avatarRes.Id

    avatarRes.Elements.forEach(element => {
      this.#Elements.set(element.Element, element)
    })

    lodash.forEach(avatarRes.Costumes, (costume, costumeId) => {
      this.#Costumes.set(costumeId, costume)
    })
  }

  static FromId (avatarId: string): AvatarBaseRes | null {
    const avatarRes = AvatarBaseResMap.get(avatarId)
    if (!avatarRes) return null

    return new AvatarBaseRes(avatarRes)
  }

  Resouce (element: ElementEnum) {
    const ElementRes = this.#Elements.get(element)

    return {
      Const: (cons: number) => {
        if (!ElementRes) return ''

        const consImage = ElementRes.Consts[cons]

        return absPath(path.join(Render.plugin['download-base-res'].path, 'avatars', this.Id, 'elements', element, 'consts', `${path.parse(consImage).name}.webp`))
      },
      Skills: (SkillId: string) => {
        if (!ElementRes) return ''

        const skillImage = ElementRes.Skills[SkillId]

        return absPath(path.join(Render.plugin['download-base-res'].path, 'avatars', this.Id, 'elements', element, 'skills', `${path.parse(skillImage).name}.webp`))
      }
    }
  }

  Costume (CostumeId: string = 'default'): AvatarCostumeItemType {
    const CostumeRes = this.#Costumes.get(CostumeId) || this.#Costumes.get('default')!

    const CostumeDir = absPath(path.join(Render.plugin['download-base-res'].path, this.Id, 'costumes', CostumeId))

    return {
      Icon: `${CostumeDir}/${path.parse(CostumeRes.Icon).name}.webp`,
      SideIcon: `${CostumeDir}/${path.parse(CostumeRes.SideIcon).name}.webp`,
      GachaIcon: `${CostumeDir}/${path.parse(CostumeRes.GachaIcon).name}.webp`,
    }
  }
}

const pfps = requireFileSync<Record<string, { IconPath: string }>>(`${Render.plugin.resources.default}/panel/pfps.json`)
const pfpsMap: Map<string, { IconPath: string }> = new Map(Object.entries(pfps))
watch(`${Render.plugin.resources.default}/panel/pfps.json`, () => {
  pfpsMap.clear()

  const pfps = requireFileSync<Record<string, { IconPath: string }>>(`${Render.plugin.resources.default}/panel/pfps.json`)

  Object.entries(pfps).forEach(([key, value]) => pfpsMap.set(key, value))
})

export const getPfpsImage = (pfpsId: string): string => {
  const pfp = pfpsMap.get(pfpsId)
  if (!pfp) {
    return absPath(path.join(Render.plugin.resources.default, 'image', 'face.webp'))
  }

  return absPath(path.join(Render.plugin['download-base-res'].path, 'pfps', `${path.parse(pfp.IconPath).name}.webp`))
}

const namecards = requireFileSync<Record<string, { Icon: string }>>(`${Render.plugin.resources.default}/panel/namecards.json`)
const namecardsMap: Map<string, { Icon: string }> = new Map(Object.entries(namecards))
watch(`${Render.plugin.resources.default}/panel/namecards.json`, () => {
  namecardsMap.clear()

  const namecards = requireFileSync<Record<string, { Icon: string }>>(`${Render.plugin.resources.default}/panel/namecards.json`)

  Object.entries(namecards).forEach(([key, value]) => namecardsMap.set(key, value))
})

export const getNamecardImage = (namecardId: string): string => {
  const namecard = namecardsMap.get(namecardId)
  if (!namecard) {
    return absPath(path.join(Render.plugin.resources.default, 'image', 'namecard.webp'))
  }

  return absPath(path.join(Render.plugin['download-base-res'].path, 'namecards', `${path.parse(namecard.Icon).name}.webp`))
}
