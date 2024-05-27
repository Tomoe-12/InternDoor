import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home.jsx';
import App from "../App.jsx";
import NotFound from '../components/PageNotFound.jsx'
import ContactUs from '../pages/contactUs/contactUs.jsx'
import Internships from '../pages/jobs/jobs.jsx'
import SignUp from "../pages/LoginAndSignUP/signUp.jsx";
import Login from '../pages/LoginAndSignUP/login.jsx'
import PrivateRouter from "../PrivateRouter/privateRouter.jsx";
import Profile from "../components/profile.jsx";
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
                element: <PrivateRouter><Internships /> </PrivateRouter>
            }, {
                path: '/profile',
                element: <PrivateRouter><Profile /> </PrivateRouter>
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
export default router