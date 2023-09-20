import { Route, Routes } from "react-router-dom";
import "./App.css";
import { protectedUrls, publicUrls } from "./routes/urls";
import ProtectedRoute from "./routes/ProtectedRoute";

import Loading from "./Components/loading/Loading";
import useGetAuthenticatedUser from "../hooks/authenticated";
function App() {
  const user = useGetAuthenticatedUser();
  if (user.loading) return <Loading />
  return (
    <div className="App">
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
  );
}

export default App;
