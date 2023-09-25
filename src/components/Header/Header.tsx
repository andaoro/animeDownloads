import './styles.css'
import axios from '../../utils/axios/axiosBase'
import hertaLogo from '../../assets/gifs/herta-loading.gif'
import logo from '../../assets/img/enderythead.png'
import React, { useContext, useEffect, useState } from 'react'
import UserContext, { IDataUserProps } from '../../Context/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdPlaylistPlay, MdOutlinePlaylistRemove, MdFavorite, MdList, MdOutlineExitToApp, MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { BsFillCollectionPlayFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai"
import PATHS from '../../routers/CONSTPATHS'

const Header: React.FC = () => {
    const { user, setUser } = useContext(UserContext)
    const [viewOptionsUser, setviewOptionsUser] = useState(false)
    const {pathname} = useLocation()
    const navigate = useNavigate()
    let userData: string | null = localStorage.getItem('UserInfo')
    let usuario: IDataUserProps;

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
            <section className=' border-t-2 py-2 border-Tdefault'>
                {children}
            </section>
        )
    }

    return (
        <header className=' bg-navbar z-50 border-b-2 border-b-white'>
            <img src={logo} alt='Logo' style={{ width: '40px', cursor: 'pointer' }} className='hidden md:inline' onClick={() => { navigate(PATHS.HOME) }} />

            <div className='flex justify-center w-full md:w-auto md:justify-normal gap-x-12 md:relative z-20'>
                <span onClick={()=>{navigate(PATHS.HOME)}} className={` text-lg cursor-pointer font-bold text-Tsecondary hover:text-Tdefault ${pathname == PATHS.HOME && 'text-Tsecondary'}`}>Inicio</span>
                <span onClick={()=>{navigate(PATHS.DIRECTORY)}} className={` text-lg cursor-pointer font-bold text-Tsecondary hover:text-Tdefault ${pathname == PATHS.DIRECTORY && 'text-Tsecondary'}`}>Directorio</span>
                {/* <label className='hidden md:flex justify-center items-center relative bg-sky-950 rounded-xl px-2 py-1'>
                    <input type='text' placeholder='Buscar...' className='bg-transparent outline-none px-2 text-blue-100 placeholder:text-blue-300'/>
                    <span className=''><AiOutlineSearch size={20} /></span>
                </label> */}
                <div onClick={() => { setviewOptionsUser(!viewOptionsUser) }} className='flex items-center cursor-pointer'>
                    <span className='userName font-bold' >{user?.username}</span>
                    <span className='ml-2'>{viewOptionsUser ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}</span>
                </div>
                {
                    viewOptionsUser && (

                        <div className='absolute w-screen h-screen left-0 top-16 md:top-12 md:left-auto md:right-0 md:w-96 md:h-auto '>
                            <div className='w-full h-full bg-navbar relative'>
                                <div>
                                    <div className='flex px-3 py-6'>
                                        <figure className='bg-Rsecondary rounded-full mr-6 p-2 flex items-center justify-center'>
                                            <img src={hertaLogo} alt='imagen perfil usuario' className='w-8' />
                                        </figure>
                                        <div>
                                            <p className='capitalize text-bold'>{user.username}</p>
                                            <p className='text-Rsecondary'>{user.userType !== "admin" ? "Miembro" : "Usuario Administrador"}</p>
                                        </div>
                                    </div>

                                </div>
                                {
                                    user.userType == "admin" && (
                                        <SectionsMenuHeader>
                                            <div className='py-2'>
                                                <span className='px-3 text-xs text-sky-50/75'>Administrador</span>
                                            </div>

                                            <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6' onClick={() => { navigate('/playlist') }}>
                                                <span className='mr-6'><MdPlaylistPlay size={28} /></span>
                                                <span className=''>Playlist</span>
                                            </div>
                                            <div className='flex items-center w-full hover:bg-Rsecondary text-Tdefault  py-4 cursor-pointer px-6' onClick={() => { navigate('/users') }}>
                                                <span className='mr-6'><FaUsers size={28} /></span>
                                                <span>Usuarios</span>
                                            </div>
                                            <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6' onClick={() => { navigate('/animes_downloader') }}>
                                                <span className='mr-6'><BsFillCollectionPlayFill size={28} /></span>
                                                <span>Animes</span>
                                            </div>
                                        </SectionsMenuHeader>
                                    )
                                }
                                <SectionsMenuHeader>
                                    <div className='py-2'>
                                        <span className='px-3 text-xs text-sky-50/75'>Opciones</span>
                                    </div>
                                    <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6'>
                                        <span className='mr-6'><MdFavorite size={28} /></span>
                                        <span>Favoritos</span>
                                    </div>
                                    <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6'>
                                        <span className='mr-6'><MdList size={28} /></span>
                                        <span>Listas</span>
                                    </div>
                                </SectionsMenuHeader>

                                <div className='absolute bottom-16 w-full border-t-2 border-Tdefault md:static' onClick={() => {
                                    localStorage.removeItem('UserInfo')
                                    window.location.reload()
                                }}>
                                    <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6'>
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
                viewOptionsUser && (
                    <div className='absolute h-screen w-screen top-0 left-0 bg-navbar/70 z-10' onClick={() => { setviewOptionsUser(false) }}></div>
                )
            }
        </header>
    )
}

export default Header