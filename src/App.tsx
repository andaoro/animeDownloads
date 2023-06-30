import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from "./Context/UserContext"
import { IDataUserProps } from "./Context/UserContext"


function App() {

  const navigate = useNavigate()
  let userData: string | null = localStorage.getItem('UserInfo')
  let usuario: IDataUserProps;
  const { setUser } = useContext(UserContext)

  useEffect(() => {
    if (userData) {
      usuario = JSON.parse(userData)
      setUser(usuario)
      navigate('/home')
    } else {
      navigate('/login')
    }
  }, [userData])


  return (
    <h1>

    </h1>
  )
}

export default App
