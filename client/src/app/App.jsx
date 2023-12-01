import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./routes/ProtectedRoute";
import {
  anonymousUrls,
  getRolesBasedUrls,
  publicUrls
} from "./routes/urls";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import useGetAuthenticatedUser from "../hooks/authenticated";
import useRenderLocation from "../hooks/location";
import useGetUserInfo from "../hooks/user";
import { useGetAuthenticatedUserInfoMutation } from "../store/api/users.api";
import { setUserInfo } from "../store/reducers/user.reducer";
import Loading from "./Components/loading/Loading";
import Sidebar from "./Components/sidebar/Sidebar";
import Anonymous from "./routes/Anonymous";
import { toggleSideBar } from "../store/reducers/sidebar.reducer";
import useGetStateFromStore from "../hooks/manage/getStateFromStore";

function App() {
  const userObject = useGetAuthenticatedUser();
  const shouldRenderSidebar = useRenderLocation();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user: userAccount, profile } = useGetUserInfo();
const sideBarDisabled = useGetStateFromStore('sidebar','hide')

  const [getAuthenticatedUserInfo] =
    useGetAuthenticatedUserInfoMutation();

  useEffect(() => {
    async function loadUserInfo() {
      try {
        if (userObject.user?.email) {
          const { data } = await getAuthenticatedUserInfo({
            email: userObject.user.email
          });

            dispatch(setUserInfo(data));

        }
      } catch (error) {
        console.log(error);
      }
    }

    userObject.refetch();
    if (userObject?.isAuthenticated && (!userAccount || !profile)) {
      loadUserInfo();

      if (sideBarDisabled){
        dispatch(toggleSideBar(false))
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, userObject.loading]);




  const renderRoutes = (urls) => {
    return urls.map(({ path, Component, nested }, key) => (
      <Route key={key} path={path} element={Component}>
        {nested &&
          nested.map((nestedRoute, idx) => (
            <Route
              key={idx}
              path={nestedRoute.path}
              element={nestedRoute.Component}
            />
          ))}
      </Route>
    ));
  };

  if (userObject.loading) return <Loading />;

  return (
    <div
      className={`App`}

    >
      {shouldRenderSidebar && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}
      <div className="main-content">
        <Routes>
          {/* Anonymous routes */}
          <Route element={<Anonymous user={userObject} />}>
            {renderRoutes(anonymousUrls)}
          </Route>

          {/* Public routes */}
          {renderRoutes(publicUrls)}

          {/* Protected routes for ALL_ROLES */}
          <Route element={<ProtectedRoute user={userObject} />}>
            {renderRoutes(getRolesBasedUrls(null))}
          </Route>

          {/* Protected routes based on user role */}
          {userObject?.user?.role && (
            <Route element={<ProtectedRoute user={userObject} />}>
              {renderRoutes(getRolesBasedUrls(userObject?.user))}
            </Route>
          )}
        </Routes>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
}

export default App;
