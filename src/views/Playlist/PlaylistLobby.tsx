import React, { useContext, useEffect, useState } from 'react'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import axios from 'axios'
import UserContext from '../../Context/UserContext'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { IDataNextPrev } from '../Reproductor/Reproductor'
import { URLAPI } from '../../utils/Helpers'

type downloadedEpisodesType = {
    url: string
    id: number
}

interface ICapActualPlaylist {
    url:string
    animeId: string
    animeTitle: string
    episodeNumber: number
}

export const PlaylistLobby: React.FC = () => {

    const { user } = useContext(UserContext)
    const [playlistData, setPlatlistData] = useState(null)
    const [capActualPlaylist, setCapActualPlaylist] = useState<ICapActualPlaylist | null>(null)
    const [nextEpisodePlaylist, setnextEpisodePlaylist] = useState<IDataNextPrev | null>(null)
    const [loadingData, setloadingData] = useState(true)


    useEffect(() => {
        if (user.accessToken !== "") {
            obtenerPlaylistActual()
            ObtenerDatosSiguienteCapituloPlaylist()
        }
    }, [user])


    const obtenerPlaylistActual = () => {
        axios.get(`${URLAPI}/playlist`,
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((playlist) => {
                console.log(playlist.data)
                setPlatlistData(playlist.data)
                setloadingData(false)
                if (playlist.data.episodes.length !== 0) {
                    setCapActualPlaylist(playlist.data.episodes[0])
                }
            }).catch((err) => {
                console.error(err)
            })
    }

    const ObtenerDatosSiguienteCapituloPlaylist = () => {
        axios.get(`${URLAPI}/playlist/next`,
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
            axios.post(`${URLAPI}/playlist/next`,{},{
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then(() => {
                window.location.reload()
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
