import axios from '../../utils/axios/axiosBase'
import React, { useContext, useEffect, useState } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import UserContext from '../../Context/UserContext'
import { useAlerts } from '../../hooks/useAlerts'
import { AgregarAlerta, URL_IMAGENES } from '../../utils/Helpers'
import { Herta } from '../../utils/Assets'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { List } from './List'
import { BsPlayFill } from 'react-icons/bs'
import { AiOutlineClear } from 'react-icons/ai'
import { Loading } from '../../components/Loading/Loading'
import { useNavigate } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'

interface IPropsElementsPlaylist {
    id: number,
    animeId: number,
    animeTitle: string,
    episodeTitle: string,
    episodeNumber: number,
    totalEpisodes: number,
    optionDownloaded: string,
    dateDownloaded: string,
    url: string,
    imageUrl: string
}


export const PlaylistLobby: React.FC = () => {

    const { user } = useContext(UserContext)
    const { alertas, createNewAlert } = useAlerts()
    const [isLoadingPLaylist, setisLoadingPLaylist] = useState(false)
    const [isLoadingPage, setisLoadingPage] = useState(false)
    const [playlist_items, setplaylist_items] = useState<IPropsElementsPlaylist[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        if (user.accessToken !== "") {
            obtener_Playlist()
        }
    }, [user])


    const obtener_Playlist = async () => {
        setisLoadingPLaylist(true)
        try {
            const playlist = await axios.get('/playlist', { headers: { Authorization: `Bearer ${user.accessToken}` } })
            console.log(playlist)
            setplaylist_items(playlist.data.episodes)
        } catch (error) {
            console.error(error)
            AgregarAlerta(createNewAlert, "Ha ocurrido un error al obtener los datos de la playlist", 'danger')
        } finally {
            setisLoadingPLaylist(false)
        }
    }

    /* const handleDragEnd = () => {

    } */

    const limpiarPlaylist = () => {
        setisLoadingPage(true)
        try {
            axios.put(`/playlist/clear`, {}, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            }).then((response) => {
                if (response.data.success) {
                    setplaylist_items([])
                    AgregarAlerta(createNewAlert, "Playlist Limpiada correctamente", 'success')
                }
            }).catch((err) => {
                console.error(err)
            })
        } catch (error) {
            console.error(error)
            AgregarAlerta(createNewAlert, "Ha ocurrido un error al limpiar la Playlist", 'danger')
        } finally {
            setisLoadingPage(false)
        }
    }

    return (
        <AppLayout>
            <div className='flex flex-col lg:flex-row w-screen'>
                <section className='w-full flex h-[400px] flex-col justify-center items-center gap-y-8 relative'>
                    {
                        playlist_items.length !== 0 &&
                        <>
                            <img
                                src={`${URL_IMAGENES}${playlist_items[0].imageUrl}`}
                                className='absolute z-0 opacity-70 h-full lg:h-auto object-cover'
                            />
                            <div className='absolute bottom-10 w-3/4 lg:w-full text-center'>
                                <span className=' '>{playlist_items[0].animeTitle} - Ep {playlist_items[0].episodeNumber}</span>

                            </div>
                        </>
                    }

                    <div
                        onClick={() => { navigate(PATHS.PLAYLIST.replace(":id", playlist_items[0].id.toString())) }}
                        className='flex gap-x-8 bg-Bsecondary py-2 w-56 rounded cursor-pointer hover:scale-105 transition-all items-center justify-center z-10'>
                        <span><BsPlayFill size={20} /></span>
                        <span>Empezar Playlist</span>
                    </div>
                    <div
                        onClick={limpiarPlaylist}
                        className='flex gap-x-8 bg-Bprincipal py-2 w-56 rounded cursor-pointer hover:scale-105 transition-all items-center justify-center z-10'>
                        <span><AiOutlineClear size={20} /></span>
                        <span>Limpiar Playlist</span>
                    </div>
                </section>
                <section className='w-full h-[500px] flex flex-col justify-center items-center mt-8'>
                    <div className='min-w-1/2 h-full bg-navbar w-auto'>
                        {
                            isLoadingPLaylist ?
                                (
                                    <div className='w-full h-full flex justify-center items-center flex-col'>
                                        <img
                                            src={Herta}
                                            alt='Loader para playlist'
                                            className='w-28 h-28 mr-6'
                                        />
                                        <span>Cargando...</span>
                                    </div>
                                ) :
                                (
                                    <>
                                        <div className='max-h-full overflow-y-scroll flex flex-col gap-y-4 py-8 px-4'>
                                            <h1 className='text-2xl text-principal'>Playlist</h1>
                                            {
                                                playlist_items.map((item, index) => (
                                                    <List item={item} index={index} key={index} />
                                                ))
                                            }

                                        </div>
                                        {/* <DndContext
                                        collisionDetection={closestCenter}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <h1 className='text-2xl text-principal'>Playlist</h1>

                                        <div className='max-h-full overflow-y-scroll flex flex-col gap-y-4 py-8 px-4'>
                                            <SortableContext
                                                items={playlist_items}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {
                                                    playlist_items.map((item, index) => (
                                                        <List item={item} index={index} key={index}/>
                                                    ))
                                                }
                                            </SortableContext>

                                        </div>
                                    </DndContext> */}
                                    </>


                                )
                        }
                    </div>
                    {/* <button className=' bg-Bsecondary px-4 py-1 my-5 rounded'>Actualizar Playlist</button> */}
                </section>
            </div>
            {isLoadingPage && (<div className='w-screen h-screen'>
                <Loading />
            </div>)}
            {alertas}
        </AppLayout>

    )
}
