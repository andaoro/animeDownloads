import React from 'react'
import { ModalsLayout } from '../ModalsLayout/ModalsLayout'
import { InputText } from '../Inputs/Text/InputText'
import { AiOutlineUserAdd } from 'react-icons/ai'

type PropsModalUser = {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
    userName: string,
    setuserName: React.Dispatch<React.SetStateAction<string>>
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>
    onButtonClick: () => any
    settipoUsuario: React.Dispatch<React.SetStateAction<string>>
    tipoUsuario: string
}

export const UserUpdateModal: React.FC<PropsModalUser> = ({ setModalVisible, userName, setuserName, password, setPassword, onButtonClick, settipoUsuario, tipoUsuario }) => {
    return (
        <ModalsLayout modalVisible={setModalVisible}>
            <div className='flex flex-col px-14 py-12'>
                <span className='flex items-center justify-center gap-x-6 py-2 '><AiOutlineUserAdd size={28} /><span className='text-xl'>Actualizar Usuario</span></span>
                <InputText texto={"Usuario"} valueText={userName} setValueText={setuserName} />
                <InputText texto={"Contraseña"} valueText={password} setValueText={setPassword} typeInput='password' />
                <span className='text-xs py-1 text-gray-300'>Tipo de usuario</span>
                <select value={tipoUsuario} className='bg-gray-800 border-2 border-gray-600 outline-none rounded p-2 [&>option]:py-2' onChange={(e) => { settipoUsuario(e.target.value) }}>
                    <option value={"default"}>Miembro</option>
                    <option value={"admin"}>Administrador</option>
                </select>

                <button className='mt-12 bg-sky-600 py-2 rounded' onClick={onButtonClick}>Crear</button>
            </div>
        </ModalsLayout>
    )
}
