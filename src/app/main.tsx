import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../shared/styles/index.scss";
import { App } from "./App";
import { TaskDetailsPage } from "../pages/tasks/TaskDetailsPage";
import { UsersPage } from "../pages/users/UsersPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TasksPage } from "../pages/tasks/TasksPage";
import { LabelsPage } from "../pages/labels/LabelsPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <TasksPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskDetailsPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "labels",
        element: <LabelsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
