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
  CLIENT_ROLE,
  EMPLOYEE_ROLE,
  SUPERUSER_ROLE
} from "../../constants/roles";
import ManagingLayout from "../managing/ManagingLayout";
import ManagingUsers from "../Components/managing/ManagingUsers";
import ManageProjects from "../Components/managing/ManageProjects";
//icons
import faUser from "../public/svgs/light/user.svg";
import faProject from '../public/svgs/light/diagram-project.svg'
import faAdmin from "../public/svgs/light/bars-progress.svg";
import faWorker from "../public/svgs/light/briefcase.svg";
import faLogout from "../public/svgs/light/right-from-bracket.svg";
import faManage from "../public/svgs/light/list-check.svg";
import AuthConfirmation from "../confirmation/AuthConfirmation";
import ResetPassword from "../reset_password/ResetPassword";
import ResetPasswordNotAuthForm from "../Components/reset_password/ResetPasswordNotAuthForm";

export const anonymousUrls = [
  { title: "", path: "/", Component: <Navigate to="/login" /> },
  { title: "Login", path: "/login", Component: <Login /> },
  {
    title: "Reset Password",
    path: "/reset-password",
    Component: <ResetPassword />
  },
  {
    title: "Reset Password",
    path: "/reset-password/request/token/:token",
    Component: <ResetPasswordNotAuthForm />
  },
  {
    title: "Confirmation",
    path: "/auth/account/confirmation/:token",
    Component: <AuthConfirmation />,
    icon: faLogout
  }
];

export const publicUrls = [
  { title: "Not found", path: "*", Component: <PageNotFound /> },
  { title: "Logout", path: "/logout", Component: <Logout />, icon: faLogout }
];

export const exceptPathSidebar = [
  "/login",
  "/logout",
  "/auth",
  "/confirmation/:token",
  "/reset-password"
];

const adminManagingRoutes = [
  {
    role: SUPERUSER_ROLE,
    title: "Manage employee",
    path: "/admin/manage/users",
    Component: <ManagingUsers />,
    icon: faUser
  }
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
    title: "Reset Password",
    path: "/settings/account/change-password",
    Component: <ResetPassword />,
    sideBar: false
  },

  {
    role: ALL_ROLES,
    title: "Profile",
    path: "/profile/me",
    Component: <UserProfile />,
    icon: faUser,
    sideBar: false
  },

  // {
  //   role: EMPLOYEE_ROLE,
  //   title: "Employee Dashboard",
  //   path: "/dashboard/employee",
  //   Component: <EmployeeDashboard />,
  //   icon: faWorker
  // },

  {
    role: SUPERUSER_ROLE,
    title: "Manage employee",
    path: "/admin/manage/users",
    Component: <ManagingUsers />,
    icon: faUser,
    sideBar: true
  },
  {
    role: SUPERUSER_ROLE,
    title: "Manage Projects",
    path: "/admin/manage/projects",
    Component: <ManageProjects />,
    icon: faProject,
    sideBar: true
  }
];

export function getRolesBasedUrls(user, role = null) {
  if (user && user.isSuperUser) return protectedUrls;

  const accessRole = !role ? user.role : role;

  return protectedUrls.filter((url) => url.role === accessRole);
}

export function getRoleHomeUrl(role) {
  console.log(role);
  switch (role) {
    case SUPERUSER_ROLE:
      return "/admin/manage/users";

    case CLIENT_ROLE:
      return "/dashboard/client";
    case EMPLOYEE_ROLE:
      return "/dashboard/employee";
    default:
      return "/dashboard/employee";
  }
}
