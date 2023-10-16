import React, { useContext, useEffect, useState } from 'react'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import axios from "../../utils/axios/axiosBase"
import UserContext from '../../Context/UserContext'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { IDataNextPrev } from '../Reproductor/Reproductor'
import { useNavigate, useParams } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'
import { URL_IMAGENES } from '../../utils/Helpers'

interface ICapActualPlaylist {
    url: string
    animeId: string
    animeTitle: string
    episodeNumber: number
    id: number
}

export const Playlist: React.FC = () => {
    const { user } = useContext(UserContext)
    const { id } = useParams()
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
                setPlatlistData(playlist.data)
                setloadingData(false)
                if (playlist.data.episodes.length !== 0) {
                    let data = playlist.data.episodes.find((item: ICapActualPlaylist) => {
                        if (id) {
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
                    {/* <ReproductorLayout
                        urlEpisode={capActualPlaylist.url}
                        next={nextEpisodePlaylist}
                        prev={null}
                        animeId={capActualPlaylist.animeId}
                        animeTittle={capActualPlaylist.animeTitle}
                        episodeNumber={capActualPlaylist.episodeNumber}
                        cambiarCapitulo={removerCapituloActualPlaylist}
                        reproductorType={2}
                    /> */}
                    <div className='w-screen Rhigh flex flex-col md:flex-row'>
                        <section className='  flex justify-center lg:pr-4 lg:pl-36 md:w-4/6'>
                            <div className='w-full mt-12'>
                                <article className='mx-2'>
                                    <h1 className='font-bold text-xl max-w-96'>{capActualPlaylist.animeTitle} Episodio {capActualPlaylist.episodeNumber}</h1>
                                </article>
                                {
                                    capActualPlaylist.url && (
                                        <div className='w-auto h-full md:h-[500px] md:mt-6'>
                                            <video
                                                src={`${baseURL}${capActualPlaylist.url}`}
                                                className='w-6/6 h-full rounded'
                                                controls
                                            />
                                        </div>
                                    )
                                }

                            </div>
                        </section>
                        <section className='md:w-2/6 md:mr-12 mt-16'>
                            <div className='w-full mt-12'>
                                <article className='flex w-full justify-around'>
                                    <button onClick={() => { navigate(PATHS.PLAYLIST_LOBBY) }} className='bg-principal w-40 py-2 rounded font-medium hover:bg-principal/70 transition-all'>Lista de capitulos</button>
                                    <button onClick={() => { navigate('/') }} className='bg-gray-800 w-40 py-2 rounded font-medium hover:bg-gray-700 transition-all'>Inicio</button>
                                </article>
                            </div>
                            <div className='flex flex-col mt-12 gap-10'>
                                <article>
                                    {nextEpisodePlaylist && (
                                        <div onClick={removerCapituloActualPlaylist} className=' hover:bg-navbar/95 p-4 cursor-pointer'>
                                            <span className='text-lg font-semibold'>Capitulo siguiente</span>
                                            <div className='flex gap-x-4 pt-2'>

                                                <img
                                                    src={`${URL_IMAGENES}${nextEpisodePlaylist.imageUrl}`}
                                                    alt={`Imagen de siguiente capitulo`}
                                                    className='w-40 h-24 object-cover rounded'
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
