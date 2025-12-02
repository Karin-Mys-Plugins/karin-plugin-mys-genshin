import { dir } from '@/dir'
import { Database, DatabaseType, Table } from 'karin-plugin-mys-core/database'
import { TemplateTableType } from '../types'

export const TemplateDB = await new Table<TemplateTableType, DatabaseType.Db, {}>(
  dir.DataDir, 'template_data', DatabaseType.Db
).init({
  pk: Database.PkColumn('STRING'),
  key1: Database.Column('STRING', ''),
  key2: Database.Column('INTEGER', 0),
  object: Database.JsonColumn('object', {}),
  array: Database.ArrayColumn<string>('array', (data) => {
    /** 可在保存前对所有元素进行统一处理 */
    return data
  }),
})
