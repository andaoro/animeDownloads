import React, { useContext, useEffect } from 'react'
import { ReproductorLayout } from '../../components/ReproductorLayout/ReproductosLayout'
import axios from 'axios'
import UserContext from '../../Context/UserContext'

export const PlaylistLobby: React.FC = () => {

    const { user } = useContext(UserContext)

    useEffect(() => {
        if(user.accessToken !== ""){
            obtenerPlaylistActual()
        }
    }, [user])
    

    const obtenerPlaylistActual = () =>{
        axios.get(`https://animedownloader.jmarango.co/api/playlist`,
        {
            headers:{
                Authorization:`Bearer ${user.accessToken}`
            }
        }).then((response)=>{
            console.log(response)
        }).catch((err)=>{
            console.log(err)
        })
    }

    return (
        <ReproductorLayout>
            <h1>Hola mundo</h1>
        </ReproductorLayout>
    )
}
