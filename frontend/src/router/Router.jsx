import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home.jsx';
import App from "../App.jsx";
import NotFound from '../components/PageNotFound.jsx'
import ContactUs from '../pages/contactUs/contactUs.jsx'
import Internships from '../pages/jobs/jobs.jsx'
import SignUp from "../pages/LoginAndSignUP/signUp.jsx";
import Login from '../pages/LoginAndSignUP/login.jsx'
import Profile from "../components/profile.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import PrivateRoute from "../PrivateRouter/PrivateRouter.jsx";


export default function Index() {
    let { user } = useContext(AuthContext)

    const router = createBrowserRouter([

        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: '/',
                    element: <Home />
                }, {
                    path: '/home',
                    element: <Home />
                }, {
                    path: '/contactus',
                    element: < ContactUs />
                }, {
                    path: '/internships',
                    element: <PrivateRoute><Internships /></PrivateRoute>
                }, {
                    path: '/profile',
                    element: <PrivateRoute> <Profile /></PrivateRoute>
                }, {
                    path: '*',
                    element: <NotFound />
                },
            ]
        },
        {
            path: '/signup',
            element: <SignUp />
        }, {
            path: '/login',
            element: < Login />
        }, {
            path: '*',
            element: <NotFound />
        }
    ]);

    return (
        <RouterProvider router={router}>

        </RouterProvider>
    )
}

