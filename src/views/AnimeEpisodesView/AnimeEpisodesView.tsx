import React, { useContext, useEffect, useState } from 'react'
import {  useParams } from "react-router-dom";
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { AiOutlinePlayCircle } from "react-icons/ai";
import './stylesEpisodes.css'
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import { Loading } from '../../components/Loading/Loading';

interface IDownloadOptions {
    dateDownloaded: string
    downloadOptionName: string
    url: string
    id: number
}

interface IElementsData {
    imageUrl: string,
    id: number
    episodeTitle: string
    episodeNumber: string
    downloadedEpisodes: IDownloadOptions[]
}

interface IObjectData {
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
    const [buttonNextView, setbuttonNextView] = useState(true)
    const [buttonPrevView, setbuttonPrevView] = useState(false)
    const { user } = useContext(UserContext)
    const { id } = useParams()


    useEffect(() => {
        if (user && user.accessToken.trim() !== "") {
            getAnimeEpisodes()
        }
    }, [user, pagenumber])


    const getAnimeEpisodes = () => {
        axios.get(`https://animedownloader.jmarango.co/api/downloaded/${id}?page=${pagenumber}`, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            setanimeData(response.data)
            setepisodes(response.data.elements)
            setisLoadingDataEpisodes(false)
            if(pagenumber == 0){
                setbuttonPrevView(false)
            }else{
                setbuttonPrevView(true)
            }

            if(pagenumber == animeData.totalPages - 1){
                setbuttonNextView(false)
            }else{
                setbuttonNextView(true)
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    console.log(animeData)

    useEffect(() => {
        if (episodes.length >= 1) {
            /*  episodes.sort((a, b) => { return a.episodeNumber - b.episodeNumber }) */
        }
    }, [episodes])

    return (
        <AppLayout>
            {
                !isLoadingDataEpisodes ?
                (
                    <>
                        <div className='animes_dowloaded_container_grid'>
                            {episodes.map((episode) => (
                                <a key={episode.id} className='card_Episodes' href={`https://animedownloader.jmarango.co${episode.downloadedEpisodes[0].url}`}>
                                    <div className='image_Episode_Container'>
                                        <img loading='lazy' src={`https://animedownloader.jmarango.co${episode.imageUrl}`} />
                                        <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                                    </div>
                                    <p className='episode_anime_title'>{animeData.object.title}</p>
                                    <p>E{episode.episodeNumber} - {episode.episodeTitle}</p>
                                    <div className='providers_Episodes'>
                                        {
                                            episode.downloadedEpisodes.map((downloadOptions) => (
                                                <span key={downloadOptions.id} className='episode_Provider'> {downloadOptions.downloadOptionName} </span>
                                            ))
                                        }
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className='buttonsPagesContainer'>
                            <button onClick={() => { 
                                if (pagenumber > 0) {
                                    setpagenumber(pagenumber - 1)
                                }
                             }}
                            className={`buttonEpisodes ${!buttonPrevView && "dpnone"}`}
                            >Anterior</button>
                            <button onClick={() => {
                                if (pagenumber < animeData.totalPages - 1) {
                                    setpagenumber(pagenumber + 1)
                                }
                            }}
                            className={`buttonEpisodes ${!buttonNextView && "dpnone"}`}
                            >Siguiente</button>
                        </div>
                    </>

                ):(
                    <Loading/>
                )
            }

        </AppLayout>
    )
}
