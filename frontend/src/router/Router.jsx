
import {createBrowserRouter} from "react-router-dom";
import Home from '../pages/home/Home.jsx';
import App from "../App.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            }
        ]
    },
]);
export default router