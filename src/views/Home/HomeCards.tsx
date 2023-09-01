import React from 'react'
import { URL_IMAGENES } from '../../utils/Helpers'
import { IAnimesDownloadedProps } from './HomeScreen'
import { useNavigate } from 'react-router-dom'

interface IPropsHomeCards {
    anime: IAnimesDownloadedProps
    index:number
}

export const HomeCards: React.FC<IPropsHomeCards> = ({ anime,index }) => {

    const navigate = useNavigate()

    return (
        <div key={index} className="anime_Dowloaded_Card" onClick={() => { navigate(`/anime/${anime.id}/episodes`) }}>
            <img src={`${URL_IMAGENES}${anime.imageUrl}`} className="imgwhhome" />
            <div>
                <p>{anime.title}</p>
            </div>
            <span> {anime.emissionDate ? `Next: ${anime.emissionDate}` : ""}</span>
        </div>
    )
}
