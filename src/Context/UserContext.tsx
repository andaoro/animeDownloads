import React,{useState} from 'react'

export interface IDataUserProps {
    accessToken:string,
    userType:string,
    username:string
}

interface IUser{
    user:IDataUserProps,
    setUser:(user:IDataUserProps)=>void
}

const UserContext = React.createContext<IUser>({} as IUser) 

export const UserProvider:React.FC<any> = ({children}) =>{
    const [user, setUser] = useState({
        accessToken:"",
        userType:"",
        username:""
    })

    return(
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}


export default UserContext

