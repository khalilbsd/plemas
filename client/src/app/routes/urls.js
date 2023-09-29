import { Navigate } from "react-router-dom";
import PageNotFound from "../404/PageNotFound";
import Login from "../login/Login";
import Logout from "../logout/Logout.jsx";
import UserProfile from "../profile/UserProfile";
// import { faBriefcase, faHouse, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import AdminDashboard from "../dashboards/AdminDashboard";
import { EmployeeDashboard } from "../dashboards/EmployeeDashboard";
import {
  ALL_ROLES,
  EMPLOYEE_ROLE,
  SUPERUSER_ROLE
} from "../../constants/roles";
import ManagingLayout from "../managing/ManagingLayout";
import ManagingUsers from "../Components/managing/ManagingUsers";
import ManageProjects from "../Components/managing/ManageProjects";
//icons
import faUser from "../public/svgs/light/user.svg";
import faAdmin from "../public/svgs/light/bars-progress.svg";
import faWorker from "../public/svgs/light/briefcase.svg";
import faLogout from "../public/svgs/light/right-from-bracket.svg";
import faManage from "../public/svgs/light/list-check.svg";
import AuthConfirmation from "../confirmation/AuthConfirmation";
import ResetPassword from "../reset_password/ResetPassword";

export const publicUrls = [
  { title: "", path: "/", Component: <Navigate to="/login" /> },
  { title: "Not found", path: "*", Component: <PageNotFound /> },
  { title: "Login", path: "/login", Component: <Login /> },
  { title: "Logout", path: "/logout", Component: <Logout />, icon: faLogout },
  { title: "Reset Password", path: "/reset-password", Component: <ResetPassword /> },
  { title: "Confirmation", path: "/auth/account/confirmation/:token", Component: <AuthConfirmation />, icon: faLogout }

];

export const exceptPathSidebar = ["/login", "/logout","/confirmation/:token"];

const adminManagingRoutes = [
  {
    role: SUPERUSER_ROLE,
    title: "Manage employee",
    path: "/admin/manage/users",
    Component: <ManagingUsers />,
    icon: faUser
  },
  // {
  //   role: SUPERUSER_ROLE,
  //   title: "Manage clients",
  //   path: "/admin/manage/projects",
  //   Component: <ManageProjects />,
  //   icon: faUser
  // }
];

export const protectedUrls = [
  {
    role: ALL_ROLES,
    title: "Profile",
    path: "/profile/me",
    Component: <UserProfile />,
    icon: faUser
  },
  {
    role: SUPERUSER_ROLE,
    title: "Admin Dashboard",
    path: "/dashboard/admin",
    Component: <AdminDashboard />,
    icon: faAdmin
  },
  {
    role: EMPLOYEE_ROLE,
    title: "Employee Dashboard",
    path: "/dashboard/employee",
    Component: <EmployeeDashboard />,
    icon: faWorker
  },
  {
    role: SUPERUSER_ROLE,
    title: "Manage",
    path: "/admin/manage/",
    Component: <ManagingLayout />,
    nested: adminManagingRoutes,
    icon: faManage
  }
];

export function getRolesBasedUrls(user, role = null) {
  if (user && user.isSuperUser) return protectedUrls;

  const accessRole = !role ? user.role : role;

  return protectedUrls.filter((url) => url.role === accessRole);
}
