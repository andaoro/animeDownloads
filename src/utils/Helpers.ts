export const URLAPI = "https://animedownloader.jmarango.co/api"

export const URL_IMAGENES = import.meta.env.VITE_BASE_URL_MEDIA || ''

export const AgregarAlerta = (createToast: any, texto: string, variante: "success" | "danger" | "warning") => {
    createToast({
        text: texto,
        variant: variante
    })
}