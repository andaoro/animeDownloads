import React, { useRef, useContext } from 'react'
import Header from '../Header/Header'
import './stylesReproductorLayout.css'
import { useNavigate } from 'react-router-dom'
import { AiOutlinePlayCircle, AiOutlineEye } from 'react-icons/ai'
import { IDataNextPrev } from '../../views/Reproductor/Reproductor'
import { URL_IMAGENES } from '../../utils/Helpers'
import axios from '../../utils/axios/axiosBase'
import UserContext from '../../Context/UserContext'

interface ReproductorProps {
  urlEpisode: string,
  next: IDataNextPrev | null,
  prev: IDataNextPrev | null,
  animeId: string
  animeTittle: string
  episodeNumber: number,
  cambiarCapitulo: (idcap?: number) => any
  reproductorType: number
  id?: number | string | undefined
}

export const ReproductorLayout: React.FC<ReproductorProps> = ({
  urlEpisode, next, prev, animeId, animeTittle, episodeNumber, cambiarCapitulo, reproductorType, id
}) => {

  const video = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const baseURL = import.meta.env.VITE_BASE_URL_MEDIA || ''
  const { user } = useContext(UserContext)

  const agregar_visto = async () => {
    try {
      let data = await axios.patch(`/episode/${id}?completed=${true}`, {}, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      })

      console.log(data)
    } catch (error) {
      
    }

  }

  return (
    <div className='bg-default overflow-x-hidden h-screen text-white'>
      <Header />
      <div className='ChildrenContainerR'>
        <div className='reproductor_video_Container'>
          <video
            src={`${baseURL}${urlEpisode}`}
            controls
            ref={video}
          />
        </div>

        <div className='reproductor_anime_info'>
          <div className={`anime_info ${next == null && prev == null && 'titleFullWidth'}`}>
            <div>
              <p className='anime_info_tittle' onClick={() => { navigate(`/anime/${animeId}/episodes`) }}>{animeTittle}</p>
              <p>E{episodeNumber}-Episodio {episodeNumber}</p>
              <div onClick={()=>{agregar_visto()}} className='bg-navbar cursor-pointer hover:scale-105 transition-all duration-300 my-4 p-2 rounded gap-x-5 flex'>
                <span><AiOutlineEye size={25} /></span>
                <span>visto</span>
              </div>
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
                        console.log(next.id)
                        cambiarCapitulo(next.id)
                      }}>
                        <img src={`${URL_IMAGENES}${next.imageUrl}`} className='episodes_Info_Reproductor_img' />
                        <span className='PlayEpisode'><AiOutlinePlayCircle size={50} /></span>
                      </div>
                      <div>
                        <p>{next.animeTitle}</p>
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
