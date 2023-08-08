import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import Login from '../views/Login/Login';
import HomeScreen from '../views/Home/HomeScreen';
import { AnimeEpisodesView } from '../views/AnimeEpisodesView/AnimeEpisodesView';
import { Reproductor } from '../views/Reproductor/Reproductor';
import { PlaylistLobby } from '../views/Playlist/PlaylistLobby';
import { Users } from '../views/Admin/Users/Users';
import { NotFound } from '../views/NotFound/NotFound';

// Componente de página de error 404

export const MainRouters = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/anime/:id/episodes" element={<AnimeEpisodesView />} />
        <Route path="/episodio/reproducir/:id" element={<Reproductor />} />
        <Route path="/playlist" element={<PlaylistLobby />} />
        <Route path="/users" element={<Users />} />
        <Route path="/animes_downloader" element={<Users />} />

        {/* Ruta de fallback para manejar páginas no encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
