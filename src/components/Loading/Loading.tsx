import React from 'react'
import './stylesLoading.css'
import { Herta } from '../../utils/Assets'

export const Loading:React.FC = () => {
    return (
        <div className='loadingContainer'>
            <div className='loadingBackground'></div>
            <div className='loadingGif'>
                <img src={Herta} />
                <span>Cargando...</span>
            </div>
        </div>
    )
}
