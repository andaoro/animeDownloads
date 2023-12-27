import React from 'react'
import hertaLogo from '../../assets/gifs/herta-loading.gif'
import { MdFavorite, MdList, MdOutlineExitToApp, MdPlaylistPlay } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'
import { BsFillCollectionPlayFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'

type user = {
    accessToken:string,
    userType:string,
    username:string
}

interface IPropsUserOptions {
    user:user
}

const SectionsMenuHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className=' border-t-2 py-2 border-Tdefault'>
            {children}
        </section>
    )
}

export const UserOptions: React.FC<IPropsUserOptions> = ({ user }) => {

    const navigate = useNavigate()
    return (
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

                            <div className='flex items-center w-full hover:bg-Rsecondary py-4 cursor-pointer px-6' onClick={() => { navigate(PATHS.PLAYLIST_LOBBY) }}>
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
