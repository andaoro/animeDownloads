import './styles.css'
import axios from '../../utils/axios/axiosBase'
import logo from '../../components/Icon/logo.svg'
import React, { useContext, useEffect, useRef, useState } from 'react'
import UserContext, { IDataUserProps } from '../../Context/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai"
import PATHS from '../../routers/CONSTPATHS'
import { UserOptions } from './UserOptions'

const Header: React.FC = () => {
    const { user, setUser } = useContext(UserContext)
    const [viewOptionsUser, setviewOptionsUser] = useState(false)
    const { pathname } = useLocation()
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

    

    return (
        <header className='z-50 border-b-2 bg-navbar border-b-white'>
            <div className='flex items-center lg:gap-x-10'>
                <img src={logo} alt='Logo' className='w-12 cursor-pointer md:inline hover:brightness-75' onClick={() => { navigate(PATHS.HOME) }} />
                <span onClick={() => { navigate(PATHS.DIRECTORY) }} className={`hidden md:flex text-lg cursor-pointer font-bold text-Tsecondary hover:text-Tdefault ${pathname == PATHS.DIRECTORY && 'text-Tsecondary'}`}>Directorio</span>
            </div>


            <div className='z-20 flex justify-center w-full gap-4 md:w-auto md:justify-normal lg:gap-x-12 md:relative'>
                <div>
                    <span
                        className='flex p-3 transition-all rounded-full cursor-pointer hover:bg-slate-600'
                        onClick={()=>{navigate(PATHS.SEARCH)}}
                    >
                        <AiOutlineSearch size={25} />
                    </span>
                </div>
                <div onClick={() => { setviewOptionsUser(!viewOptionsUser) }} className='flex items-center cursor-pointer'>
                    <span className='font-bold userName' >{user?.username}</span>
                    <span className='lg:ml-2'>{viewOptionsUser ? <MdOutlineArrowDropUp size={22} /> : <MdOutlineArrowDropDown size={22} />}</span>
                </div>
                {
                    viewOptionsUser && (
                        <UserOptions user={user} />
                    )
                }
            </div>
            {
                viewOptionsUser && (
                    <div className='absolute top-0 left-0 z-10 w-screen h-screen bg-navbar/70' onClick={() => { setviewOptionsUser(false) }}></div>
                )
            }
        </header>
    )
}

export default Header