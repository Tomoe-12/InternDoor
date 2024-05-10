import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer.jsx'

function App() {

  return (
    <>
      <Navbar />

      <div className='min-h-screen'>
        <Outlet />
      </div>

      <Footer />

    </>
  )
}

export default App
