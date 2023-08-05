import ReactDOM from 'react-dom/client'
import { MainRouters } from './routers/MainRouters.tsx'
import { UserProvider } from './Context/UserContext.tsx'
import './stylesMain.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <UserProvider>
        <MainRouters />
    </UserProvider>

)
