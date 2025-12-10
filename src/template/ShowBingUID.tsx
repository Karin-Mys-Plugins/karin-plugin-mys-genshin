import { getNamecardImage, getPfpsImage } from '@/core'
import { UidPermission } from 'karin-plugin-mys-core/database'
import { DefaultLayoutComponent, React } from 'karin-plugin-mys-core/render'
import { Render } from './render'

export interface UserPropType {
  userId: string
  avatar: string
  nickname: string
}

export interface bindUidInfoItemType {
  uid: string
  perm: UidPermission
  main: boolean

  level: number
  worldLevel: number

  pfpsId: string
  namecardId: string

  nickname: string
}

export interface ShowBindUIDProps {
  User: UserPropType
  bindUids: bindUidInfoItemType[]
}

export const ShowBindUIDComponent: React.FC<ShowBindUIDProps> = ({
  User, bindUids
}) => {
  const plugin = Render.plugin

  return (
    <DefaultLayoutComponent
      bg='bg-[#f6f0e6]' width='w-[500px]' mysPlugin={plugin.genshin}
    >
      <div className='w-full px-[18px] pb-9 pt-5'>
        {/* 右上角 logo */}
        <div
          className='absolute -top-2.5 right-0 z-[5] h-[72px] w-[150px] bg-contain bg-center bg-no-repeat opacity-50'
          style={{ backgroundImage: `url('${plugin.resources.default}/image/genshin-logo.webp')` }}
        />

        {/* 用户信息 */}
        <div className='mb-3 flex items-center gap-2.5 w-[75%]'>
          <img
            className='h-10 w-10 flex-none rounded-full object-cover border-2 border-white'
            src={User.avatar}
          />
          <span className='min-w-0 overflow-anywhere break-words text-sm text-[#222]'>
            {User.nickname} ({User.userId})
          </span>
        </div>

        {/* UID 列表 */}
        <div className='space-y-3 bg-white/80 p-3 rounded-md shadow-sm'>
          {bindUids.map((item, index) => {
            return (
              <div
                key={item.uid}
                className='relative overflow-hidden rounded-md py-4 pr-6 pl-2 shadow-sm bg-cover bg-center'
                style={{ backgroundImage: `url('${getNamecardImage(item.namecardId)}')`, }}
              >
                <div className='absolute inset-0 bg-white/35 backdrop-blur-[1px]' />

                {/* 背景虚化的世界等级 */}
                {/* <div className='absolute left-[65%] top-[55%] -translate-x-1/2 -translate-y-1/2 text-8xl font-bold text-gray-300/50'>
                  {item.worldLevel}
                </div> */}

                {/* 右上角权限标识 */}
                <div className='absolute right-2 top-1 z-20 flex items-center gap-1.5'>
                  {item.perm >= 1 && (
                    <div className='rounded bg-blue-500 px-1.5 py-0.5 text-[7px] font-medium text-white shadow-sm'>
                      Cookie
                    </div>
                  )}
                  {item.perm >= 2 && (
                    <div className='rounded bg-purple-500 px-1.5 py-0.5 text-[7px] font-medium text-white shadow-sm'>
                      Stoken
                    </div>
                  )}
                </div>

                {/* 内容区域 */}
                <div className='relative z-10 flex items-center gap-3'>
                  {/* 左侧：序号 */}
                  <div className='flex h-8 w-8 flex-none items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white shadow-sm'>
                    {index + 1}
                  </div>

                  {/* 头像 */}
                  <img
                    className='h-12 w-12 flex-none rounded-full border-2 border-white object-cover shadow-sm bg-white/75'
                    src={`${getPfpsImage(item.pfpsId)}`}
                  />

                  {/* 中间信息区 */}
                  <div className='min-w-0 flex-1'>
                    {/* 第一行：昵称 */}
                    <div className='mb-1'>
                      <span className='overflow-anywhere break-words text-base font-semibold text-[#333]'>
                        {item.nickname}
                      </span>
                    </div>

                    {/* 第二行：UID 和等级 */}
                    <div className='flex items-center gap-3 text-xs text-gray-600'>
                      <span className='font-mono'>UID: {item.uid}</span>
                      <span className='rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-700'>
                        Lv.{item.level}
                      </span>
                    </div>
                  </div>

                  {/* 右侧：主账号标记 */}
                  {item.main && (
                    <img
                      className='h-10 w-10 flex-none object-contain ml-1'
                      src={`${plugin.resources.default}/image/paimon.webp`}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </DefaultLayoutComponent>
  )
}
