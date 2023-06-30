import React from 'react'
import Header from '../Header/Header'
import './stylesAppLayout.css'

export const AppLayout:React.FC<any> = ({children}) => {
  return (
    <div className='AppBody'>
        <Header/>
        <div className='ChildrenContainer'>
            {children}
        </div>
    </div>
  )
}
