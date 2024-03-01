import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProjectListMutation } from "../../../store/api/projects.api";
import { notify } from "../../../app/Components/notification/notification";
import { NOTIFY_ERROR } from "../../../constants/constants";
import { setProjectList } from "../../../store/reducers/manage.reducer";



function useLoadProjects(dependacies , condition ){
    const dispatch = useDispatch()
  const [getProjectList,{isLoading}] = useGetProjectListMutation();

    useEffect(() => {
        async function loadProjects() {
            try {
              const data = await getProjectList().unwrap();
              dispatch(
                setProjectList({ projects: data.projects, tasks: data.projectsTasks })
              );
            } catch (error) {
              notify(NOTIFY_ERROR, error?.data?.message);
            }
          }
        //   if (toggleSearch && !projectList.length) {
          if (condition) {
            loadProjects();
          }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependacies, condition, dispatch, getProjectList])

    return isLoading
}

export default useLoadProjects