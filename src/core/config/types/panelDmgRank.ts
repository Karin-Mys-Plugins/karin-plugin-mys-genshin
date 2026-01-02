import { AvatarMetaId } from '@/core/panel'

export interface PanelDmgRankConfigType {
  avatars: Record<AvatarMetaId, {
    calcTitle: string
  }>
}
