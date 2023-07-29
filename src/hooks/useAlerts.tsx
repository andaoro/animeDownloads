import React, { ReactNode, useState } from 'react'
import { Alerts } from '../components/Alerts/Alerts';

type ToastFunction = (options: ToastType) => void;
type ToastType = {
    text: string,
    variant: "success" | "danger" | "warning";
}

type UseAlertReturnType = {
    alertas: ReactNode;
    createNewAlert: ToastFunction;
};


export const useAlerts = (): UseAlertReturnType => {

    const [listAlerts, setlistAlerts] = useState<ToastType[]>([])

    const createNewAlert = (options:ToastType) =>{
        setlistAlerts([...listAlerts,options])
        setTimeout(() => {
            setlistAlerts(list => list.slice(1))
        }, 3000);
    }

    const alertas = (
        <div className='fixed top-0 right-2 z-[1000]'>
            {
                listAlerts.map((alerta,index)=>(
                    <Alerts key={index} variante={alerta.variant}>{alerta.text}</Alerts>
                ))
            }
        </div>
    )



    return {
        alertas,
        createNewAlert
    }
}
