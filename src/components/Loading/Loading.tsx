import React from 'react'
import Herta from '../../assets/gifs/herta-loading.gif'
import './stylesLoading.css'

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
