import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import {
  anonymousUrls,
  getRolesBasedUrls,
  protectedUrls,
  publicUrls
} from "./routes/urls";
import ProtectedRoute from "./routes/ProtectedRoute";

import Loading from "./Components/loading/Loading";
import useGetAuthenticatedUser from "../hooks/authenticated";
import Sidebar from "./Components/sidebar/Sidebar";
import useRenderLocation from "../hooks/location";
import { ALL_ROLES, SUPERUSER_ROLE } from "../constants/roles";
import Anonymous from "./routes/Anonymous";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetAuthenticatedUserInfoMutation } from "../store/api/users.api";
import useGetUserInfo from "../hooks/user";
import { setUserInfo } from "../store/reducers/user.reducer";

function App() {
  const userObject = useGetAuthenticatedUser();
  const shouldRenderSidebar = useRenderLocation();
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState("fadeIn");
  const dispatch = useDispatch()
  const { user: userAccount, profile } = useGetUserInfo();
  const [getAuthenticatedUserInfo, { isLoading }] =
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
    if (userObject?.isAuthenticated &&( !userAccount || !profile)  ) {
      loadUserInfo();
    }
    if (location !== displayLocation) setTransistionStage("fadeOut");

  }, [location, displayLocation,userObject.loading]);

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
      className={`App ${transitionStage}`}
      onAnimationEnd={() => {
        if (transitionStage === "fadeOut") {
          setTransistionStage("fadeIn");
          setDisplayLocation(location);
        }
      }}
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
            {renderRoutes(getRolesBasedUrls(null, ALL_ROLES))}
          </Route>

          {/* Protected routes based on user role */}
          {userObject?.user?.role && (
            <Route element={<ProtectedRoute user={userObject} />}>
              {renderRoutes(getRolesBasedUrls(userObject?.user))}
            </Route>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
