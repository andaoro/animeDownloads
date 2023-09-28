import React from 'react'
import { URL_IMAGENES } from '../../utils/Helpers'
import {useSortable} from '@dnd-kit/sortable'
import { CSS} from "@dnd-kit/utilities";

interface IPropsElementsPlaylist {
    id: number,
    animeId: number,
    animeTitle: string,
    episodeTitle: string,
    episodeNumber: number,
    totalEpisodes: number,
    optionDownloaded: string,
    dateDownloaded: string,
    url: string,
    imageUrl: string
}

type PropsLists = {
    item:IPropsElementsPlaylist,
    index:number
}

export const List:React.FC<PropsLists> = ({ index,item }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id:item.id
    })

    const style = {
        transform:CSS.Transform.toString(transform),
        transition
    }

    return (
        <div
        /* ref={setNodeRef}
        style={style}
        {...attributes} 
        {...listeners} */
        className='flex border-b-2 border-b-Tdefault py-2' key={index}>
            <span className='flex items-end px-2'>{index + 1}.</span>
            <img
                src={`${URL_IMAGENES}${item.imageUrl}`}
                alt={`Imagen previa de anime ${item.animeTitle} episodio ${item.episodeNumber}`}
                className=' w-32 h-20 object-cover'
            />
            <div className='flex flex-col max-w-[200px] px-4 truncate'>
                <span>{item.animeTitle}</span>
                <span>Episodio - {item.episodeNumber}</span>
            </div>
        </div>
    )
}
