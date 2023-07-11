import React, { useRef, useEffect,useContext,useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { useParams } from 'react-router-dom'
import './stylesReproductor.css'
import UserContext from '../../Context/UserContext'
import axios from 'axios'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'

export const Reproductor: React.FC = () => {
  const video = useRef<HTMLVideoElement>(null) 
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const [animeTittle, setanimeTittle] = useState('')
  const [episodeNumber, setepisodeNumber] = useState(0)
  const [urlEpisode, seturlEpisode] = useState('')
  const [next, setnext] = useState({})
  const [prev, setprev] = useState({})

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

  useEffect(()=>{
    if(user && user.accessToken !== ""){
      consultarDetallesCapitulo()
    }
  },[user])

  const consultarDetallesCapitulo = () =>{
    axios.get(`https://animedownloader.jmarango.co/api/downloaded/1/${id}`,
    {
      headers:{
        Authorization:`Bearer ${user.accessToken}`
      }
    }).then((response)=>{
      if(response.data.next){
        setnext(response.data.next)
      }
      if(response.data.previous){
        setprev(response.data.previous)
      }
      setanimeTittle(response.data.animeTitle)
      setepisodeNumber(response.data.episodeNumber)
      seturlEpisode(response.data.downloadedEpisodes[0].url)
    }).catch((err)=>{
      console.log(err)
    })
  }

  console.log(next)

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
          <div className='anime_info'>
            <div>
              <p className='anime_info_tittle'>{animeTittle}</p>
              <p>E{episodeNumber}-Episodio {episodeNumber}</p>
            </div>
          </div>

          <div className='anime_info'>
            <div>
              
            </div>
          </div>
      </div>
    </ReproductorLayout>
  )
}
