import {Routes, Route} from 'react-router-dom'
import Homepage from './pages/Homepage'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage/>} />
      <Route path='/add' element = {<h1>add</h1>}/>
    </Routes>
   
    
  )
  
}

export default App
