import { ElementEnum, ElementReactionEnum } from '../types'

export const ReactionTypeMap: Record<Exclude<ElementReactionEnum, 'phy'>, {
  title: string
  type: 'pct' | 'shield' | 'fusion' | 'bonus' | 'lunar'
  num: (args: { element: ElementEnum }) => number
}> = {
  // 增幅反应
  [ElementReactionEnum.蒸发]: { type: 'pct', num: ({ element }) => element === ElementEnum.水 ? 2 : 1.5, title: '蒸发' },
  [ElementReactionEnum.融化]: { type: 'pct', num: ({ element }) => element === ElementEnum.火 ? 2 : 1.5, title: '融化' },
  // 结晶护盾
  [ElementReactionEnum.结晶]: { type: 'shield', num: () => 1, title: '结晶' },
  // 剧变反应
  [ElementReactionEnum.燃烧]: { type: 'fusion', num: () => 1, title: '燃烧' },
  [ElementReactionEnum.超导]: { type: 'fusion', num: () => 6, title: '超导' },
  [ElementReactionEnum.扩散]: { type: 'fusion', num: () => 2.4, title: '扩散' },
  [ElementReactionEnum.感电]: { type: 'fusion', num: () => 8, title: '感电' },
  [ElementReactionEnum.碎冰]: { type: 'fusion', num: () => 12, title: '碎冰' },
  [ElementReactionEnum.超载]: { type: 'fusion', num: () => 11, title: '超载' },
  [ElementReactionEnum.绽放]: { type: 'fusion', num: () => 8, title: '绽放' },
  [ElementReactionEnum.烈绽放]: { type: 'fusion', num: () => 12, title: '烈绽放' },
  [ElementReactionEnum.超绽放]: { type: 'fusion', num: () => 12, title: '超绽放' },
  // 激化反应
  [ElementReactionEnum.超激化]: { type: 'bonus', num: () => 4.6, title: '超激化' },
  [ElementReactionEnum.蔓激化]: { type: 'bonus', num: () => 5.0, title: '蔓激化' },
  // 月反应
  [ElementReactionEnum.月绽放]: { type: 'lunar', num: () => 8, title: '月绽放' },
  [ElementReactionEnum.月感电]: { type: 'lunar', num: () => 7.2, title: '月感电' }
}

export const ReactionTypeMeta = new class {
  #map: Record<Exclude<ElementReactionEnum, 'phy'>, {
    title: string
    type: 'pct' | 'shield' | 'fusion' | 'bonus' | 'lunar'
    num: (element: ElementEnum) => number
  }> = {
      // 增幅反应
      [ElementReactionEnum.蒸发]: { type: 'pct', num: (element) => element === ElementEnum.水 ? 2 : 1.5, title: '蒸发' },
      [ElementReactionEnum.融化]: { type: 'pct', num: (element) => element === ElementEnum.火 ? 2 : 1.5, title: '融化' },
      // 结晶护盾
      [ElementReactionEnum.结晶]: { type: 'shield', num: () => 1, title: '结晶' },
      // 剧变反应
      [ElementReactionEnum.燃烧]: { type: 'fusion', num: () => 1, title: '燃烧' },
      [ElementReactionEnum.超导]: { type: 'fusion', num: () => 6, title: '超导' },
      [ElementReactionEnum.扩散]: { type: 'fusion', num: () => 2.4, title: '扩散' },
      [ElementReactionEnum.感电]: { type: 'fusion', num: () => 8, title: '感电' },
      [ElementReactionEnum.碎冰]: { type: 'fusion', num: () => 12, title: '碎冰' },
      [ElementReactionEnum.超载]: { type: 'fusion', num: () => 11, title: '超载' },
      [ElementReactionEnum.绽放]: { type: 'fusion', num: () => 8, title: '绽放' },
      [ElementReactionEnum.烈绽放]: { type: 'fusion', num: () => 12, title: '烈绽放' },
      [ElementReactionEnum.超绽放]: { type: 'fusion', num: () => 12, title: '超绽放' },
      // 激化反应
      [ElementReactionEnum.超激化]: { type: 'bonus', num: () => 4.6, title: '超激化' },
      [ElementReactionEnum.蔓激化]: { type: 'bonus', num: () => 5.0, title: '蔓激化' },
      // 月反应
      [ElementReactionEnum.月绽放]: { type: 'lunar', num: () => 8, title: '月绽放' },
      [ElementReactionEnum.月感电]: { type: 'lunar', num: () => 7.2, title: '月感电' }
    }

  getMultiple (reaction: string, mastery = 0) {
    const typeCfg = this.#map[reaction as Exclude<ElementReactionEnum, 'phy'>]

    switch (typeCfg?.type) {
      case 'pct':
        return (25 / 9) * mastery / (mastery + 1400)
      case 'fusion':
        return 16 * mastery / (mastery + 2000)
      case 'lunar':
        return 6 * mastery / (mastery + 2000)
      case 'bonus':
        return 5 * mastery / (mastery + 1200)
      case 'shield':
        return (40 / 9) * mastery / (mastery + 1400)
      default:
        return 0
    }
  }

  getBasePct (reaction: string, element: ElementEnum) {
    const typeCfg = this.#map[reaction as Exclude<ElementReactionEnum, 'phy'>]
    if (typeCfg) {
      return typeCfg.num(element) || 1
    }
    return 1
  }
}()

// 各等级精通基础伤害
export const MasteryBaseDmg = [
  0,
  4.291, 4.634, 4.976, 5.319, 5.661, 6.162, 6.660, 7.217, 7.842, 8.536,
  9.300, 10.165, 11.112, 12.141, 13.437, 14.770, 16.105, 17.431, 18.781, 20.146,
  21.528, 22.926, 24.311, 25.703, 27.102, 28.300, 29.526, 30.745, 32.432, 34.073,
  35.668, 37.257, 38.854, 40.456, 42.277, 44.130, 46.018, 47.927, 49.889, 51.846,
  53.850, 56.041, 58.376, 60.838, 64.016, 67.136, 70.382, 73.753, 77.267, 80.900,
  84.189, 87.633, 91.121, 94.655, 99.650, 104.100, 108.597, 113.238, 118.152, 123.221,
  128.392, 134.776, 141.378, 148.135, 156.111, 162.868, 169.874, 176.949, 184.168, 191.410,
  198.693, 206.169, 212.789, 219.436, 228.557, 236.687, 244.853, 252.806, 261.198, 269.361,
  277.499, 285.744, 294.092, 302.546, 313.459, 322.238, 331.371, 340.864, 351.274, 361.713,
  0, 0, 0, 0, 390.367, 0, 0, 0, 0, 418.522
]

// 各等级结晶护盾基础吸收量
export const cryBaseDmg = [
  0,
  91.18, 98.71, 106.24, 113.76, 121.29, 128.82, 136.35, 143.88, 151.41, 158.94,
  169.99, 181.08, 192.19, 204.05, 215.94, 227.86, 247.69, 267.54, 287.43, 303.83,
  320.23, 336.63, 352.32, 368.01, 383.70, 394.43, 405.18, 415.95, 426.74, 437.54,
  450.60, 463.70, 476.85, 491.13, 502.55, 514.01, 531.41, 549.98, 568.58, 585.00,
  605.67, 626.39, 646.05, 665.76, 685.50, 700.84, 723.33, 745.87, 768.44, 786.79,
  809.54, 832.33, 855.16, 878.04, 899.48, 919.36, 946.04, 974.76, 1003.58, 1030.08,
  1056.64, 1085.25, 1113.92, 1149.26, 1178.06, 1200.22, 1227.66, 1257.24, 1284.92, 1314.75,
  1342.67, 1372.75, 1396.32, 1427.31, 1458.37, 1482.34, 1511.91, 1541.55, 1569.15, 1596.15,
  1622.42, 1648.07, 1666.38, 1684.68, 1702.98, 1726.10, 1754.67, 1785.87, 1817.14, 1851.06
]
