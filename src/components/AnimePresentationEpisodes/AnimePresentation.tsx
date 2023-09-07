import React, { useContext, useState } from 'react'
import { IObjectData, IElementsData } from '../../views/AnimeEpisodesView/AnimeEpisodesView'
import './stylesPresentacion.css'
import { BsPlay } from "react-icons/bs";
import { MdAdd } from "react-icons/md";
import axios from "../../utils/axios/axiosBase"
import { URL_IMAGENES } from '../../utils/Helpers';
import UserContext from '../../Context/UserContext';
import { Loading } from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { useAlerts } from '../../hooks/useAlerts';
import { AgregarAlerta } from '../../utils/Helpers';
import PATHS from '../../routers/CONSTPATHS';

interface IAnimeData {
    data: IObjectData
    capitulos: IElementsData[]
}

export const AnimePresentation: React.FC<IAnimeData> = ({ data, capitulos }) => {

    const { user } = useContext(UserContext)
    const {alertas,createNewAlert} = useAlerts()
    const navigate = useNavigate()
    const [isLoadingAddPlaylist, setisLoadingAddPlaylist] = useState(false)

    const agregarAnimePlaylist = () => {
        setisLoadingAddPlaylist(true)
        axios.patch(`/playlist/anime`, {
            id: data.id
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                AgregarAlerta(createNewAlert,response.data.msg,'success')
                setisLoadingAddPlaylist(false)
            }
        }).catch((err) => {
            console.error(err)
        })
    }


    console.log(`${PATHS.PLAYER}/${capitulos[0].id}`)

    return (
        <div className='Presentacion_container'>
            <div className='backgroundPresentacion'></div>
            <div className=' z-10 w-auto flex flex-col'>
                <img src={`${URL_IMAGENES}${data.imageUrl}`} className='w-48 text-center object-cover mb-4 rounded'/>
                <p style={{ fontSize: "12px" }}>{data.title}</p>
            </div>
            <div className='presentacion_capview'>
                <div className='presentacion_capview_imagen'>
                    <img src={`${URL_IMAGENES}${capitulos[0].imageUrl}`}/>
                    <span className='presentacion_capview_icon_play'><BsPlay size={65} /></span>
                </div>
                <div className='presntacion_capview_options'>
                    <div className='presentacion_capview_option_body playbtn' onClick={() => { navigate(`${(PATHS.PLAYER).replace(":id",`${capitulos[0].id}`)}`) }}>
                        <span><BsPlay /></span>
                        <span>Comenzar a ver E1</span>
                    </div>
                    <div className='presentacion_capview_option_body salabtn' onClick={agregarAnimePlaylist}>
                        <span ><MdAdd color={'#FFFFFF'} size={22} /></span>
                        <span>Añadir anime a playlist</span>
                    </div>
                </div>
            </div>
            {
                isLoadingAddPlaylist && (<Loading />)
            }
            {alertas}
        </div>
    )
}
