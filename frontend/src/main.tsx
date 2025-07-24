
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import {SocketProvider} from './contexts/SocketProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <Router>
       <SocketProvider>
         <App />
       </SocketProvider>
   
    </Router>
)
