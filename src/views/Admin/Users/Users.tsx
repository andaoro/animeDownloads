import React, { useEffect, useContext, useState } from 'react'
import TablaResponsive from '../../../components/Tables/Tables'
import axios from '../../../utils/axios/axiosBase';
import { AppLayout } from '../../../components/AppLayout/AppLayout';
import UserContext from '../../../Context/UserContext';
import { useAlerts } from '../../../hooks/useAlerts';
import { AgregarAlerta } from '../../../utils/Helpers';
import { AiOutlineUserAdd, AiOutlineReload } from 'react-icons/ai';
import { ModalsLayout } from '../../../components/ModalsLayout/ModalsLayout';
import { InputText } from '../../../components/Inputs/Text/InputText';
import { UserCreateModal } from '../../../components/Modals/UserCreateModal';

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

type TUserData = {
  enabled: boolean
  id: number
  type: string
  username: string
}

export const Users: React.FC = () => {

  const { user } = useContext(UserContext)
  const [usuarios, setUsuarios] = useState<TUsers[]>([])
  const [ModalVisible, setModalVisible] = useState<boolean>(false)
  const [ModalUpdateVisible, setModalUpdateVisible] = useState<boolean>(false)
  const [userName, setuserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [tipoUsuario, settipoUsuario] = useState<string>('default')
  const { alertas, createNewAlert } = useAlerts()
  const [dataUserUpdate, setdataUserUpdate] = useState<TUserData>({} as TUserData)
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

  useEffect(() => {
    if (dataUserUpdate.id) {
      axios.get(`/users/${dataUserUpdate.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        }
      }).then((response) => {
        setModalUpdateVisible(true)
        setuserName(response.data.username)
        settipoUsuario(response.data.type)
      }).catch((err) => {
        console.error(err)
      })
    }
  }, [dataUserUpdate])

  const ConsultarUsuarios = () => {
    axios.get('/users', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    })
      .then(({ data }: { data: IDataUsers }) => {
        setUsuarios(data.elements)
      }).catch((err) => {
        console.error(err)
      })
  }

  const CambiarEstadoUsuario = async (estadoActual: boolean, id: number) => {
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

  const CrearCliente = () => {
    if (userName.toString().trim() !== "") {
      if (password.toString().trim() !== "") {
        axios.post('/users', {
          username: userName,
          password,
          type: tipoUsuario
        }, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          }
        }).then((response) => {
          setUsuarios(users => [...users, response.data])
          setuserName('')
          setPassword('')
          setModalVisible(false)
        }).catch((err) => {
          console.error(err)
        })
      } else {
        AgregarAlerta(createNewAlert, "Password es requerido", 'warning')
      }
    } else {
      AgregarAlerta(createNewAlert, "Username es requerido", 'warning')
    }

  }

  const ActualizarCliente = () => {
    axios.put(`/users`, {
      id: dataUserUpdate.id,
      username: userName,
      type: tipoUsuario,
      ...(password.toString().trim() !== "" && { password })
    }, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    }).then(() => {
      setUsuarios(prevUsuarios => {
        return prevUsuarios.map(usuario => {
          if (usuario.id === dataUserUpdate.id) {
            return {
              ...usuario,
              username:userName,
              type:tipoUsuario
            };
          }
          return usuario;
        });
      });
      limpiarDatosModal()
      setModalUpdateVisible(false)
    }).catch((err) => {
      console.error(err)
    })
  }

  const limpiarDatosModal = () =>{
    setuserName('')
    setPassword('')
    settipoUsuario('default')
    setdataUserUpdate({} as TUserData)
    setModalVisible(false)
  }

  return (
    <AppLayout>
      <h1 className='text-3xl font-bold text-center py-6'>Administrador De usuarios</h1>
      <section className='mx-14 mb-6 w-auto flex flex-col gap-y-4 sm:gap-x-20 sm:flex-row'>
        <span onClick={() => {
          limpiarDatosModal()
          setModalVisible(true)

        }} className='bg-green-600 cursor-pointer flex  justify-center items-center p-2 rounded gap-x-4'><AiOutlineUserAdd size={28} /><span>Crear Usuario</span></span>
        <span className='bg-sky-800 cursor-pointer flex  justify-center items-center p-2 rounded gap-x-4' onClick={ConsultarUsuarios}><AiOutlineReload size={28} /><span>Recargar Lista</span></span>
      </section>

      <TablaResponsive data={data} estado={CambiarEstadoUsuario} setdataUserUpdate={setdataUserUpdate} />
      {
        ModalVisible && <UserCreateModal setModalVisible={setModalVisible} userName={userName} setuserName={setuserName} password={password} setPassword={setPassword} onButtonClick={CrearCliente} settipoUsuario={settipoUsuario} tipoUsuario={tipoUsuario} buttonText={"Crear"} />
      }
      {
        ModalUpdateVisible && <UserCreateModal setModalVisible={setModalUpdateVisible} userName={userName} setuserName={setuserName} password={password} setPassword={setPassword} onButtonClick={ActualizarCliente} settipoUsuario={settipoUsuario} tipoUsuario={tipoUsuario} buttonText={"Actualizar"} />
      }


      {alertas}
    </AppLayout>
  )
}
