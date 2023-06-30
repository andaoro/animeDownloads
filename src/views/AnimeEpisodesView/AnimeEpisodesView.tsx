import React from 'react'
import { useLocation } from "react-router-dom";
import { AppLayout } from '../../components/AppLayout/AppLayout';
import { IAnimesDownloadedProps } from '../Home/HomeScreen';
import { AiOutlinePlayCircle } from "react-icons/ai";
import './stylesEpisodes.css'

export const AnimeEpisodesView: React.FC = () => {
    const location = useLocation();
    const animeData: IAnimesDownloadedProps = location.state;

    animeData.episodes.sort((a, b) => { return a.episodeNumber - b.episodeNumber })

    return (
        <AppLayout>
            <div className='animes_dowloaded_container_grid'>
                {animeData.episodes.map((episode) => (
                    <a key={episode.id} className='card_Episodes' href={`https://animedownloader.jmarango.co${episode.downloadedEpisodes[0].url}`}>
                        <div className='image_Episode_Container'>
                            <img loading='lazy' src={`https://animedownloader.jmarango.co${episode.imageUrl}`} />
                            <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                        </div>
                        <p className='episode_anime_title'>{animeData.title}</p>
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
        </AppLayout>
    )
}
