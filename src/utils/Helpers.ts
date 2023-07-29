export const URLAPI = "https://animedownloader.jmarango.co/api"

export const URL_IMAGENES = "https://animedownloader.jmarango.co"

export const AgregarAlerta = (createToast: any, texto: string, variante: "success" | "danger" | "warning") => {
    createToast({
        text: texto,
        variant: variante
    })
}