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
    downloadOptions: TdownloadOptions[]
}


//https://www3.animeflv.net/ver/bleach-sennen-kessenhen-19
//https://www3.animeflv.net/anime/bleach-sennen-kessenhen

export const AnimesDownloader: React.FC = () => {

    const [urlInfoAnime, seturlInfoAnime] = useState('')
    const [remoteDataEpisodes, setRemoteDataEpisodes] = useState<IRemoteDataEpisodes | null>(null)
    const [loadingData, setloadingData] = useState(false)
    const [downloadOption, setdownloadOption] = useState('')
    const [downloadOptionSelected, setdownloadOptionSelected] = useState(99)
    const [opcionDescarga, setopcionDescarga] = useState('2')
    const [remoteDataAnime, setremoteDataAnime] = useState<IRemoteDataAnime | null>(null)
    const [LoadingAnimeData, setLoadingAnimeData] = useState(false)
    const { user } = useContext(UserContext)
    const { alertas, createNewAlert } = useAlerts()

    const ConsultarRemoteDataAnime = () => {
        if (urlInfoAnime.toString().trim() !== "") {
            setloadingData(true)
            setRemoteDataEpisodes(null)
            axios.get(`/remote/info?url=${urlInfoAnime}`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then(async (response) => {
                let dataEpisode = await axios.get(`/remote/episodeInfo?url=${response.data.remoteEpisodesUrl[0]}`, {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                })
                let downloadOptionProvider = dataEpisode.data.downloadOptions

                setremoteDataAnime({ ...response.data, downloadOptions: downloadOptionProvider })
            }).catch((err) => {
                AgregarAlerta(createNewAlert, "Ha ocurrido un error", 'danger')
                console.error(err)
            }).finally(() => {
                setloadingData(false)
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
                AgregarAlerta(createNewAlert, "Ha ocurrido un error", 'danger')
                console.error(err)
            }).finally(() => {
                setloadingData(false)
            })
        }
    }

    const Buscar = () => {
        setdownloadOption('')
        setdownloadOptionSelected(99)
        switch (opcionDescarga) {
            case '1':
                ConsultarRemoteDataEpisodeAnime()
                break;

            case '2':
                ConsultarRemoteDataAnime()
                break;

            default:
                ConsultarRemoteDataEpisodeAnime()
                break;
        }
    }

    const DescargarEpisodio = () => {
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

    const DescargarAnime = () => {
        setloadingData(true)
        axios.post('/remote/downloadAnime', {
            "animeId": remoteDataAnime?.id,
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

    const Descargar = () => {
        switch (opcionDescarga) {
            case '1':
                DescargarEpisodio()
                break;

            case '2':
                DescargarAnime()
                break;

            default:
                DescargarEpisodio()
                break;
        }
    }

    const limpiarDatos = () => {
        setremoteDataAnime(null)
        setRemoteDataEpisodes(null)
        seturlInfoAnime('')
        setopcionDescarga('1')
    }

    return (
        <AppLayout>
            <div className='flex flex-col w-full gap-4 px-2 mt-12 xl:px-16 xl:flex-row'>
                <section className='flex flex-col xl:w-1/2 gap-y-6'>
                    <select onChange={(e) => { setopcionDescarga(e.target.value) }} value={opcionDescarga} className='bg-sky-900 px-4 w-full py-2 rounded [&>option]:bg-gray-900'>
                        <option disabled> -- Seleccione una opcion -- </option>
                        <option value={1}>Episodio</option>
                        <option value={2}>Anime</option>
                    </select>

                    <label className='relative flex items-center px-3 py-3 border-2 border-sky-500 w-90 rounded-2xl'>
                        <input
                            type='text'
                            placeholder='Link'
                            value={urlInfoAnime}
                            onChange={(e) => { seturlInfoAnime(e.target.value) }}
                            className='w-full bg-transparent outline-none'
                            onKeyUp={(e) => {
                                if (e.keyCode == 13) {
                                    Buscar()
                                }
                            }}
                        />
                        <span onClick={Buscar} className='absolute flex items-center justify-center p-2 rounded-full cursor-pointer right-3 bg-sky-600'><AiOutlineSearch size={20} /></span>
                    </label>

                </section>

                <section className='xl:w-1/2 xl:px-32'>
                    <div>
                        {
                            (!loadingData && !LoadingAnimeData) ?
                                (remoteDataEpisodes !== null || remoteDataAnime !== null) &&
                                (<div className='flex flex-col'>
                                    {
                                        remoteDataEpisodes && (
                                            <div className='flex flex-col items-center xl:flex-row'>
                                                <picture className='w-2/3 md:w-1/4'>
                                                    <img src={`${URL_IMAGENES}${remoteDataEpisodes?.imageUrl}`} alt='Banner del anime' className='w-full' />
                                                </picture>
                                                <div className='flex flex-col justify-center gap-3 px-12 mt-6 xl:mt-0'>
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
                                        )
                                    }
                                    {
                                        remoteDataAnime && (
                                            <div className='flex flex-col items-center xl:flex-row'>
                                                <picture className='w-2/3 md:w-1/4'>
                                                    <img src={`${URL_IMAGENES}${remoteDataAnime?.imageUrl}`} alt='Banner del anime' className='w-full' />
                                                </picture>
                                                <div className='flex flex-col justify-center gap-3 px-12 mt-6 xl:mt-0'>
                                                    <p>{remoteDataAnime?.title}</p>
                                                    <p>{remoteDataAnime?.provider}</p>
                                                    <div className='flex gap-4'>
                                                        {
                                                            remoteDataAnime?.downloadOptions.map((opcion, index) => (
                                                                opcion.supported && <span onClick={() => {
                                                                    setdownloadOptionSelected(index)
                                                                    setdownloadOption(opcion.name)
                                                                }} className={`cursor-pointer text-center flex items-center px-2 w-auto h-10 rounded ${downloadOptionSelected == index ? 'bg-lime-600 ' : ' border-2 border-lime-300'}`} key={index}>{opcion.name}</span>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className='flex justify-center mt-20 xl:justify-start'>
                                        <button onClick={Descargar} className='px-12 py-2 rounded bg-sky-700'>Descargar</button>
                                    </div>
                                </div>)
                                :
                                <Loading />
                        }
                    </div>
                </section>
            </div>


            {alertas}
        </AppLayout>
    )
}
