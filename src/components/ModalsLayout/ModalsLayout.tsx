import React , {ReactNode} from 'react'

type PropsModal = {
    children:ReactNode,
    modalVisible:React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalsLayout:React.FC<PropsModal> = ({children,modalVisible}) => {
  return (
    <div className='fixed w-screen h-screen top-0 z-50 flex items-center justify-center'>
        <div className='w-full h-full bg-gray-200/50 absolute z-10' onClick={()=>modalVisible(false)}></div>
        <section className='z-20 bg-gray-800 p-6'>
            {children}
        </section>
    </div>
  )
}
