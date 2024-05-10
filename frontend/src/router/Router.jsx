
import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home.jsx';
import App from "../App.jsx";
import NotFound from '../components/PageNotFound.jsx'
import ContactUs from '../pages/contactUs/contactUs.jsx'
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },{
                path: '/contactus',
                element: < ContactUs/>
            }, {
                path: '*',
                element: <NotFound />
            }
        ]
    }
]);
export default router