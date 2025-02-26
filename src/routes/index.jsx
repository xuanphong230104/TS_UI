import { lazy } from "react";
import { PATH } from "../constants";

const Home = lazy(() => import("../pages/Home"));
const Checkins = lazy(() => import("../pages/Checkins"));
const Login = lazy(() => import("../pages/Login"));
const TeamSelect= lazy(() => import("../pages/TeamSelect"));
const NotFound = lazy(() => import("../pages/NotFound"));
const CreateTaskPage = lazy(() => import("../pages/CreateTaskPage"));
export const routes = [
  {
    path: PATH.home,
    element: <Home />,
    defaultLayout: true,
    private: false,
  },
  {
    path: PATH.login,
    element: <Login />,
    private: false,
  },
  {
    path: PATH.checkins,
    element: <Checkins />,
    defaultLayout: true,
    private: false,
  },
  {
    path: PATH.createTask,
    element: <CreateTaskPage />,
    defaultLayout: true,
    private: false,
  },
  {
    path: PATH.teamselect,
    element: <TeamSelect />,
    defaultLayout: true,
    private: false,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
