import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { AiOutlinePlayCircle } from "react-icons/ai";
import './stylesEpisodes.css'
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import { Loading } from '../../components/Loading/Loading';
import { AnimePresentation } from '../../components/AnimePresentationEpisodes/AnimePresentation';
import { URLAPI, URL_IMAGENES } from '../../utils/Helpers';

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
        if (scrollTop + clientHeight >= scrollHeight) {
            getAnimeEpisodesScroll();
        }
    };

    const getAnimeEpisodes = () => {
        axios.get(`${URLAPI}/downloaded/${id}?page=${pagenumber}`, {
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
            setepisodes(response.data.elements)

        }).catch((err) => {
            console.error(err)
        })

    }

    const getAnimeEpisodesScroll = () => {
        if (morePages) {
            axios.get(`${URLAPI}/downloaded/${id}?page=${pagenumber}`, {
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
            })
        }

    }

    const agregarCapituloPlaylist = (id: number) => {
        axios.patch(`${URLAPI}/playlist`, {
            id
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                alert(response.data.msg)
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
                        <>
                            <AnimePresentation data={animeData.object} capitulos={animeData.elements} />
                            <div className='animes_dowloaded_container_grid'>
                                {episodes.map((episode) => (
                                    <div className='card_Episodes' key={episode.id}>
                                        <a onClick={() => { navigate(`/episodio/reproducir/${episode.id}`) }} >
                                            <div className='image_Episode_Container'>
                                                <img loading='lazy' src={`${URL_IMAGENES}${episode.imageUrl}`} className='imgwh' />
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
                                                    <span key={episode.id} className='episode_Provider agregarPlaylist' onClick={() => { agregarCapituloPlaylist(episode.id) }}>Agregar a playlist </span>
                                                )
                                            }

                                        </div>
                                    </div>

                                ))}
                            </div>
                        </>
                    ) : (
                        <Loading />
                    )
            }

        </AppLayout>
    )
}
