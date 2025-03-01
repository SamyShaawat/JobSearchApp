import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import SignUp from "../pages/SignUp.jsx";
import SignIn from "../pages/SignIn.jsx";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
    ],
  },
]);

export default Router;
