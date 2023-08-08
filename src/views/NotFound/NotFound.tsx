import React from 'react'
import { Images } from '../../utils/Helpers'

export const NotFound: React.FC = () => {
    return (
        <section className='flex justify-center items-center w-screen h-screen flex-col bg-black'>
            <picture className='flex items-center justify-center py-6'>
                <img src={Images.hu_tao_error} className='w-40 text' />
            </picture>
            <p className='w-64 sm:w-auto sm:text-4xl text-gray-100 text-center'>Lo sentimos no hemos encontrado lo que buscabas</p>
            <a className='mt-12 underline cursor-pointer text-sky-300 text-xl' href='/'>Regresar al inicio</a>
        </section>
    )
}
