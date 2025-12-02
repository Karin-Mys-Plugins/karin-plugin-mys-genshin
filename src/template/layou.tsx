import { Render } from '@/core'
import { React } from 'karin-plugin-mys-core/render'

export interface DefaultLayoutProps {
  children: React.ReactNode
}

export const DefaultLayoutComponent: React.FC<DefaultLayoutProps> = ({
  children
}) => {
  const { plugin, karin } = Render

  return (
    <div
      className='relative flex w-[600px] flex-col pb-10 font-[HYWenHei-55W] text-white'
      id='container'
      style={{ fontFamily: 'HYWenHei-55W, sans-serif' }}
    >
      {children}

      <div className='absolute bottom-0 left-0 flex w-full items-center justify-center bg-black px-0 py-2.5 text-base'>
        <span>Created & nbsp; by & nbsp; Karin </span>
        <strong className='pt-1.5 text-[10px] font-bold text-[#f2c06f]'> v{karin.version} </strong>
        <span> & nbsp;&&& nbsp; {plugin.name} </span>
        <strong className='pt-1.5 text-[10px] font-bold text-[#f2c06f]'> v{plugin.version} </strong>
      </div>
    </div>
  )
}
