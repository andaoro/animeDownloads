import ReactDOM from 'react-dom/client'
import { MainRouters } from './routers/MainRouters.tsx'
import './stylesMain.css'
import { UserProvider } from './Context/UserContext.tsx'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <UserProvider>
        <MainRouters />
    </UserProvider>

)
