import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import About from "./About";
import Settings from "./Settings";
import NotFound from "./NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ]
    }
]);

export default router;