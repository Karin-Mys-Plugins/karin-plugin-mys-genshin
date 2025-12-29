import { ElementEnum } from '@/core/panel'
import { dir } from '@/dir'
import { createTable, DatabaseType } from 'karin-plugin-mys-core/database'
import { common, DefineDataPropEnum } from 'karin-plugin-mys-core/utils'
import { GenshinPanelInfoTableType } from '../types/tables/genshinPanelInfo'

export const GenshinPanelInfoTable = createTable<GenshinPanelInfoTableType>(
  dir.DataDir, 'genshin_panel_data', DatabaseType.File, 'uid'
)

export const GenshinPanelInfoDB = await GenshinPanelInfoTable.init(
  {
    prop: DefineDataPropEnum.Object,
    default: {
      uid: common.DefineValve(''),
      nickname: common.DefineValve('旅行者'),
      level: common.DefineValve(1),
      worldLevel: common.DefineValve(0),
      pfpsId: common.DefineValve(''),
      namecardId: common.DefineValve(''),
      avatarInfo: {
        prop: DefineDataPropEnum.OArray,
        default: {},
        defaultItem: {
          prop: DefineDataPropEnum.Object,
          default: {
            id: common.DefineValve(''),
            elements: {
              prop: DefineDataPropEnum.Array,
              default: [],
              defaultItem: {
                prop: DefineDataPropEnum.Object,
                default: {
                  element: common.DefineValve(ElementEnum.无),
                  costumeId: common.DefineValve(''),
                  talentIdList: {
                    prop: DefineDataPropEnum.Array,
                    default: [],
                    defaultItem: {
                      prop: DefineDataPropEnum.Value,
                      type: 'string',
                      default: ''
                    }
                  },
                  skillLevelMap: {
                    prop: DefineDataPropEnum.OArray,
                    default: {},
                    defaultItem: {
                      prop: DefineDataPropEnum.Value,
                      type: 'number',
                      default: 0
                    }
                  },
                  weapon: {
                    prop: DefineDataPropEnum.Object,
                    default: {
                      id: common.DefineValve(''),
                      level: common.DefineValve(1),
                      promote: common.DefineValve(0),
                      affix: common.DefineValve(0),
                    }
                  },
                  reliquaries: {
                    prop: DefineDataPropEnum.Array,
                    default: [],
                    defaultItem: {
                      prop: DefineDataPropEnum.Object,
                      default: {
                        id: common.DefineValve(''),
                        level: common.DefineValve(1),
                        mainPropId: common.DefineValve(''),
                        appendPropIdList: {
                          prop: DefineDataPropEnum.Array,
                          default: [],
                          defaultItem: {
                            prop: DefineDataPropEnum.Value,
                            type: 'string',
                            default: ''
                          }
                        }
                      }
                    }
                  },
                  fetter: common.DefineValve(0),
                  source: common.DefineValve(''),
                  update: common.DefineValve(Date.now),
                }
              },
              required: ['element']
            }
          },
          required: ['id', 'elements'],
        }
      }
    },
    required: ['uid']
  }
)
