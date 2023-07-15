import React, { useRef, useEffect, useContext, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { useNavigate, useParams } from 'react-router-dom'
import './stylesReproductor.css'
import UserContext from '../../Context/UserContext'
import axios from 'axios'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import { AiOutlinePlayCircle } from "react-icons/ai";

interface IDataNextPrev {
  animeId: number,
  animeTitle: string,
  episodeNumber: number
  episodeTitle: string
  id: number
  imageUrl: string
  totalEpisodes: number
}

export const Reproductor: React.FC = () => {
  const video = useRef<HTMLVideoElement>(null)
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [animeTittle, setanimeTittle] = useState('')
  const [episodeNumber, setepisodeNumber] = useState(0)
  const [urlEpisode, seturlEpisode] = useState('')
  const [animeId, setanimeId] = useState('')
  const [next, setnext] = useState<IDataNextPrev | null>(null)
  const [prev, setprev] = useState<IDataNextPrev | null>(null)

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
  }, [user])

  const consultarDetallesCapitulo = (id: string | undefined | number) => {
    axios.get(`https://animedownloader.jmarango.co/api/downloaded/1/${id}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      }).then((response) => {
        if (response.data.next) {
          setnext(response.data.next)
        }
        if (response.data.previous) {
          setprev(response.data.previous)
        }
        setanimeId(response.data.animeId)
        setanimeTittle(response.data.animeTitle)
        setepisodeNumber(response.data.episodeNumber)
        seturlEpisode(response.data.downloadedEpisodes[0].url)
      }).catch((err) => {
        console.log(err)
      })
  }

  const cambiarCapitulo = (idcap: number) => {
    consultarDetallesCapitulo(idcap)
  }


  return (
    <ReproductorLayout>
      <div className='reproductor_video_Container'>
        <video
          src={`https://animedownloader.jmarango.co${urlEpisode}`}
          autoPlay
          controls
          ref={video}
        />
      </div>

      <div className='reproductor_anime_info'>
        <div className={`anime_info ${next == null && prev == null && 'titleFullWidth'}`}>
          <div>
            <p className='anime_info_tittle' onClick={() => { navigate(`/anime/${animeId}/episodes`) }}>{animeTittle}</p>
            <p>E{episodeNumber}-Episodio {episodeNumber}</p>
          </div>
        </div>
        <div className={`anime_info ${next == null && prev == null && 'titleFull'}`}>
          <div className='contenedorCapitulos'>
            {
              next !== null && (
                <div className='episodes_info' >
                  <span style={{ fontWeight: "bold" }}>Siguiente Episodio</span>
                  <div className='episodes_Info_Reproductor'>
                    <div className='image_Episode_Container' onClick={() => {
                      navigate(`/episodio/reproducir/${next.id}`);
                      cambiarCapitulo(next.id)
                    }}>
                      <img src={`https://animedownloader.jmarango.co${next.imageUrl}`} className='episodes_Info_Reproductor_img' />
                      <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                    </div>
                    <div>
                      <p>{next.episodeTitle}</p>
                    </div>
                  </div>
                </div>
              )
            }
            {
              prev !== null && (
                <div className='episodes_info' onClick={() => {
                  navigate(`/episodio/reproducir/${prev.id}`);
                  cambiarCapitulo(prev.id)
                }}>
                  <span style={{ fontWeight: "bold" }}>Episodio Anterior</span>
                  <div className='episodes_Info_Reproductor'>
                    <div className='image_Episode_Container'>
                      <img src={`https://animedownloader.jmarango.co${prev.imageUrl}`} className='episodes_Info_Reproductor_img' />
                      <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                    </div>
                    <div>
                      <p>{prev.episodeTitle}</p>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </ReproductorLayout>
  )
}
