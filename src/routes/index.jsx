import { lazy } from "react";
import { PATH } from "../constants";
import TeamLayout from "../layouts/TeamLayout";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const TeamSelect = lazy(() => import("../pages/TeamSelect"));
const CheckIns = lazy(() => import("../pages/CheckIns"));
const Report = lazy(() => import("../pages/Report"));
const CreateTaskPage = lazy(() => import("../pages/CreateTaskPage"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  {
    path: PATH.home,
    element: <TeamSelect />,
    defaultLayout: true,
    private: true,
  },
  {
    path: PATH.login,
    element: <Login />,
    private: false,
  },
  {
    path: PATH.teamselect,
    element: <TeamSelect />,
    defaultLayout: true,
    private: true,
  },
  {
    path: PATH.team,
    element: <TeamLayout />,
    defaultLayout: true,
    private: true,
    children: [
      {
        path: "",
        element: <Home />,
        private: true,
      },
      {
        path: PATH.checkins,
        element: <CheckIns />,
        private: true,
      },
      {
        path: PATH.report,
        element: <Report />,
        private: true,
      },
      {
        path: PATH.createTask,
        element: <CreateTaskPage />,
        private: true,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
