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
            console.log(loadScroll)
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
            window.document.title = `ver ${response.data.object.title} ─ EnderAnime`
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
                console.log('1')

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
                AgregarAlerta(createNewAlert,response.data.msg,'success')
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
                        <div className="flex flex-col lg:flex-row w-full justify-between">
                            {/* <AnimePresentation data={animeData.object} capitulos={animeData.elements} /> */}
                            <section className='w-5/5 justify-center flex lg:w-1/5 lg:justify-start mt-20 relative px-4'>
                                <div >
                                    <div className='p-2 flex flex-col justify-center items-center mb-4'>
                                        <img
                                            src={`${URL_IMAGENES}${animeData.object.imageUrl}`}
                                            className='w-[250px] h-full object-contain mb-4 rounded'
                                        />
                                        <span>{animeData.object.title}</span>
                                    </div>
                                    <div>
                                        <div className='flex gap-x-8 bg-navbar my-4 py-2 px-3 cursor-pointer hover:scale-105 transition-all duration-300'>
                                            <span><AiOutlineHeart size={25} /></span>
                                            <div>
                                                <span>Agregar </span>
                                                <span>a favoritos</span>
                                            </div>
                                        </div>
                                        <div className='flex gap-x-8 bg-navbar my-4 py-2 px-3 cursor-pointer hover:scale-105 transition-all duration-300'>
                                            <span><MdList size={25} /></span>
                                            <div >
                                                <span>Agregar </span>
                                                <span>a lista</span>
                                            </div>
                                        </div>

                                        {
                                            user.userType == "admin" && (
                                                <div onClick={agregarAnimePlaylist} className='flex gap-x-8 bg-navbar my-4 py-2 px-3 cursor-pointer hover:scale-105 transition-all duration-300'>
                                                    <span><MdAdd size={25} /></span>
                                                    <span>Agregar anime a playlist</span>
                                                </div>
                                            )
                                        }

                                    </div>
                                </div>
                            </section>
                            <section className="lg:w-4/5 ">
                                <h3 className='text-4xl px-4 my-4 font-bold'>Lista de episodios</h3>
                                <hr />
                                <div className='flex flex-col justify-centers items-center grid-cols-1 text-center sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                    {episodes.map((episode) => (
                                        <div className={`card_Episodes ${episode.completed ? "[&>a>div>section>img]:opacity-40" : ""}`} key={episode.id}>
                                            <a onClick={() => { navigate(`/episodio/reproducir/${episode.id}`) }} >
                                                <div className='image_Episode_Container'>
                                                    <section className='relativ'>
                                                        <img loading='lazy' src={`${URL_IMAGENES}${episode.imageUrl}`} className='imgwh' />
                                                        {episode.completed && <span className='absolute bottom-2 right-2 bg-black px-2 py-1 text-sm'>visto</span>}
                                                    </section>
                                                    <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                                                </div>
                                                <div>
                                                    <p className='episode_anime_title'>{animeData.object.title}</p>
                                                    <p>E{episode.episodeNumber} - {episode.episodeTitle}</p>

                                                </div>

                                            </a>

                                            <div className='providers_Episodes'>
                                                {
                                                    user.userType == "admin" && (
                                                        <span key={episode.id} className='agregarPlaylist bg-Rsecondary hover:bg-Rsecondary/60' onClick={() => { agregarCapituloPlaylist(episode.id) }}>Agregar a playlist </span>
                                                    )
                                                }

                                            </div>
                                        </div>

                                    ))}
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
