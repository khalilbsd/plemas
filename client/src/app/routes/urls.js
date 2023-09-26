import { Navigate } from "react-router-dom";
import PageNotFound from "../404/PageNotFound";
import Login from "../login/Login";
import Logout from "../logout/Logout.jsx";
import UserProfile from "../profile/UserProfile";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import AdminDashboard from "../dashboards/AdminDashboard";
import { EmployeeDashboard } from "../dashboards/EmployeeDashboard";
import { ALL_ROLES, EMPLOYEE_ROLE, SUPERUSER_ROLE } from "../../constants/roles";




export const publicUrls = [
  { title: "", path: "/", Component: <Navigate to="/login" /> },
  { title: "Not found", path: "*", Component: <PageNotFound /> },
  { title: "Login", path: "/login", Component: <Login /> },
  { title: "Logout", path: "/logout", Component: <Logout />,icon:faRightFromBracket }
];



export const exceptPathSidebar=["/login","/logout"]

export const protectedUrls = [
  { role:ALL_ROLES ,title: "Profile", path: "/profile/me", Component: <UserProfile />,icon: faUser},
  { role:SUPERUSER_ROLE, title: "Admin Dashboard", path: "/dashboard/admin", Component: <AdminDashboard />,icon: faUser},
  { role:EMPLOYEE_ROLE, title: "Employee Dashboard", path: "/dashboard/employee", Component: <EmployeeDashboard />,icon: faUser}
];



export function getRolesBasedUrls(user,role=null){

  if (user&&user.isSuperUser) return protectedUrls

  const accessRole= !role? user.role : role

  return protectedUrls.filter(url =>url.role ===accessRole)
}