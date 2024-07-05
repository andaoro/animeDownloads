import React from 'react'
import hertaLogo from '../../assets/gifs/herta-loading.gif'
import adminIcon from '../../assets/img/icons/adminIcon.jpg'
import npcIcon from '../../assets/img/icons/npcIcon.jpg'
import { MdFavorite, MdList, MdOutlineExitToApp, MdPlaylistPlay } from 'react-icons/md'
import { FaUsers } from 'react-icons/fa'
import { BsFillCollectionPlayFill } from 'react-icons/bs'
import { GoFileDirectoryFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom'
import PATHS from '../../routers/CONSTPATHS'

type user = {
    accessToken: string,
    userType: string,
    username: string
}

interface IPropsUserOptions {
    user: user
}

const SectionsMenuHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <section className='py-2 border-t-2 border-Tdefault'>
            {children}
        </section>
    )
}

export const UserOptions: React.FC<IPropsUserOptions> = ({ user }) => {

    const navigate = useNavigate()
    return (
        <div className='absolute left-0 w-screen h-screen top-16 md:top-12 md:left-auto md:right-0 md:w-96 md:h-auto '>
            <div className='relative w-full h-full bg-navbar'>
                <div>
                    <div className='flex px-3 py-6'>
                        <div className='flex items-center justify-center w-16 mr-6 rounded-full bg-Rsecondary'>
                            <img src={user.userType == "admin" ? adminIcon : npcIcon} alt='imagen perfil usuario' className='w-full rounded-full' />
                        </div>
                        <div>
                            <p className='capitalize text-bold'>{user.username}</p>
                            <p className={`${user.userType !== "admin" ? 'text-Rsecondary' : 'text-yellow-300'}`}>{user.userType !== "admin" ? "Miembro" : "👑 Usuario Administrador"}</p>
                        </div>
                    </div>

                </div>
                {
                    user.userType == "admin" && (
                        <SectionsMenuHeader>
                            <div className='py-2'>
                                <span className='px-3 text-xs text-sky-50/75'>Administrador</span>
                            </div>

                            <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary' onClick={() => { navigate(PATHS.PLAYLIST_LOBBY) }}>
                                <span className='mr-6'><MdPlaylistPlay size={28} /></span>
                                <span className=''>Playlist</span>
                            </div>
                            <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary text-Tdefault' onClick={() => { navigate(PATHS.USERS) }}>
                                <span className='mr-6'><FaUsers size={28} /></span>
                                <span>Usuarios</span>
                            </div>
                            <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary' onClick={() => { navigate(PATHS.ANIMES_DOWNLOADER) }}>
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
                    <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary' onClick={() => { navigate(PATHS.DIRECTORY) }}>
                        <span className='mr-6'><GoFileDirectoryFill size={28} /></span>
                        <span>Directorio</span>
                    </div>
                    <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary'>
                        <span className='mr-6'><MdFavorite size={28} /></span>
                        <span>Favoritos</span>
                    </div>
                    <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary'>
                        <span className='mr-6'><MdList size={28} /></span>
                        <span>Listas</span>
                    </div>
                </SectionsMenuHeader>

                <div className='absolute w-full border-t-2 bottom-16 border-Tdefault md:static' onClick={() => {
                    localStorage.removeItem('UserInfo')
                    window.location.reload()
                }}>
                    <div className='flex items-center w-full px-6 py-4 cursor-pointer hover:bg-Rsecondary'>
                        <span className='mr-6'><MdOutlineExitToApp size={28} /></span>
                        <span >Cerrar sesión</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
