
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home.jsx';
import App from "../App.jsx";
import NotFound from '../components/PageNotFound.jsx'
import ContactUs from '../pages/contactUs/contactUs.jsx'
import Jobs from '../pages/jobs/jobs.jsx'
import SignInAndSignUp from '../components/SignInAndSignUp.jsx'
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
                path: '/jobs',
                element: <Jobs />
            }, {
                path: '/login',
                element: < SignInAndSignUp />
            }, {
                path: '/signup',
                element: <SignInAndSignUp />
            }, {
                path: '*',
                element: <NotFound />
            },
        ]
    }
]);
export default router