import { useLocation } from "react-router-dom";
import { exceptPathSidebar } from "../app/routes/urls";

function useRenderLocation(){
const location  = useLocation()





var shouldRenderSidebar = !exceptPathSidebar.includes(location.pathname);
if (!shouldRenderSidebar) return shouldRenderSidebar
const similarPath=location.pathname.split('/')[1]

shouldRenderSidebar = !(exceptPathSidebar.map((path)=>path.includes(similarPath))).includes(true)


return shouldRenderSidebar
}



export  default useRenderLocation