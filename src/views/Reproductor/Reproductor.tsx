import React, { useRef, useEffect, useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './stylesReproductor.css'
import UserContext from '../../Context/UserContext'
import axios from "../../utils/axios/axiosBase"
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { AgregarAlerta, URL_IMAGENES } from '../../utils/Helpers'
import { NavigateEpisodes, NavigateReproductor } from '../../utils/navigates/NavigateEpisodes'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useAlerts } from '../../hooks/useAlerts'

export interface IDataNextPrev {
  animeId: number,
  animeTitle: string,
  episodeNumber: number
  episodeTitle: string
  id: number
  imageUrl: string
  totalEpisodes: number
  url: string
}

export interface ICapInfo {
  animeTitle: string
  episodeNumber: number
  url: string
  next: IDataNextPrev
  previous: IDataNextPrev
  animeId: number
  completed:boolean
}

export const Reproductor: React.FC = () => {
  const video = useRef<HTMLVideoElement>(null)
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [capituloInfo, setcapituloInfo] = useState({} as ICapInfo)
  const [next, setnext] = useState<IDataNextPrev | null>(null)
  const [prev, setprev] = useState<IDataNextPrev | null>(null)
  const baseURL = import.meta.env.VITE_BASE_URL_MEDIA || ''
  const {alertas,createNewAlert} = useAlerts()
  const [isEpisodeView, setisEpisodeView] = useState<boolean>(false)

  const navigate = useNavigate()

  /* const guardarVolumenActual = (event: Event) => {
    const videoElement = event.currentTarget as HTMLVideoElement;
    const volume = videoElement.volume;
    console.log('Volumen actual:', volume);
  };

  useEffect(() => {
    if (video.current) {
      video.current.addEventListener('volumechange', guardarVolumenActual);
    }
    return () => {
      if (video.current) {
        video.current.removeEventListener('volumechange', guardarVolumenActual);
      }
    };
  }, []); */

  useEffect(() => {
    if (user && user.accessToken !== "") {
      consultarDetallesCapitulo(id)
    }
  }, [user, id])


  const consultarDetallesCapitulo = (id: string | undefined | number) => {
    axios.get(`/downloaded/1/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      }).then((response) => {
        setcapituloInfo(response.data)
        setisEpisodeView(response.data.completed)
        console.log(response.data)
        window.document.title = `${response.data.animeTitle} ${response.data.episodeTitle}`
        if (response.data.next) {
          setnext(response.data.next)
        }
        if (response.data.previous) {
          setprev(response.data.previous)
        }
      }).catch((err) => {
        console.error(err)
      })
  }

  const cambiarCapitulo = (idcap?: number) => {
    setnext(null)
    setprev(null)
    consultarDetallesCapitulo(idcap)
  }

  const agregar_visto = async () => {
    try {
      await axios.patch(`/episode/${id}?completed=${!capituloInfo.completed}`, {}, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      })
      setisEpisodeView(!isEpisodeView)
    } catch (error) {
      AgregarAlerta(createNewAlert,"Ha ocurrido un error",'danger')
    }

  }

  console.log(isEpisodeView)

  return (

    <AppLayout>
      {/* <ReproductorLayout
        urlEpisode={urlEpisode}
        next={next}
        prev={prev}
        animeId={animeId}
        animeTittle={animeTittle}
        episodeNumber={episodeNumber}
        cambiarCapitulo={cambiarCapitulo}
        reproductorType={1}
        id={id}
      /> */}

      <div className='w-screen Rhigh flex flex-col md:flex-row'>
        <section className='  flex justify-center lg:pr-4 lg:pl-36 md:w-4/6'>
          <div className='w-full mt-12'>
            <article className='mx-2'>
              <h1 className='font-bold text-xl max-w-96'>{capituloInfo.animeTitle} Episodio {capituloInfo.episodeNumber}</h1>
            </article>
            {
              capituloInfo.url && (
                <div className='w-auto h-full md:h-[500px] md:mt-6'>
                  <video
                    src={`${baseURL}${capituloInfo.url}`}
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
            <article className='flex w-full justify-around gap-x-4'>
              <button onClick={() => { NavigateEpisodes(navigate, capituloInfo.animeId, capituloInfo.animeTitle) }} className='bg-principal w-40 py-2 rounded font-medium hover:bg-principal/70 transition-all'>Lista de capitulos</button>
              <button onClick={agregar_visto} className='bg-gray-800 w-40 py-2 rounded font-medium hover:bg-gray-700 transition-all flex justify-center items-center'>{isEpisodeView ? <AiFillEye size={20} />:<AiFillEyeInvisible size={20}/> }</button>
              <button onClick={() => { navigate('/') }} className='bg-gray-800 w-40 py-2 rounded font-medium hover:bg-gray-700 transition-all'>Inicio</button>
            </article>
          </div>
          <div className='flex flex-col mt-12 gap-10'>
            <article>
              {capituloInfo.next && (
                <div onClick={() => { NavigateReproductor(navigate, capituloInfo.next.id, capituloInfo.animeTitle) }} className=' hover:bg-navbar/95 p-4 cursor-pointer'>
                  <span className='text-lg font-semibold'>Capitulo siguiente</span>
                  <div className='flex gap-x-4 pt-2'>

                    <img
                      src={`${URL_IMAGENES}${capituloInfo.next.imageUrl}`}
                      alt={`Imagen de siguiente capitulo`}
                      className='w-40 h-24 object-cover rounded'
                    />
                    <article>
                      <p className=' w-72'>{capituloInfo.next.animeTitle}</p>
                      <p>Episodio {capituloInfo.next.episodeNumber}</p>
                    </article>
                  </div>

                </div>
              )}

              {capituloInfo.previous && (
                <div onClick={() => { NavigateReproductor(navigate, capituloInfo.previous.id, capituloInfo.animeTitle) }} className='mt-6 hover:bg-navbar/95 p-4 cursor-pointer'>
                  <span className='text-lg font-semibold'>Capitulo anterior</span>
                  <div className='flex gap-x-4 pt-2'>

                    <img
                      src={`${URL_IMAGENES}${capituloInfo.previous.imageUrl}`}
                      alt={`Imagen de siguiente capitulo`}
                      className='w-40 h-24 object-cover rounded'
                    />
                    <article>
                      <p className=' w-72'>{capituloInfo.previous.animeTitle}</p>
                      <p>Episodio {capituloInfo.previous.episodeNumber}</p>
                    </article>
                  </div>

                </div>
              )}
            </article>
          </div>
        </section>
      </div>
      {alertas}
    </AppLayout>
  )
}
