import {BrowserRouter,Routes,Route} from 'react-router-dom'
import App from '../App'
import Login from '../views/Login/Login'
import HomeScreen from '../views/Home/HomeScreen'
import AnimeInfo from '../views/AnimeInfo/AnimeInfo'
import { AnimeEpisodesView } from '../views/AnimeEpisodesView/AnimeEpisodesView'

export const MainRouters = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' Component={App}/>
            <Route path='/login' Component={Login}/>
            <Route path='/home' Component={HomeScreen}/>
            <Route path='/anime/:id/episodes' Component={AnimeEpisodesView}/>
            <Route path='/anime/info/:anime' Component={AnimeInfo}/>
        </Routes>
    </BrowserRouter>
  )
}
