import React, { ReactNode } from 'react'
import warningImage from '../../assets/img/hu_tao.png'
import dangerImage from '../../assets/img/qiqiwebp.webp'
import successImage from '../../assets/img/paimon.png'


type AlertsProps = {
    variante: "success" | "danger" | "warning";
    children: ReactNode
}

export const Alerts: React.FC<AlertsProps> = ({ variante = 'success', children }) => {

    const variantesAlertas = {
        success: {
            style: "bg-lime-600 text-green-50",
            icon: <img src={successImage} alt='warning Icon' className='w-16 object-cover' />
        },
        danger: {
            style: "bg-red-500 text-red-50",
            icon: <img src={dangerImage} alt='warning Icon' className='w-16 object-cover' />
        },
        warning: {
            style: "bg-yellow-600 text-orange-50",
            icon: <img src={warningImage} alt='warning Icon' className='w-16 object-cover' />
        }

    }

    return (
        <div className={`${variantesAlertas[variante].style} p-4 shadow flex max-w-lg rounded-md m-2 justify-center items-center`}>
            <span className='mx-4'>
                {variantesAlertas[variante].icon}
            </span>
            <span className=' text-lg'>
                {children}
            </span>

        </div>
    )
}
