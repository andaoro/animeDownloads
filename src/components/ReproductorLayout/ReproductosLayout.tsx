import React, { useRef } from 'react'
import Header from '../Header/Header'
import './stylesReproductorLayout.css'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlayCircle } from 'react-icons/ai'
import { IDataNextPrev } from '../../views/Reproductor/Reproductor'
import { URL_IMAGENES } from '../../utils/Helpers'

interface ReproductorProps {
  urlEpisode: string,
  next: IDataNextPrev | null,
  prev: IDataNextPrev | null,
  animeId: string
  animeTittle: string
  episodeNumber: number,
  cambiarCapitulo: (idcap?: number) => any
  reproductorType: number
}

export const ReproductorLayout: React.FC<ReproductorProps> = ({
  urlEpisode, next, prev, animeId, animeTittle, episodeNumber, cambiarCapitulo, reproductorType
}) => {

  const video = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()

  return (
    <div className='AppBodyR'>
      <Header />
      <div className='ChildrenContainerR'>
        <div className='reproductor_video_Container'>
          <video
            src={`${URL_IMAGENES}${urlEpisode}`}
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
                        if (reproductorType === 1) {
                          navigate(`/episodio/reproducir/${next.id}`);
                        }
                        cambiarCapitulo(next.id)
                      }}>
                        <img src={`${URL_IMAGENES}${next.imageUrl}`} className='episodes_Info_Reproductor_img' />
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
                        <img src={`${URL_IMAGENES}${prev.imageUrl}`} className='episodes_Info_Reproductor_img' />
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
      </div>
    </div>
  )
}
