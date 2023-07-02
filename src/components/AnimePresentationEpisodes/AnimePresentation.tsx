import React from 'react'
import { IObjectData, IElementsData } from '../../views/AnimeEpisodesView/AnimeEpisodesView'
import './stylesPresentacion.css'
import { BsPlay } from "react-icons/bs";
import { MdAdd } from "react-icons/md";

interface IAnimeData {
    data: IObjectData
    capitulos:IElementsData[]
}

export const AnimePresentation: React.FC<IAnimeData> = ({ data,capitulos }) => {


    return (
        <div className='Presentacion_container'>
            <div className='backgroundPresentacion'></div>
            <div className='Presentacion_imagen_container'>
                <img src={`https://animedownloader.jmarango.co${data.imageUrl}`}/>
                <p style={{fontSize:"12px"}}>{data.title}</p>
            </div>
            <div className='presentacion_capview'>
                <div className='presentacion_capview_imagen'>
                    <img src={`https://animedownloader.jmarango.co${capitulos[0].imageUrl}`}/>
                    <span className='presentacion_capview_icon_play'><BsPlay size={65}/></span>
                </div>
                <div className='presntacion_capview_options'>
                    <div className='presentacion_capview_option_body playbtn'>
                        <span><BsPlay/></span>
                        <span>Comenzar a ver E1</span>
                    </div>
                    <div className='presentacion_capview_option_body salabtn'>
                        <span ><MdAdd color={'#FFFFFF'} size={22}/></span>
                        <span>Añadir a sala</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
