import './styles.css'
import logo from '../../assets/img/enderythead.png'
import React, { useContext, useEffect } from 'react'
import UserContext, { IDataUserProps } from '../../Context/UserContext'
import { useNavigate } from 'react-router-dom'

const Header:React.FC = () => {
    const navigate = useNavigate()
    let userData: string | null = localStorage.getItem('UserInfo')
    let usuario: IDataUserProps;
    const { user,setUser } = useContext(UserContext)

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
            <img src={logo} alt='Logo' style={{ width: '40px',cursor:'pointer' }} onClick={()=>{navigate('/home')}}/>
            <span className='userName'>{user?.username}</span>
            <span style={{cursor:'pointer'}} onClick={()=>{
                localStorage.removeItem('UserInfo')
                window.location.reload()
                }}>Close Sesion</span>
        </header>
    )
}

export default Header