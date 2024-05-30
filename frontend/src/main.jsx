import ReactDOM from 'react-dom/client'
import './index.css'
import Router from './router/Router.jsx'
import AuthProvider from './contexts/AuthProvider.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(

   <AuthProvider>
      <Router  />
   </AuthProvider>,

)
