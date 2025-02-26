import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";


const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
    //   { path: "/create", element: <Create /> },
    //   { path: "/read/:id", element: <Read /> },
    ],
  },
]);

export default Router;
