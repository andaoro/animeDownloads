import { useState, useEffect } from 'react'
import './styles.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { IDataUserProps } from '../../Context/UserContext'
import { URLAPI } from '../../utils/Helpers'

const Login = () => {
    const [usernameFocused, setusernameFocused] = useState(false)
    const [passwordFocused, setpasswordFocused] = useState(false)
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')
    const [viewPassword, setviewPassword] = useState(false)
    const [errosMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    let userData: string | null = localStorage.getItem('UserInfo')
    let usuario: IDataUserProps;

    useEffect(() => {
        if (userData) {
            usuario = JSON.parse(userData)
            navigate('/home')
        }
    }, [])

    useEffect(() => {
        if (errosMessage.toString().trim() !== "") {
            setTimeout(() => {
                setErrorMessage('')
            }, 2500);
        }
    }, [errosMessage])

    const validarInputUsername = () => {
        if (username.toString().trim() !== '') {
            setusernameFocused(true)
        } else {
            setusernameFocused(false)
        }
    }

    const validarInputPassword = () => {
        if (password.toString().trim() !== '') {
            setpasswordFocused(true)
        } else {
            setpasswordFocused(false)
        }
    }

    const login = () => {
        if (username.toString().trim() !== "" && password.toString().trim() !== "") {
            axios.post(`${URLAPI}/auth/login`, {
                username,
                password
            }).then((response) => {
                if (response.status == 200) {
                    localStorage.setItem("UserInfo", JSON.stringify(response.data))
                    navigate("/home")
                } else {
                    setErrorMessage("Ha ocurrido un error inesperado")
                }
            }).catch((err) => {
                console.error(err)
                if (err.response.status == 401) {
                    setErrorMessage("Usuario o contraseña incorrectos")
                } else {

                }
            })
        } else {
            setErrorMessage("Usuario y contraseña requeridos")
        }
    }

    return (
        <div className='ContainerBody'>
            <div className='ContainerForm'>
                <h1 className=' text-center text-4xl mb-6'>Acceder</h1>
                <div className='FormBody'>
                    <div className={`ContainerInput ${usernameFocused && "ContainerInput--focus"}`}>
                        <label>
                            <div className={`inputTextWrap ${usernameFocused && "inputTextFocused"}`}>
                                <span>Usuario</span>
                            </div>
                            <input
                                type='text'
                                value={username}
                                onChange={(e) => { setusername(e.target.value) }}
                                className='InputLogin'
                                onFocus={() => setusernameFocused(true)}
                                onBlur={validarInputUsername}
                                onKeyUp={(e) => {
                                    if (e.keyCode === 13) {
                                        login()
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div className={`ContainerInput ${passwordFocused && "ContainerInput--focus"}`}>
                        <label>
                            <div className={`inputTextWrap ${passwordFocused && "inputTextFocused"}`}>
                                <span>Contraseña</span>
                            </div>
                            <div>
                                <input
                                    type={viewPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => { setpassword(e.target.value) }}
                                    className='InputLogin'
                                    onFocus={() => setpasswordFocused(true)}
                                    onBlur={validarInputPassword}
                                    style={{ width: "85%" }}
                                    onKeyUp={(e) => {
                                        if (e.keyCode === 13) {
                                            login()
                                        }
                                    }}
                                />
                                <span className='ViewPassword' style={{ display: passwordFocused ? "inline" : "none", cursor: 'pointer' }} onClick={() => setviewPassword(!viewPassword)}>{viewPassword ? "Ocultar" : "Mostrar"}</span>
                            </div>

                        </label>
                    </div>
                    <h3 style={{ marginTop: "1rem", color: '#fc8b3b', display: errosMessage.toString() !== "" ? "" : "none" }}>{errosMessage}</h3>
                </div>
                <button className='btnAcceder' onClick={login}>Acceder</button>
            </div>
        </div>
    )
}

export default Login