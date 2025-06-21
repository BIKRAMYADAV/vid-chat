import {Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage'
import { SocketProvider } from './providers/Socket'

function App() {
  return (
    <Routes>
      <SocketProvider>
      <Route path='/' element={<Homepage/>} />
      <Route path='/add' element = {<h1>add</h1>}/>
      </SocketProvider>
    </Routes>
   
    
  )
  
}

export default App
