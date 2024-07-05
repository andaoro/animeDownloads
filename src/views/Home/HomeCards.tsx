import React, { useEffect, useState } from 'react'
import { URL_IMAGENES } from '../../utils/Helpers'
import { IAnimesDownloadedProps } from './HomeScreen'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { AiFillHeart } from "react-icons/ai";
import { useAlerts } from '../../hooks/useAlerts';
import { AgregarAlerta } from '../../utils/Helpers';
import PATHS from '../../routers/CONSTPATHS';
import { NavigateEpisodes } from '../../utils/navigates/NavigateEpisodes';


interface IPropsHomeCards {
    anime: IAnimesDownloadedProps
}

const FormatedFecha = (fecha: string) => {
    // Parsea la fecha en formato ISO
    const fechaISO = parseISO(fecha);

    // Formatea la fecha en el formato deseado (mes y día de la semana)
    const fechaFormateada = format(fechaISO, 'EEEE dd MMMM', { locale: es });

    return fechaFormateada;
}

export const HomeCards: React.FC<IPropsHomeCards> = ({ anime }) => {

    const navigate = useNavigate()
    const { alertas, createNewAlert } = useAlerts()

    return (
        <div className='h-96 w-64 relative group cursor-pointer'>
            <div className="h-96 w-64 relative group cursor-pointer" onClick={() => { NavigateEpisodes(navigate, anime.id, anime.title) }}>
                <img
                    src={`${URL_IMAGENES}${anime.imageUrl}`}
                    alt="Imagen de portada"
                    className="w-full h-full brightness-75 opacity-80 group-hover:brightness-100 hover:scale-105 transition-all rounded"
                />
                <span className="absolute bottom-4 mx-4 font-bold cursor-pointer group-hover:bottom-2 transition-all pointer-events-none">{anime.title}</span>
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
