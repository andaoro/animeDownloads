import React, { useContext, useState } from 'react'
import axios from '../../../utils/axios/axiosBase'
import UserContext from '../../../Context/UserContext'
import { AppLayout } from '../../../components/AppLayout/AppLayout'
import { AiOutlineSearch } from 'react-icons/ai'
import { Loading } from '../../../components/Loading/Loading'
import { URL_IMAGENES } from '../../../utils/Helpers'
import { useAlerts } from '../../../hooks/useAlerts'
import { AgregarAlerta } from '../../../utils/Helpers';

type TdownloadOptions = {
    name: string
    supported: boolean
    url: string
}

interface IRemoteDataEpisodes {
    animeId: number
    animeTitle: string
    animeUrl: string
    dateDownloaded: string
    episodeNumber: number
    episodeTitle: string
    id: number
    imageUrl: string
    optionDownloaded: string
    provider: string
    updatedDB: boolean
    downloadOptions: TdownloadOptions[]
}

interface IRemoteDataAnime {
    emissionDate: string
    emissionDay: string
    id: number
    imageUrl: string
    provider: string
    remoteEpisodesUrl: string[]
    title: string
    updatedDB: boolean
}


//https://www3.animeflv.net/ver/bleach-sennen-kessenhen-19
//https://www3.animeflv.net/anime/bleach-sennen-kessenhen

export const AnimesDownloader: React.FC = () => {

    const [urlInfoAnime, seturlInfoAnime] = useState('')
    const [remoteDataEpisodes, setRemoteDataEpisodes] = useState<IRemoteDataEpisodes | null>(null)
    const [loadingData, setloadingData] = useState(false)
    const [downloadOption, setdownloadOption] = useState('')
    const [downloadOptionSelected, setdownloadOptionSelected] = useState(0)
    const [remoteDataAnime, setremoteDataAnime] = useState<IRemoteDataAnime | null>(null)
    const [LoadingAnimeData, setLoadingAnimeData] = useState(false)
    const { user } = useContext(UserContext)
    const { alertas, createNewAlert } = useAlerts()

    const ConsultarRemoteDataAnime = () => {
        if (urlInfoAnime.toString().trim() !== "") {
            axios.get(`/remote/info?url=${urlInfoAnime}`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((response) => {
                console.log(response.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const ConsultarRemoteDataEpisodeAnime = () => {
        if (urlInfoAnime.toString().trim() !== "") {
            setloadingData(true)
            setRemoteDataEpisodes(null)
            axios.get(`/remote/episodeInfo?url=${urlInfoAnime}`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((response) => {
                setRemoteDataEpisodes(response.data)
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setloadingData(false)
            })
        }
    }

    const Descargar = () => {
        setloadingData(true)
        axios.post('/remote/downloadEpisode', {
            "episodeId": remoteDataEpisodes?.id,
            "optionName": downloadOption
        }, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                AgregarAlerta(createNewAlert, response.data.msg, 'success')
            }
        }).catch((err) => {
            AgregarAlerta(createNewAlert, "Ha ocurrido un error", 'danger')
            console.error(err)
        }).finally(() => {
            setloadingData(false)
        })
    }


    return (
        <AppLayout>
            <div className='flex flex-col ga-y-6'>
                <button onClick={ConsultarRemoteDataEpisodeAnime}>Buscar Episodio</button>
                <button onClick={ConsultarRemoteDataAnime}>Buscar Anime</button>
            </div>
            <section className='mt-12 flex flex-col w-screen px-32 gap-6'>
                <select defaultValue={1} className='bg-sky-900 w-64 px-4 py-2 rounded [&>option]:bg-gray-900'>
                    <option disabled> -- Seleccione una opcion -- </option>
                    <option value={1}>Episodio</option>
                    <option value={2}>Anime</option>
                </select>

                <label className='flex border-2 border-sky-500 w-90 relative px-3 py-3 rounded-2xl items-center'>
                    <input
                        type='text'
                        placeholder='Link'
                        value={urlInfoAnime}
                        onChange={(e) => { seturlInfoAnime(e.target.value) }}
                        className='bg-transparent outline-none w-full'
                    />
                    <span onClick={ConsultarRemoteDataEpisodeAnime} className='absolute right-3 cursor-pointer bg-sky-600 p-2 rounded-full flex items-center justify-center'><AiOutlineSearch size={20} /></span>
                </label>

            </section>

            <section className='px-32 mt-20'>
                <div>
                    {
                        (!loadingData && !LoadingAnimeData) ?
                            (remoteDataEpisodes !== null || remoteDataAnime !== null) &&
                            (<div className='flex flex-col'>
                                <div className='flex'>
                                    <picture className='w-24'>
                                        <img src={`${URL_IMAGENES}${remoteDataEpisodes?.imageUrl}`} alt='Banner del anime' className='w-full' />
                                    </picture>
                                    <div className='px-12 flex flex-col justify-center gap-3'>
                                        <p>{remoteDataEpisodes?.animeTitle}</p>
                                        <p>{remoteDataEpisodes?.episodeTitle}</p>
                                        <p>{remoteDataEpisodes?.provider}</p>
                                        <div className='flex gap-4'>
                                            {
                                                remoteDataEpisodes?.downloadOptions.map((opcion, index) => (
                                                    opcion.supported && <span onClick={() => {
                                                        setdownloadOptionSelected(index)
                                                        setdownloadOption(opcion.name)
                                                    }} className={`cursor-pointer text-center flex items-center px-2 w-auto h-10 rounded ${downloadOptionSelected == index ? 'bg-lime-600 ' : ' border-2 border-lime-300'}`} key={index}>{opcion.name}</span>
                                                ))
                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className='mt-20'>
                                    <button onClick={Descargar} className='bg-sky-700 px-12 py-2 rounded'>Descargar</button>
                                </div>
                            </div>)
                            :
                            <Loading />
                    }
                </div>
            </section>

            {alertas}
        </AppLayout>
    )
}
