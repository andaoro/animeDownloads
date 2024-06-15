import { AppLayout } from "../../components/AppLayout/AppLayout"
import axios from "../../utils/axios/axiosBase"
import React, { useContext, useEffect, useState } from "react"
import UserContext from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import { Loading } from "../../components/Loading/Loading"
import './stylesHome.css'
import { URL_IMAGENES } from "../../utils/Helpers"
import { useAlerts } from "../../hooks/useAlerts"
import { AgregarAlerta } from "../../utils/Helpers"
import { HomeCards } from "./HomeCards"
import PATHS from "../../routers/CONSTPATHS"

import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { NavigateEpisodes } from "../../utils/navigates/NavigateEpisodes"
import { FormatedFecha } from "../../helpers/Helpers"
import { FaPlay } from "react-icons/fa"


export interface IAnimesDownloadedProps {
  autoUpdate: boolean
  id: number
  imageUrl: string
  title: string
  emissionDate: string,
  emissionDay: string
}

const HomeScreen: React.FC = () => {
  const { user } = useContext(UserContext)
  const [animesDownloadedArray, setanimesDownloadedArray] = useState<IAnimesDownloadedProps[]>([])
  const [animesDownloadedSeasonArray, setanimesDownloadedSeasonArray] = useState<IAnimesDownloadedProps[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)
  const [pagenumber, setpagenumber] = useState(0)
  const [morePages, setmorePages] = useState(true)
  const { alertas, createNewAlert } = useAlerts()
  const navigate = useNavigate()


  useEffect(() => {
    window.document.title = "AniFlex"
  })

  useEffect(() => {
    if (user && user.accessToken.toString().trim() != "") {
      getDownloadedAnimes()
      getAnimeDownloadedSeason()
    }
  }, [user])


  const getDownloadedAnimes = () => {
    axios.get(`/downloaded/?page=${pagenumber}`, {
      headers: {
        "Authorization": `Bearer ${user.accessToken}`
      }
    }).then((res) => {
      if (res.status === 200) {
        if (pagenumber !== res.data.totalPages - 1) {
          setpagenumber(pagenumber + 1)
        } else {
          setmorePages(false)
        }
        setanimesDownloadedArray(res.data.elements)
      }
    }).catch((err) => {
      AgregarAlerta(createNewAlert, "HA OCURRIDO UN ERROR", "danger")
      console.error(err)
      localStorage.removeItem("UserInfo")
    }).finally(() => {
      setisLoading(false)
    })
  }

  const getAnimeDownloadedSeason = () => {
    axios.get('/downloaded/season', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    }).then((response) => {
      setanimesDownloadedSeasonArray(response.data)
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      setisLoading(false)
    })
  }

  const ParamTitle = ({ text }: { text: string }) => {
    return (
      <h1 className="text-xl font-bold text-principal">{text}</h1>
    )

  }

  /* animesDownloadedSeasonArray.sort(compareByEmissionDay) */
  return (
    <AppLayout>
      {
        !isLoading ? (
          <section className="w-screen px-4 pb-6">
            <article className="flex flex-col w-full gap-x-12 lg:flex-row">
              <div className="lg:w-3/4">
                <article className="block w-full my-4 text-start">
                  <ParamTitle text="Animes en emisión" />
                </article>
                <div className="max-h-[480px] overflow-y-scroll overflow-x-hidden scroll">
                  {
                    animesDownloadedSeasonArray.map((anime, index) => (
                      <div className="relative w-full mb-4 cursor-pointer h-36 group" key={index} onClick={() => { NavigateEpisodes(navigate, anime.id, anime.title) }}>
                        <img
                          src={`${URL_IMAGENES}${anime.imageUrl}`}
                          alt={`banner ${anime.title}`}
                          className="object-cover w-full transition-all rounded h-36 brightness-50 opacity-70 group-hover:brightness-90 group-hover:scale-105"
                        />

                        <div className="absolute block mx-2 bottom-2">
                          <p className="text-2xl font-bold w-96">{anime.title}</p>
                          <p className="text-xl font-bold text-fuchsia-300">{anime.emissionDate ? `${FormatedFecha(anime.emissionDate)}` : ""}</p>
                        </div>

                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="hidden lg:block lg:w-1/4 ">
                <article className="block w-full my-4 text-start">
                  <ParamTitle text="Ultimos Animes Añadidos" />
                </article>
                <div className="max-h-[480px] overflow-y-scroll overflow-x-hidden scroll">
                  {
                    animesDownloadedArray.map((anime, index) => (
                      <div className="block my-2 text-lg font-medium" key={index} onClick={() => { NavigateEpisodes(navigate, anime.id, anime.title) }}>
                        <span className="flex items-center mr-3 truncate transition-all cursor-pointer hover:text-Rsecondary hover:underline gap-x-2">
                          <span><FaPlay size={12} /></span>
                          {anime.title}
                        </span>
                      </div>
                    ))
                  }

                  <span
                    onClick={()=>{navigate(PATHS.DIRECTORY)}}
                    className="text-center underline duration-300 cursor-pointer hover:text-gray-300"
                  >
                    Ver mas ...
                  </span>
                </div>

              </div>
            </article>

            <article className="mt-12">
              <div>
                <ParamTitle text="Animes Recomendados" />
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {
                  animesDownloadedArray.map((anime, index) => (
                    <div className="relative cursor-pointer h-96 group" key={index} onClick={() => { NavigateEpisodes(navigate, anime.id, anime.title) }}>
                      <img
                        src={`${URL_IMAGENES}${anime.imageUrl}`}
                        alt="Imagen de portada"
                        className="object-cover w-full transition-all rounded h-96 brightness-75 opacity-80 group-hover:brightness-100 hover:scale-105"
                      />
                      <span className="absolute mx-4 font-bold transition-all cursor-pointer bottom-4 group-hover:bottom-2">{anime.title}</span>
                    </div>
                  ))
                }
              </div>
            </article>
          </section>

        ) :
          (
            <Loading />
          )
      }
      {alertas}
    </AppLayout>
  )
}


export default HomeScreen
