import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const FormatedFecha = (fecha: string) => {
    // Parsea la fecha en formato ISO
    const fechaISO = parseISO(fecha);

    // Formatea la fecha en el formato deseado (mes y día de la semana)
    const fechaFormateada = format(fechaISO, 'EEEE dd MMMM', { locale: es });

    return fechaFormateada;
}