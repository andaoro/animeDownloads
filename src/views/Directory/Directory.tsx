import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import axios from '../../utils/axios/axiosBase'
import UserContext from '../../Context/UserContext'
import { Pagination } from '../../components/Pagination/Pagination'
import { IAnimesDownloadedProps } from '../Home/HomeScreen'
import { HomeCards } from '../Home/HomeCards'
import {useLocation, useNavigate} from 'react-router-dom'


export const Directory: React.FC = () => {

    const [page, setpage] = useState(0)
    const [totalPages, settotalPages] = useState<number>(0)
    const [animes, setanimes] = useState<IAnimesDownloadedProps[]>([])
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    const urlPage = new URLSearchParams(location.search).get('page')

    useEffect(() => {
        console.log(page)
        navigate(`${location.pathname}?page=${page+1}`)
        GetDirectory(page)
    }, [page])
    

    useEffect(() => {
        if (user.accessToken.toString() !== "") {
            if(!urlPage){
                navigate(`${location.pathname}?page=${1}`)
            }
            GetDirectory(urlPage? parseInt(urlPage) - 1: 0)
        }
        
    }, [user])


        const GetDirectory = async (pagina:string | number) => {
        let { data } = await axios.get(`/downloaded/?page=${pagina}`, { headers: { Authorization: `Bearer ${user.accessToken}` } })
        if(totalPages == 0){
            settotalPages(data.totalPages)
        }

        console.log(urlPage ? parseInt(urlPage) -1:"a")
        setanimes(data.elements)
    }



    return (
        <AppLayout>
            <section className="animes_dowloaded_container_grid mt-2">
                {
                    animes.map((anime, index) => (
                        <HomeCards anime={anime} index={index} key={index} />
                    ))
                }
            </section>
            <section className='my-4'>
                <Pagination pages={totalPages} actualPage={page} setPage={setpage}/>
            </section>
        </AppLayout>
    )
}
