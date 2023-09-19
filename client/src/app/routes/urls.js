import { Navigate } from "react-router-dom";
import PageNotFound from "../404/PageNotFound";
import Login from "../login/Login";
import Logout from "../logout/Logout.jsx";
import UserProfile from "../profile/UserProfile";

export const protectedUrls = [
  { title: "Profile", path: "/profile/me", Component: <UserProfile /> }
];

export const publicUrls = [
  { title: "", path: "/", Component: <Navigate to="/login" /> },
  { title: "Not found", path: "*", Component: <PageNotFound /> },
  { title: "Login", path: "/login", Component: <Login /> },
  { title: "Logout", path: "/logout", Component: <Logout /> }
];
