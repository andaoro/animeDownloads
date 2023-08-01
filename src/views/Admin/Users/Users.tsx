import React, { useEffect, useContext, useState } from 'react'
import TablaResponsive from '../../../components/Tables/Tables'
import axios from '../../../utils/axios/axiosBase';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import UserContext from '../../../Context/UserContext';
import { useAlerts } from '../../../hooks/useAlerts';
import { AgregarAlerta } from '../../../utils/Helpers';
import { AiOutlineUserAdd , AiOutlineReload } from 'react-icons/ai';

interface TablaData {
    headers: string[];
    rows: TUsers[];
}

type TUsers = {
    enabled: boolean,
    id: number,
    type: string,
    username: string
}

interface IDataUsers {
    actualPage: number,
    elements: TUsers[]
    totalElements: number,
    totalPages: number
}

export const Users: React.FC = () => {

    const { user } = useContext(UserContext)
    const [usuarios, setUsuarios] = useState<TUsers[]>([])
    const { alertas, createNewAlert } = useAlerts()
    const Columns = ['id', 'Tipo', 'Usuario', 'Acciones']

    const data: TablaData = {
        headers: Columns,
        rows: usuarios
    }

    useEffect(() => {
        if (user && user.accessToken.toString() !== "") {
            ConsultarUsuarios()
        }
    }, [user])



    const ConsultarUsuarios = () => {
        axios.get('/users', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`
            }
        })
            .then(({ data }: { data: IDataUsers }) => {
                setUsuarios(data.elements)
            }).catch((err) => {
                console.log(err)
            })
    }

    const CambiarEstadoUsuario = async(estadoActual: boolean, id: number) => {
        try {
            const url = estadoActual ? `/users/${id}/disable` : `/users/${id}/enable`;
        
            const response = await axios.patch(url, {}, {
              headers: {
                Authorization: `Bearer ${user.accessToken}`
              }
            });
        
            if (response.status === 200) {
              setUsuarios(prevUsuarios => {
                return prevUsuarios.map(usuario => {
                  if (usuario.id === id) {
                    return {
                      ...usuario,
                      enabled: !estadoActual
                    };
                  }
                  return usuario;
                });
              });
        
              // Muestra una alerta de éxito
              AgregarAlerta(createNewAlert, `${estadoActual ? 'Deshabilitado' : 'Habilitado'} con éxito`, estadoActual ? 'success2' : 'success');
            } else {
              // Muestra una alerta de error
              AgregarAlerta(createNewAlert, 'Algo parece haber fallado', 'danger');
            }
          } catch (error) {
            // Muestra una alerta de error
            AgregarAlerta(createNewAlert, 'Parece que ha ocurrido un error', 'danger');
            console.error(error);
          }
    }



    return (
        <AppLayout>
            <h1 className='text-3xl font-bold text-center py-6'>Administrador De usuarios</h1>
            <div className='mx-14 mb-6 w-auto flex gap-x-20'>
                <span className='bg-green-600 cursor-pointer flex  justify-center items-center p-2 rounded gap-x-4'><AiOutlineUserAdd size={28}/><span>Crear Usuario</span></span>
                <span className='bg-sky-800 cursor-pointer flex  justify-center items-center p-2 rounded gap-x-4' onClick={ConsultarUsuarios}><AiOutlineReload size={28}/><span>Recargar Lista</span></span>
            </div>
            
            <TablaResponsive data={data} estado={CambiarEstadoUsuario} />
            {alertas}
        </AppLayout>
    )
}
