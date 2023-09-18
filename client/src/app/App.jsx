import {
  Route,
  Routes
} from "react-router-dom";
import './App.css';
import { urls } from './routes/url';
function App() {
  return (
    <div className="App">
     <Routes>
      {urls.map(({path,Component})=>
        (
          <Route path={path} element={Component} />
        ))}
     </Routes>
    </div>
  );
}

export default App;
