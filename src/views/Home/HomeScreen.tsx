import { AppLayout } from "../../components/AppLayout/AppLayout"
import axios from "axios"
import React, { useContext, useEffect, useState } from "react"
import UserContext from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import { Loading } from "../../components/Loading/Loading"
import './stylesHome.css'

interface IDownloadedEpisodes {
  dateDownloaded: string,
  downloadOptionName: string
  id: number
  url: string
}

 interface IEpisodesAnime {
  imageUrl: string
  id: number
  episodeTitle: string
  episodeNumber: number
  downloadedEpisodes: IDownloadedEpisodes[]
}

export interface IAnimesDownloadedProps {
  autoUpdate: boolean
  id: number
  imageUrl: string
  title: string
  episodes: IEpisodesAnime[]
  emissionDate: string,
  emissionDay: string
}

const HomeScreen: React.FC = () => {
  const { user } = useContext(UserContext)
  const [animesDownloadedArray, setanimesDownloadedArray] = useState<IAnimesDownloadedProps[]>([])
  const [isLoading, setisLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.accessToken.toString().trim() != "") {
      getDownloadedAnimes()
    }
  }, [user])


  const getDownloadedAnimes = () => {
    axios.get(`https://animedownloader.jmarango.co/api/downloaded/`, {
      headers: {
        "Authorization": `Bearer ${user.accessToken}`
      }
    }).then((res) => {
      if (res.status === 200) {
        setanimesDownloadedArray(res.data)
        setisLoading(false)
      }
    }).catch((err) => {
      alert("HA OCURRIDO UN ERROR")
      console.error(err)
    })
  }

  return (
    <AppLayout>
      {
        !isLoading ? (
          <div className="animes_dowloaded_container_grid">
            {
              animesDownloadedArray.map((anime, index) => (
                <div key={index} className="anime_Dowloaded_Card" onClick={()=>{navigate('/anime/episodes',{state:anime})}}>
                  <img src={`https://animedownloader.jmarango.co${anime.imageUrl}`} />
                  <p>{anime.title}</p>
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
