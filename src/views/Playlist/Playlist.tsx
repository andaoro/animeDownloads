import React, { useContext, useEffect, useState } from 'react'
import axios from "../../utils/axios/axiosBase"
import UserContext from '../../Context/UserContext'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { IDataNextPrev } from '../Reproductor/Reproductor'
import { useNavigate, useParams } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'
import { URL_IMAGENES } from '../../utils/Helpers'
import { Player } from '../../components/Player/Player'

interface ICapActualPlaylist {
    url: string
    animeId: string
    animeTitle: string
    episodeNumber: number
    id: number
}

export const Playlist: React.FC = () => {
    const { user } = useContext(UserContext)
    const [playlistData, setPlatlistData] = useState(null)
    const [capActualPlaylist, setCapActualPlaylist] = useState<ICapActualPlaylist | null>(null)
    const [nextEpisodePlaylist, setnextEpisodePlaylist] = useState<IDataNextPrev | null>(null)
    const [loadingData, setloadingData] = useState(true)
    const navigate = useNavigate()
    const baseURL = import.meta.env.VITE_BASE_URL_MEDIA || ''


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
                setloadingData(false)
                setCapActualPlaylist(playlist.data.episodes[0])
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
                if (nextEpisodePlaylist) {
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
                <AppLayout>
                    <div className='flex flex-col w-screen Rhigh md:flex-row'>
                        <section className='flex justify-center lg:pr-4 lg:pl-36 md:w-4/6'>
                            <div className='w-full mt-12'>
                                <article className='mx-2'>
                                    <h1 className='text-xl font-bold max-w-96'>{capActualPlaylist.animeTitle} Episodio {capActualPlaylist.episodeNumber}</h1>
                                </article>
                                {
                                    capActualPlaylist.url && (
                                        <div className='w-auto h-full md:h-[500px] md:mt-6'>
                                            <Player
                                                url={capActualPlaylist.url}
                                            />
                                        </div>
                                    )
                                }

                            </div>
                        </section>
                        <section className='mt-16 md:w-2/6 md:mr-12'>
                            <div className='w-full mt-12'>
                                <article className='flex justify-around w-full'>
                                    <button onClick={() => { navigate(PATHS.PLAYLIST_LOBBY) }} className='w-40 py-2 font-medium transition-all rounded bg-principal hover:bg-principal/70'>Lista de capitulos</button>
                                    <button onClick={() => { navigate('/') }} className='w-40 py-2 font-medium transition-all bg-gray-800 rounded hover:bg-gray-700'>Inicio</button>
                                </article>
                            </div>
                            <div className='flex flex-col gap-10 mt-12'>
                                <article>
                                    {nextEpisodePlaylist && (
                                        <div onClick={removerCapituloActualPlaylist} className='p-4 cursor-pointer hover:bg-navbar/95'>
                                            <span className='text-lg font-semibold'>Capitulo siguiente</span>
                                            <div className='flex pt-2 gap-x-4'>

                                                <img
                                                    src={`${URL_IMAGENES}${nextEpisodePlaylist.imageUrl}`}
                                                    alt={`Imagen de siguiente capitulo`}
                                                    className='object-cover w-40 h-24 rounded'
                                                />
                                                <article>
                                                    <p className=' w-72'>{nextEpisodePlaylist.animeTitle}</p>
                                                    <p>Episodio {nextEpisodePlaylist.episodeNumber}</p>
                                                </article>
                                            </div>

                                        </div>
                                    )}
                                </article>
                            </div>
                        </section>
                    </div>
                </AppLayout>

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
