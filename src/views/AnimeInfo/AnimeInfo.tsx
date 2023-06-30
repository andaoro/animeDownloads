import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../../components/Header/Header"

interface AnimeProvider {
    emissionDate: string,
    emissionDay: string,
    imageUrl: string,
    provider: string,
    title: string
    episodes: IEpisodes[]
}

interface IEpisodes {
    imageUrl: string,
    title: string,
    url: string
}

const AnimeInfo = () => {
    const { anime } = useParams()
    const [arrayEpisodes, setarrayEpisodes] = useState<IEpisodes[]>([])
    const [animeInfo, setanimeInfo] = useState<AnimeProvider[]>([])

    useEffect(() => {
        httpInfoAnime()
    }, [])

    const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTY4NzM5NTQ1NiwiZXhwIjoxNjg5OTg3NDU2fQ.E-aqM4ONwG2XWDNgI0vy-u9Io3Nd7eewp9m8YeNtnQAg5wRnD2zjdEHaIaxuS3hHpWRU9bbUMex_x4k4IMWAog"


    const httpInfoAnime = () => {
        axios.get(`https://animedownloader.jmarango.co/api/remote/animeInfo?url=https://www3.animeflv.net/anime/${anime}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then((response) => {
                console.log(response.data)
                setarrayEpisodes(response.data.episodes)
                setanimeInfo(response.data)
            }).catch((err) => {
                console.log(err)
            })
    }


    console.log(animeInfo)


    return (
        <>
        <Header/>
        {arrayEpisodes.length !== 0 ?
            (
                arrayEpisodes.map((episode) => (
                    <div key={episode.title}>
                        <h1>{episode.title}</h1>
                        {/* <img src={episode.imageUrl} /> */}
                    </div>
                ))
            ) :
            (
                <h1>{anime}</h1>
            )}
        </>
        
    )
}

export default AnimeInfo;