import ReactDOM from 'react-dom/client'
import { MainRouters } from './routers/MainRouters.tsx'
import './stylesMain.css'
import { UserProvider } from './Context/UserContext.tsx'
import 'tailwindcss/tailwind.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <UserProvider>
        <MainRouters />
    </UserProvider>

)
