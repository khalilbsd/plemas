import { Route, Routes } from "react-router-dom";
import "./App.css";
import { protectedUrls, publicUrls } from "./routes/urls";
import ProtectedRoute from "./routes/ProtectedRoute";

import Loading from "./Components/loading/Loading";
import useGetAuthenticatedUser from "../hooks/authenticated";
import Sidebar from "./Components/sidebar/Sidebar";
import useRenderLocation from "../hooks/location";

function App() {
  const user = useGetAuthenticatedUser();
  console.log(user);
  const shouldRenderSidebar = useRenderLocation()


  if (user.loading) return <Loading />;
  return (
    <div className="App">
      {
        shouldRenderSidebar&&
      <div className="sidebar-container">
        <Sidebar />
      </div>
      }
      <div className="main-content">
        <Routes>
          {publicUrls.map(({ path, Component }, key) => (
            <Route key={key} path={path} element={Component} />
          ))}

          <Route element={<ProtectedRoute user={user} />}>
            {protectedUrls.map(({ path, Component }, key) => (
              <Route key={key} path={path} element={Component} />
            ))}
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
