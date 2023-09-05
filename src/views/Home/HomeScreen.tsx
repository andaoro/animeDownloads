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
    window.document.title = "EnderAnime"
  })

  useEffect(() => {
    if (user && user.accessToken.toString().trim() != "") {
      getDownloadedAnimes()
      getAnimeDownloadedSeason()
    }
  }, [user])

  /* useEffect(() => {
    if (user && user.accessToken !== "" && pagenumber !== 0) {
      window.addEventListener('scroll', handleScroll); // Agrega un event listener para detectar el scroll
      return () => {
        window.removeEventListener('scroll', handleScroll); // Elimina el event listener al desmontar el componente
      };
    }
  }, [pagenumber, morePages]); */


  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Si el scroll llega al final de la página, carga más datos
    if (scrollTop + clientHeight >= scrollHeight) {
      getDownloadedAnimeScroll();
    }
  };

  const compareByEmissionDay = (a: any, b: any) => {

    // Parsea las fechas en formato "YYYY-MM-DD"
    let fa = a.emissionDate
    let fb = b.emissionDate
    const dateA = new Date(fa);
    const dateB = new Date(fb);

    // Compara las fechas
    if (dateA < dateB) {
      return -1;
    } else if (dateA > dateB) {
      return 1;
    } else {
      return 0;
    }

    /* // Si ambos objetos no tienen emissionDay, no cambian de posición
    if (!a.emissionDay && !b.emissionDay) {
      return 0;
    }
    // Si a tiene emissionDay y b no, a va antes
    if (a.emissionDay && !b.emissionDay) {
      return 1;
    }
    // Si b tiene emissionDay y a no, b va antes
    if (!a.emissionDay && b.emissionDay) {
      return -1;
    }
    // Ambos tienen emissionDay, los comparamos
    return a.emissionDay.localeCompare(b.emissionDay); */
  }

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
    }).finally(() => {
      setisLoading(false)
    })
  }

  const getDownloadedAnimeScroll = () => {
    if (morePages) {
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
          setanimesDownloadedArray((prevData) => [...prevData, ...res.data.elements])
          setisLoading(false)
        }
      }).catch((err) => {
        alert("HA OCURRIDO UN ERROR")
        console.error(err)
      })
    }
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
      <h1 className="text-3xl font-bold px-4 border-l-4">{text}</h1>
    )

  }

  /* animesDownloadedSeasonArray.sort(compareByEmissionDay) */
  return (
    <AppLayout>
      {
        !isLoading ? (
          <>
            <div className="flex px-40 py-4 items-center">
              <ParamTitle text="Animes en emisión" />
            </div>
            <div className="animes_dowloaded_container_grid">
              {
                animesDownloadedSeasonArray.map((anime, index) => (
                  <HomeCards anime={anime} index={index} />
                ))
              }
            </div>

            <hr className="my-4" />

            <div className="flex justify-center py-2 items-center my-6 lg:px-40 lg:justify-normal">
              <ParamTitle text="Últimos animes agregados" />
            </div>
            <div className="animes_dowloaded_container_grid">
              {
                animesDownloadedArray.map((anime, index) => (
                  <HomeCards anime={anime} index={index} />
                ))
              }
            </div>
          </>

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
