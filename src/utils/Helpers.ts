import qiqiImage from '../assets/img/qiqiwebp.webp'
import hu_tao_error from '../assets/img/hu_tao_error.png'

export const URLAPI = "https://animedownloader.jmarango.co/api"
export const URL_IMAGENES = import.meta.env.VITE_BASE_URL_MEDIA || ''

export const Images = {
    qiqiImage,
    hu_tao_error
}

export type Tvariantes = "success" | "danger" | "warning" | "success2"

export const AgregarAlerta = (createToast: any, texto: string, variante: Tvariantes) => {
    createToast({
        text: texto,
        variant: variante
    })
}