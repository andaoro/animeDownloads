import { AppLayout } from "../../components/AppLayout/AppLayout"
import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import UserContext from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import { Loading } from "../../components/Loading/Loading"
import './stylesHome.css'


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
  const [isLoading, setisLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [pagenumber, setpagenumber] = useState(0)
  const [morePages, setmorePages] = useState(true)

  useEffect(() => {
    if (user && user.accessToken.toString().trim() != "") {
      getDownloadedAnimes()
    }
  }, [user])

  useEffect(() => {
    if (user && user.accessToken !== "" && pagenumber !== 0) {
      window.addEventListener('scroll', handleScroll); // Agrega un event listener para detectar el scroll
      return () => {
        window.removeEventListener('scroll', handleScroll); // Elimina el event listener al desmontar el componente
      };
    }
  }, [pagenumber, morePages]);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    // Si el scroll llega al final de la página, carga más datos
    if (scrollTop + clientHeight >= scrollHeight) {
      getDownloadedAnimeScroll();
    }
  };


  const getDownloadedAnimes = () => {
    axios.get(`https://animedownloader.jmarango.co/api/downloaded/?page=${pagenumber}`, {
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
        setisLoading(false)
      }
    }).catch((err) => {
      alert("HA OCURRIDO UN ERROR")
      console.error(err)
    })
  }

  console.log(morePages)

  const getDownloadedAnimeScroll = () => {
    if (morePages) {
      axios.get(`https://animedownloader.jmarango.co/api/downloaded/?page=${pagenumber}`, {
        headers: {
          "Authorization": `Bearer ${user.accessToken}`
        }
      }).then((res) => {
        if (res.status === 200) {
          console.log(res.data)
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

  return (
    <AppLayout>
      {
        !isLoading ? (
          <div className="animes_dowloaded_container_grid">
            {
              animesDownloadedArray.map((anime, index) => (
                <div key={index} className="anime_Dowloaded_Card" onClick={() => { navigate(`/anime/${anime.id}/episodes`) }}>
                  <img src={`https://animedownloader.jmarango.co${anime.imageUrl}`} className="imgwhhome" />
                  <div>
                    <p>{anime.title}</p>
                  </div>
                  <span> {anime.emissionDate ? `Next: ${anime.emissionDate}` : ""}</span>
                </div>
              ))
            }
          </div>
        ) :
          (
            <Loading />
          )
      }
    </AppLayout>
  )
}


export default HomeScreen
