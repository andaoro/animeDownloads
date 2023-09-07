import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import axios from '../../utils/axios/axiosBase'
import UserContext from '../../Context/UserContext'
import { Pagination } from '../../components/Pagination/Pagination'
import { IAnimesDownloadedProps } from '../Home/HomeScreen'
import { HomeCards } from '../Home/HomeCards'


export const Directory: React.FC = () => {

    const [page, setpage] = useState(0)
    const [totalPages, settotalPages] = useState<number>(0)
    const [animes, setanimes] = useState<IAnimesDownloadedProps[]>([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (user.accessToken.toString() !== "") {
            GetDirectory()
        }
    }, [user])


    const GetDirectory = async () => {
        let { data } = await axios.get(`/downloaded/?page=${page}`, { headers: { Authorization: `Bearer ${user.accessToken}` } })
        settotalPages(data.totalPages)
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
                <Pagination pages={totalPages} actualPage={page} />
            </section>
        </AppLayout>
    )
}
