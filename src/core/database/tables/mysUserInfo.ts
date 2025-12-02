import { Database, MysUserInfoTable } from 'karin-plugin-mys-core/database'
import { TemplateUIDInfoTableType } from '../types'

export const TemplateUserInfoDB = await MysUserInfoTable.addSchem<TemplateUIDInfoTableType>({
  'template-main': Database.Column('STRING', ''),
  'template-uids': Database.JsonColumn('template-uids', {})
})
