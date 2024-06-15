import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { AiOutlinePlayCircle, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import './stylesEpisodes.css'
import axios from "../../utils/axios/axiosBase"
import UserContext from '../../Context/UserContext';
import { Loading } from '../../components/Loading/Loading';
import { AnimePresentation } from '../../components/AnimePresentationEpisodes/AnimePresentation';
import { URL_IMAGENES } from '../../utils/Helpers';
import { useAlerts } from '../../hooks/useAlerts';
import { AgregarAlerta } from '../../utils/Helpers';
import { MdList, MdAdd } from 'react-icons/md';
import { NavigateReproductor } from '../../utils/navigates/NavigateEpisodes';

interface IDownloadOptions {
    dateDownloaded: string
    downloadOptionName: string
    url: string
    id: number
}

export interface IElementsData {
    imageUrl: string,
    id: number
    episodeTitle: string
    episodeNumber: string
    downloadedEpisodes: IDownloadOptions[]
    completed: boolean
}

export interface IObjectData {
    autoUpdate: string
    id: number
    imageUrl: string
    title: string
}

interface IEpisodesProps {
    actualPage: number
    elements: IElementsData[]
    object: IObjectData
    totalPages: number

}

export const AnimeEpisodesView: React.FC = () => {
    const [animeData, setanimeData] = useState<IEpisodesProps>({} as IEpisodesProps)
    const [episodes, setepisodes] = useState<IElementsData[]>([])
    const [isLoadingDataEpisodes, setisLoadingDataEpisodes] = useState(true)
    const [pagenumber, setpagenumber] = useState(0)
    const [morePages, setmorePages] = useState(true)
    const [loadScroll, setloadScroll] = useState(false)
    const { alertas, createNewAlert } = useAlerts()
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (user && user.accessToken !== "") {
            getAnimeEpisodes()
        }
    }, [user])

    useEffect(() => {
        if (user && user.accessToken !== "" && pagenumber !== 0) {
            window.addEventListener('scroll', handleScroll); // Agrega un event listener para detectar el scroll
            return () => {
                window.removeEventListener('scroll', handleScroll); // Elimina el event listener al desmontar el componente
            };
        }
    }, [pagenumber, morePages]);


    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        // Si el scroll llega al final de la página, carga más datos
        if (scrollTop + clientHeight >= scrollHeight && !loadScroll) {
            getAnimeEpisodesScroll();
        }
    };

    const getAnimeEpisodes = () => {
        axios.get(`/downloaded/${id}?page=${pagenumber}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (pagenumber !== response.data.totalPages - 1) {
                setpagenumber(pagenumber + 1)
            } else {
                setmorePages(false)
            }
            window.document.title = `ver ${response.data.object.title}`
            setanimeData(response.data)
            setisLoadingDataEpisodes(false)
            setepisodes(response.data.elements)

        }).catch((err) => {
            console.error(err)
        })

    }

    const getAnimeEpisodesScroll = () => {
        if (morePages && !loadScroll) {
            setloadScroll(true)
            axios.get(`/downloaded/${id}?page=${pagenumber}`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((response) => {
                if (pagenumber !== response.data.totalPages - 1) {
                    setpagenumber(pagenumber + 1)
                } else {
                    setmorePages(false)
                }
                setanimeData(response.data)
                setisLoadingDataEpisodes(false)
                setepisodes(prevData => [...prevData, ...response.data.elements])
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                setloadScroll(false)
            })
        }

    }

    const agregarCapituloPlaylist = (id: number) => {
        axios.patch(`/playlist`, {
            id
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                AgregarAlerta(createNewAlert, response.data.msg, "success")
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const agregarAnimePlaylist = () => {
        setisLoadingDataEpisodes(true)
        axios.patch(`/playlist/anime`, {
            id: animeData.object.id
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                AgregarAlerta(createNewAlert, response.data.msg, 'success')
                setisLoadingDataEpisodes(false)
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    return (
        <AppLayout>
            {
                !isLoadingDataEpisodes ?
                    (
                        <div className='w-screen min-h-screen'>
                            <div className='h-[500px] relative'>
                                <img
                                    loading='lazy'
                                    src={`${URL_IMAGENES}${animeData.object.imageUrl}`}
                                    alt={`Banner de anime ${animeData.object.title}`}
                                    className='object-cover w-full h-full blur-sm brightness-50'
                                />
                                <div className='absolute flex flex-col bottom-2 lg:left-4'>
                                    <article className='border-b-2'>
                                        <h1 className='py-2 text-xl font-medium'>{animeData.object.title}</h1>
                                    </article>
                                    <article className='flex flex-col w-screen my-2 sm:flex-row gap-x-4'>
                                        <div className='flex items-center h-12 px-4 py-2 cursor-pointer gap-x-6 bg-principal hover:bg-principal/80'>
                                            <span><AiOutlineHeart size={30} /></span>
                                            <span>Agregar a favoritos</span>
                                        </div>
                                        <div className='flex items-center h-12 px-4 py-2 bg-gray-800 cursor-pointer gap-x-2 hover:bg-gray-700'>
                                            <span><MdList size={30} /></span>
                                            <span>Agregar a lista</span>
                                        </div>
                                        {
                                            (user.userType == "admin") &&
                                            <div onClick={agregarAnimePlaylist} className='flex items-center h-12 px-4 py-2 cursor-pointer gap-x-2 bg-Rsecondary hover:bg-Rsecondary/80'>
                                                <span><MdAdd size={30} /> </span>
                                                <span> Agregar a playlist</span>
                                            </div>
                                        }
                                    </article>
                                </div>
                            </div>
                            <section className='mx-12 my-6'>
                                <h2 className='text-xl font-semibold'>Lista de episodios</h2>
                                <div className='grid gap-4 my-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                                    {
                                        episodes.map((episode, index) => (
                                            <div className='relative cursor-pointer' key={index} >
                                                <img
                                                    src={`${URL_IMAGENES}${episode.imageUrl}`}
                                                    alt={`imagen de capitulo ${episode.episodeTitle}`}
                                                    className='object-cover w-full brightness-50 hover:brightness-100 h-52'
                                                    onClick={() => { NavigateReproductor(navigate, episode.id, animeData.object.title) }}
                                                />
                                                <article className='absolute mx-2 bottom-2'>
                                                    <p>{episode.episodeTitle}</p>
                                                </article>

                                                {
                                                    (user.userType == "admin") && (
                                                        <p onClick={() => { agregarCapituloPlaylist(episode.id) }} title='Agregar a playlist' className='absolute p-2 bg-gray-800 top-2 right-2'><MdAdd size={20} /></p>
                                                    )
                                                }

                                                {
                                                    episode.completed && (
                                                        <span className='absolute px-2 py-1 text-sm font-medium bg-black bottom-1 right-2'>Visto</span>
                                                    )
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </section>
                        </div>
                    ) : (
                        <Loading />
                    )
            }
            {alertas}
        </AppLayout>
    )
}
