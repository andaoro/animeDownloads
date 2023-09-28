import App from '../App';
import Login from '../views/Login/Login';
import HomeScreen from '../views/Home/HomeScreen';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimeEpisodesView } from '../views/AnimeEpisodesView/AnimeEpisodesView';
import { Reproductor } from '../views/Reproductor/Reproductor';
import { PlaylistLobby } from '../views/Playlist/PlaylistLobby';
import { Users } from '../views/Admin/Users/Users';
import { NotFound } from '../views/NotFound/NotFound';
import { AnimesDownloader } from '../views/Admin/Animes/AnimesDownloader';
import PATHS from './CONSTPATHS';
import { Directory } from '../views/Directory/Directory';
import { Playlist } from '../views/Playlist/Playlist';

// Componente de página de error 404

export const MainRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.HOME} element={<HomeScreen />} />
        <Route path={PATHS.EPISODES_VIEW} element={<AnimeEpisodesView />} />
        <Route path={PATHS.PLAYER} element={<Reproductor />} />
        <Route path={PATHS.PLAYLIST_LOBBY} element={<PlaylistLobby />} />
        <Route path={PATHS.PLAYLIST} element={<Playlist />} />
        <Route path={PATHS.USERS} element={<Users />} />
        <Route path={PATHS.ANIMES_DOWNLOADER} element={<AnimesDownloader />} />
        <Route path={PATHS.DIRECTORY} element={<Directory/>}/>

        {/* Ruta de fallback para manejar páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
