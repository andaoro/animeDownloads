import './styles.css'
import logo from '../../assets/img/enderythead.png'
import React, { useContext, useEffect, useState } from 'react'
import UserContext, { IDataUserProps } from '../../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios/axiosBase'
import hertaLogo from '../../assets/gifs/herta-loading.gif'
import { MdPlaylistPlay, MdOutlinePlaylistRemove, MdFavorite, MdList, MdOutlineExitToApp, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";

const Header: React.FC = () => {
    const navigate = useNavigate()
    let userData: string | null = localStorage.getItem('UserInfo')
    let usuario: IDataUserProps;
    const { user, setUser } = useContext(UserContext)
    const [viewOptionsUser, setviewOptionsUser] = useState(false)

    useEffect(() => {
        if (userData) {
            usuario = JSON.parse(userData)
            setUser(usuario)
        } else {
            navigate('/login')
        }
    }, [])

    const limpiarPlaylist = () => {
        axios.put(`/playlist/clear`, {}, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        }).then((response) => {
            if (response.data.success) {
                alert('Playlist Limpiada con exito')
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const SectionsMenuHeader = ({ children }: { children: React.ReactNode }) => {
        return (
            <section className=' border-t-2 py-2 border-sky-400'>
                {children}
            </section>
        )
    }


    return (
        <header className=' bg-sky-700 z-50'>
            <img src={logo} alt='Logo' style={{ width: '40px', cursor: 'pointer' }} onClick={() => { navigate('/home') }} />

            <div className='md:relative z-20'>
                <div onClick={() => { setviewOptionsUser(!viewOptionsUser) }} className='flex items-center cursor-pointer'>
                    <span className='userName' >{user?.username}</span>
                    <span className='ml-2'>{viewOptionsUser ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}</span>
                </div>
                {
                    viewOptionsUser && (

                        <div className='absolute w-screen h-screen left-0 top-16 md:top-12 md:left-auto md:right-0 md:w-96 md:h-auto '>
                            <div className='w-full h-full bg-sky-800 relative'>
                                <div>
                                    <div className='flex px-3 py-6'>
                                        <figure className='bg-sky-600/75 rounded-full mr-6 p-2 flex items-center justify-center'>
                                            <img src={hertaLogo} alt='imagen perfil usuario' className='w-8' />
                                        </figure>
                                        <div>
                                            <p className='capitalize text-bold'>{user.username}</p>
                                            <p className='text-yellow-300'>{user.userType !== "admin" ? "Miembro" : "Usuario Administrador"}</p>
                                        </div>
                                    </div>

                                </div>
                                {
                                    user.userType == "admin" && (
                                        <SectionsMenuHeader>
                                            <div className='py-2'>
                                                <span className='px-3 text-xs text-sky-50/75'>Playlist</span>
                                            </div>

                                            <div className='flex items-center w-full hover:bg-sky-600 py-4 cursor-pointer px-6' onClick={() => { navigate('/playlist') }}>
                                                <span className='mr-6'><MdPlaylistPlay size={28} /></span>
                                                <span className=''>Playlist</span>
                                            </div>
                                            <div className='flex items-center w-full hover:bg-sky-600 py-4 cursor-pointer px-6'>
                                                <span className='mr-6'><MdOutlinePlaylistRemove size={28} /></span>
                                                <span>Limpiar Playlist</span>
                                            </div>
                                        </SectionsMenuHeader>
                                    )
                                }
                                <SectionsMenuHeader>
                                    <div className='py-2'>
                                        <span className='px-3 text-xs text-sky-50/75'>Opciones</span>
                                    </div>
                                    <div className='flex items-center w-full hover:bg-sky-600 py-4 cursor-pointer px-6'>
                                        <span className='mr-6'><MdFavorite size={28} /></span>
                                        <span>Favoritos</span>
                                    </div>
                                    <div className='flex items-center w-full hover:bg-sky-600 py-4 cursor-pointer px-6'>
                                        <span className='mr-6'><MdList size={28} /></span>
                                        <span>Listas</span>
                                    </div>
                                </SectionsMenuHeader>

                                <div className='absolute bottom-16 w-full border-t-2 border-sky-400 md:static' onClick={() => {
                                    localStorage.removeItem('UserInfo')
                                    window.location.reload()
                                }}>
                                    <div className='flex items-center w-full hover:bg-sky-600 py-4 cursor-pointer px-6'>
                                        <span className='mr-6'><MdOutlineExitToApp size={28} /></span>
                                        <span >Cerrar sesión</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            {
                viewOptionsUser&& (
                    <div className='absolute h-screen w-screen top-0 left-0 bg-gray-800/70 z-10' onClick={()=>{setviewOptionsUser(false)}}></div>
                )
            }
        </header>
    )
}

export default Header