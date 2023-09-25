import React, { useEffect, useState } from 'react'
import { URL_IMAGENES } from '../../utils/Helpers'
import { IAnimesDownloadedProps } from './HomeScreen'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { AiFillHeart } from "react-icons/ai";
import { useAlerts } from '../../hooks/useAlerts';
import { AgregarAlerta } from '../../utils/Helpers';


interface IPropsHomeCards {
    anime: IAnimesDownloadedProps
    index: number
}

const FormatedFecha = (fecha: string) => {
    // Parsea la fecha en formato ISO
    const fechaISO = parseISO(fecha);

    // Formatea la fecha en el formato deseado (mes y día de la semana)
    const fechaFormateada = format(fechaISO, 'EEEE dd MMMM', { locale: es });

    return fechaFormateada;
}

export const HomeCards: React.FC<IPropsHomeCards> = ({ anime, index }) => {

    const navigate = useNavigate()
    const { alertas, createNewAlert } = useAlerts()

    return (
        <div className='relative'>
            <div key={index} className="anime_Dowloaded_Card relative hover:cursor-pointer hover:bg-Tsecondary/20 group p-3 group" onClick={() => { navigate(`/anime/${anime.id}/episodes`) }}>
                <img src={`${URL_IMAGENES}${anime.imageUrl}`} className="w-[300px] h-[370px] object-cover opacity-80 group-hover:opacity-100" />
                <div className='flex flex-col justify-between h-full py-2'>
                    <p className=' text-white group-hover:text-Rsecondary transition-all duration-300 text-start'>{anime.title}</p>
                    <span className='flex align-bottom text-Tsecondary text-xs'> {anime.emissionDate ? `${FormatedFecha(anime.emissionDate)}` : ""}</span>
                </div>

            </div>
            <span
                className='absolute top-4 left-4 z-20 text-gray-90 hover:text-red-600'
                onClick={() => {
                    AgregarAlerta(createNewAlert, `${anime.title} se ha agregado a favoritos`, 'success2')
                }}
            >
                <AiFillHeart size={25} />
            </span>
            {alertas}
        </div>

    )
}
