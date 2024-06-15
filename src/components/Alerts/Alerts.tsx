import React, { ReactNode } from 'react'
import warningImage from '../../assets/img/toast/hu_tao.png'
import dangerImage from '../../assets/img/toast/qiqiwebp.webp'
import successImage from '../../assets/img/toast/paimon.png'
import successImage2 from '../../assets/img/toast/zhongli.webp'
import { Tvariantes } from '../../utils/Helpers'


type AlertsProps = {
    variante: Tvariantes;
    children: ReactNode
}

export const Alerts: React.FC<AlertsProps> = ({ variante = 'success', children }) => {

    const variantesAlertas = {
        success: {
            style: "bg-lime-600 text-green-50",
            icon: <img src={successImage} alt='success Icon' className='object-cover w-16' />
        },
        success2: {
            style: "bg-lime-600 text-green-50",
            icon: <img src={successImage2} alt='success Icon' className='object-cover w-16' />
        },
        danger: {
            style: "bg-red-500 text-red-50",
            icon: <img src={dangerImage} alt='danger Icon' className='object-cover w-16' />
        },
        warning: {
            style: "bg-yellow-600 text-orange-50",
            icon: <img src={warningImage} alt='warning Icon' className='object-cover w-16' />
        }

    }

    return (
        <div className={`${variantesAlertas[variante].style} p-4 shadow flex max-w-lg rounded-md m-2 justify-center items-center`}>
            <span className='mx-4'>
                {variantesAlertas[variante].icon}
            </span>
            <span className='text-lg '>
                {children}
            </span>

        </div>
    )
}
