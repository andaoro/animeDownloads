import React, { useContext, useEffect, useState } from 'react'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import axios from "../../utils/axios/axiosBase"
import UserContext from '../../Context/UserContext'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { IDataNextPrev } from '../Reproductor/Reproductor'
import { useNavigate, useParams } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'

interface ICapActualPlaylist {
    url: string
    animeId: string
    animeTitle: string
    episodeNumber: number
    id:number
}

export const Playlist:React.FC = () => {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [playlistData, setPlatlistData] = useState(null)
    const [capActualPlaylist, setCapActualPlaylist] = useState<ICapActualPlaylist | null>(null)
    const [nextEpisodePlaylist, setnextEpisodePlaylist] = useState<IDataNextPrev | null>(null)
    const [loadingData, setloadingData] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (user.accessToken !== "") {
            obtenerPlaylistActual()
            ObtenerDatosSiguienteCapituloPlaylist()
        }
    }, [user])


    const obtenerPlaylistActual = () => {
        axios.get(`/playlist`,
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((playlist) => {
                setPlatlistData(playlist.data)
                setloadingData(false)
                if (playlist.data.episodes.length !== 0) {
                    let data = playlist.data.episodes.find((item:ICapActualPlaylist)=> {
                        if(id){
                            return item.id == parseInt(id?.toString())
                        }
                    })
                    setCapActualPlaylist(data)
                }
            }).catch((err) => {
                console.error(err)
            })
    }

    const ObtenerDatosSiguienteCapituloPlaylist = () => {
        //axios.get(`/playlist`)
        axios.get(`/playlist/next`,
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((res) => {
                if (res.data) {
                    setnextEpisodePlaylist(res.data)
                }
            }).catch((err) => {
                console.error(err)
            })
    }

    const removerCapituloActualPlaylist = () => {
        if (user.accessToken !== "") {
            axios.post(`/playlist/next`, {}, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then(() => {
                if(nextEpisodePlaylist){
                    navigate(PATHS.PLAYLIST.replace(":id", nextEpisodePlaylist?.id.toString()))
                    window.location.reload()
                }
            }).catch((err) => {
                console.error(err)
            })
        } else {
            console.log('vacio')
        }

    }

    return (
        !loadingData ? (
            capActualPlaylist !== null ? (
                 <ReproductorLayout
                    urlEpisode={capActualPlaylist.url}
                    next={nextEpisodePlaylist}
                    prev={null}
                    animeId={capActualPlaylist.animeId}
                    animeTittle={capActualPlaylist.animeTitle}
                    episodeNumber={capActualPlaylist.episodeNumber}
                    cambiarCapitulo={removerCapituloActualPlaylist}
                    reproductorType={2}
                /> 
            ) : (
                <AppLayout>
                    <h1>La Playlist esta vacia</h1>
                </AppLayout>
            )
        )
            : (
                <AppLayout>
                    <h1>Cargando Playlist</h1>
                </AppLayout>
            )


    )
}
