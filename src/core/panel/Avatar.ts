import { Character } from './Character'
import { checkMetaID } from './metaData'
import { AvatarMetaId, ElementEnum } from './types'

export class Avatar<E extends ElementEnum> {
  /** 角色 ID */
  id: AvatarMetaId

  char: Character<E>

  constructor (id: string, element: E) {
    this.id = checkMetaID(id)

    this.char = new Character(this.id, element)
  }

  get name () {
    return this.char.name
  }
}
