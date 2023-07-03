import React, { useRef, useEffect } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import { useParams } from 'react-router-dom'
import './stylesReproductor.css'

export const Reproductor: React.FC = () => {
  const video = useRef<HTMLVideoElement>(null)
  const { id } = useParams()

  const guardarVolumenActual = (event: Event) => {
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
  }, []);

  return (
    <AppLayout>
      <div className='reproductor_video_Container'>
        <video
          src={`https://animedownloader.jmarango.co/watch/${id}`}
          autoPlay
          controls
          ref={video}
        /* onVolumeChange={(e)=>{console.log(e.target.volume)}} */
        />
      </div>

      <div className='reproductor_anime_info'> 
          <div className='anime_info'>
            <div>
              <p className='anime_info_tittle'>Tengoku Daimakyou</p>
              <p>E1-Episodio 1</p>
            </div>
          </div>

          <div>
            <span>AAAA</span>
          </div>
      </div>
    </AppLayout>
  )
}
