import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppLayout } from '../../components/AppLayout/AppLayout'
import UserContext from '../../Context/UserContext';
import axios from '../../utils/axios/axiosBase';
import { IAnimesDownloadedProps } from '../Home/HomeScreen';
import { HomeCards } from '../Home/HomeCards';
import { URL_IMAGENES } from '../../utils/Helpers';
import { FormatedFecha } from '../../helpers/Helpers';
import { NavigateEpisodes } from '../../utils/navigates/NavigateEpisodes';
import { useNavigate } from 'react-router-dom';
import { Herta } from '../../utils/Assets';

export const Search: React.FC = () => {
    const [text_buscar, settext_buscar] = useState('')
    const [loadingResults, setloadingResults] = useState(true)
    const previousTextBuscarRef = useRef(text_buscar);
    const { user } = useContext(UserContext)
    const [results, setresults] = useState<IAnimesDownloadedProps[]>([] as IAnimesDownloadedProps[])
    const navigate = useNavigate()

    useEffect(() => {
        let timer: any;
        if (text_buscar.length > 1) {
            setloadingResults(true)
        }
        if (text_buscar !== previousTextBuscarRef.current) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            previousTextBuscarRef.current = text_buscar;
            if (text_buscar !== "" && user.accessToken.toString() !== "") {
                Buscador()
            } else {
                setloadingResults(false)
                setresults([])
            }
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [text_buscar]);

    const Buscador = async () => {
        try {
            const data = await axios.get(`/downloaded/search?q=${text_buscar}&page=0`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                }
            })

            setresults(data.data.elements)
        } catch (error) {
            console.error(error)
        } finally {
            setloadingResults(false)
        }
    }

    const handleChangeSearched = (e: React.ChangeEvent<HTMLInputElement>) => {
        settext_buscar(e.target.value)
    }
    return (
        <AppLayout>
            <section className='w-screen bg-gray-800 min-h-[100px] flex md:justify-center items-center px-3'>
                <input
                    type='text'
                    className=' bg-transparent outline-none border-b-2 border-b-orange-500 w-full md:w-1/3 placeholder:text-2xl placeholder:font-medium'
                    placeholder='Buscar...'
                    value={text_buscar}
                    onChange={handleChangeSearched}
                />
            </section>

            {
                loadingResults ? (
                    <div className='flex justify-center items-center w-screen my-12 flex-col gap-y-4'>
                        <img
                            src={Herta}
                            className='w-24 h-24 mr-8'
                        />
                        <span>Cargando...</span>
                    </div>
                ) : (
                    <section className='w-full flex justify-center'>
                        <div className=' grid w-2/3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'>
                            {
                                results.map((anime, index) => (
                                    <div className="h-96 relative group cursor-pointer" key={index} onClick={() => { NavigateEpisodes(navigate, anime.id, anime.title) }}>
                                        <img
                                            src={`${URL_IMAGENES}${anime.imageUrl}`}
                                            alt="Imagen de portada"
                                            className="w-full h-96 brightness-75 opacity-80 group-hover:brightness-100 hover:scale-105 transition-all rounded object-cover"
                                        />
                                        <span className="absolute bottom-4 mx-4 font-bold cursor-pointer group-hover:bottom-2 transition-all">{anime.title}</span>
                                    </div>
                                ))
                            }
                        </div>

                    </section >
                )
            }
        </AppLayout >
    )
}
