import React, { useRef, useEffect, useContext, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { useNavigate, useParams } from 'react-router-dom'
import './stylesReproductor.css'
import UserContext from '../../Context/UserContext'
import axios from 'axios'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import { AiOutlinePlayCircle } from "react-icons/ai";
import { URLAPI } from '../../utils/Helpers'

export interface IDataNextPrev {
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
    axios.get(`${URLAPI}/downloaded/1/${id}`,
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
        console.error(err)
      })
  }

  const cambiarCapitulo = (idcap?: number) => {
    setnext(null)
    setprev(null)
    consultarDetallesCapitulo(idcap)
  }

  return (
      <ReproductorLayout
        urlEpisode={urlEpisode}
        next={next}
        prev={prev}
        animeId={animeId}
        animeTittle={animeTittle}
        episodeNumber={episodeNumber}
        cambiarCapitulo={cambiarCapitulo}
        reproductorType={1}
      />
  )
}
