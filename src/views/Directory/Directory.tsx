import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import axios from '../../utils/axios/axiosBase'
import UserContext from '../../Context/UserContext'
import { Pagination } from '../../components/Pagination/Pagination'
import { IAnimesDownloadedProps } from '../Home/HomeScreen'
import { HomeCards } from '../Home/HomeCards'
import { useLocation, useNavigate } from 'react-router-dom'
import { URL_IMAGENES } from '../../utils/Helpers'
import { NavigateEpisodes } from '../../utils/navigates/NavigateEpisodes'
import { Loader } from '../../components/Loading/Loader'
import { Herta } from '../../utils/Assets'


export const Directory: React.FC = () => {

    const [page, setpage] = useState(0)
    const [totalPages, settotalPages] = useState<number>(0)
    const [animes, setanimes] = useState<IAnimesDownloadedProps[]>([])
    const [isLoadingData, setisLoadingData] = useState(true)
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    const urlPage = new URLSearchParams(location.search).get('page')

    useEffect(() => {
        if (user.accessToken.toString() !== "") {
            GetDirectory(page)
        }
    }, [page])


    useEffect(() => {
        if (user.accessToken.toString() !== "") {
            if (!urlPage) {
                navigate(`${location.pathname}?page=${1}`)
            }
            GetDirectory(urlPage ? parseInt(urlPage) - 1 : 0)
        }

    }, [user])


    const GetDirectory = async (pagina: string | number) => {
        setisLoadingData(true)
        try {
            let { data } = await axios.get(`/downloaded/?page=${pagina}`, { headers: { Authorization: `Bearer ${user.accessToken}` } })
            if (totalPages == 0) {
                settotalPages(data.totalPages)
            }

            setanimes(data.elements)
        } catch (error) {
            console.error(error)
        } finally {
            setisLoadingData(false)
        }

    }

    return (
        <AppLayout>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6 mt-6 justify-items-center">
                {
                    isLoadingData ? (
                        <div className='flex justify-center items-center w-screen my-12 flex-col gap-y-4'>
                            <img
                                src={Herta}
                                className='w-24 h-24 mr-8'
                            />
                            <span>Cargando...</span>
                        </div>
                    ) :
                        (
                            animes.map((anime, index) => (
                                <HomeCards
                                    anime={anime}
                                    key={index}
                                />
                            ))
                        )
                }
            </div>
            <section className='my-4'>
                <Pagination pages={totalPages} actualPage={page} setPage={setpage} setanimes={setanimes} />
            </section>
        </AppLayout>
    )
}
