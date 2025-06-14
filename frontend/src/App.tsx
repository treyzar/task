import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Users from "./pages/Users";
import Tags from "./pages/Tags";
import Tasks from "./pages/Tasks";
import "./styles/global.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "tags",
        element: <Tags />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
