import React, { useEffect, useState } from 'react'
import { URL_IMAGENES } from '../../utils/Helpers'
import { IAnimesDownloadedProps } from './HomeScreen'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';


interface IPropsHomeCards {
    anime: IAnimesDownloadedProps
    index: number
}

const FormatedFecha = (fecha: string) => {
    // Parsea la fecha en formato ISO
    const fechaISO = parseISO(fecha);

    // Formatea la fecha en el formato deseado (mes y día de la semana)
    const fechaFormateada = format(fechaISO, 'EEEE dd MMMM',{locale:es});

    return fechaFormateada;
}

export const HomeCards: React.FC<IPropsHomeCards> = ({ anime, index }) => {

    const navigate = useNavigate()

    return (
        <div key={index} className="anime_Dowloaded_Card relative" onClick={() => { navigate(`/anime/${anime.id}/episodes`) }}>
            <img src={`${URL_IMAGENES}${anime.imageUrl}`} className="imgwhhome" />
            <div>
                <p>{anime.title}</p>
            </div>
            <span className='flex align-bottom'> {anime.emissionDate ? `${FormatedFecha(anime.emissionDate)}` : ""}</span>
        </div>
    )
}
