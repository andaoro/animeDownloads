import React from 'react'
import Header from '../Header/Header'
import './stylesReproductorLayout.css'

export const ReproductorLayout:React.FC<any> = ({children}) => {
  return (
    <div className='AppBodyR'>
        <Header/>
        <div className='ChildrenContainerR'>
            {children}
        </div>
    </div>
  )
}
