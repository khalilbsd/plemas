import { useLocation } from "react-router-dom";
import { exceptPathSidebar } from "../app/routes/urls";

function useRenderLocation(){
const location  = useLocation()


  const shouldRenderSidebar = !exceptPathSidebar.includes(location.pathname);
return shouldRenderSidebar
}



export  default useRenderLocation