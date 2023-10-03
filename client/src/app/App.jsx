import { Route, Routes } from "react-router-dom";
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

function App() {
  const userObject = useGetAuthenticatedUser();
  // console.log(user);
  const shouldRenderSidebar = useRenderLocation();
  // console.log(getRolesBasedUrls(SUPERUSER_ROLE));

  if (userObject.loading) return <Loading />;
  return (
    <div className="App">
      {shouldRenderSidebar && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}
      <div className="main-content">
        <Routes>
          {/* anonymous routes */}
          {
            <Route element={<Anonymous user={userObject} />}>

              {anonymousUrls.map(({ path, Component }, key) => (
                <Route key={key} path={path} element={Component} />
              ))}
            </Route>
          }

          {/* public routes */}
          {publicUrls.map(({ path, Component }, key) => (
            <Route key={key} path={path} element={Component} />
          ))}
          {/* protected routes ALL_ROLES */}
          <Route element={<ProtectedRoute user={userObject} />}>
            {getRolesBasedUrls(null, ALL_ROLES).map(
              ({ path, Component, nested }, key) => (
                <Route key={key} path={path} element={Component} />
              )
            )}
          </Route>
          {/* protected routes role specification */}

          {userObject?.user?.role && (
            <Route element={<ProtectedRoute user={userObject} />}>
              {getRolesBasedUrls(userObject?.user).map(
                ({ path, Component, nested }, key) =>
                  nested ? (
                    <Route key={key} path={path} element={Component}>
                      {nested.map((nestedRoute, idx) => (
                        <Route
                          key={idx}
                          path={nestedRoute.path}
                          element={nestedRoute.Component}
                        />
                      ))}
                    </Route>
                  ) : (
                    <Route key={key} path={path} element={Component} />
                  )
              )}
            </Route>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
