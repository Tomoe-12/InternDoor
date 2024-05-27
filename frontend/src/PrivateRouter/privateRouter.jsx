import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider'
import { Navigate, useLocation } from 'react-router-dom'
import Loading from '../components/loading.jsx'

const PrivateRouter = ({ children }) => {
    const { user } = useContext(AuthContext)
    const location = useLocation()


    if (user) {
        return <>{children}</>
    }

    return (

        <Navigate to='/login' state={{ from: location }} replace>
            {alert('Login First')}
        </Navigate>
    )
}

export default PrivateRouter