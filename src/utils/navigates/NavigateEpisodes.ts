import PATHS from "../../routers/CONSTPATHS"
import { IElementsData } from "../../views/AnimeEpisodesView/AnimeEpisodesView"
import { IAnimesDownloadedProps } from "../../views/Home/HomeScreen"

export const NavigateEpisodes = (navigate:any,id:number,title:string) =>{
     navigate(`${PATHS.EPISODES_VIEW.replace(":id",id.toString()).replace(":anime_title",title.replace(/[^\w\s]/gi, "").replace(/[ ]/gi,"-"))}`)
}

export const NavigateReproductor = (navigate:any, id:number, title:string) =>{
     navigate(`${PATHS.PLAYER.replace(":id",id.toString()).replace(":anime_title",title.replace(/[^\w\s]/gi, "").replace(/[ ]/gi,"-"))}`)
}