import React from 'react'
import Header from '../Header/Header'
import './stylesAppLayout.css'

export const AppLayout:React.FC<any> = ({children}) => {
  return (
    <div className='AppBody bg-default'>
        <Header/>
        <div className='ChildrenContainer pb-12'>
            {children}
        </div>
    </div>
  )
}
