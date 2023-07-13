import './styles.css'
import logo from '../../assets/img/enderythead.png'
import React, { useContext, useEffect, useState } from 'react'
import UserContext, { IDataUserProps } from '../../Context/UserContext'
import { useNavigate } from 'react-router-dom'

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

    return (
        <header>
            <img src={logo} alt='Logo' style={{ width: '40px', cursor: 'pointer' }} onClick={() => { navigate('/home') }} />

            <div className='containerOptions'>
                <span className='userName' onClick={() => { setviewOptionsUser(!viewOptionsUser) }}>{user?.username}</span>
                {
                    viewOptionsUser && (
                        <div className='Options_Menu'>
                            <p className='CloseSession' onClick={() => {
                                localStorage.removeItem('UserInfo')
                                window.location.reload()
                            }}>Close Sesion</p>
                        </div>
                    )
                }
            </div>
        </header>
    )
}

export default Header