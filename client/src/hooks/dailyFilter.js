import { useEffect, useState } from "react";
import useGetStateFromStore from "./manage/getStateFromStore";
import { TASK_STATE_BLOCKED, TASK_STATE_DOING } from "../constants/constants";

function useShowProjectFiltersWhenDailyIsActive() {
  const dailyFilter = useGetStateFromStore("manage", "projectListDailyFilter");
  const { filterType: ActiveFilterTypes } = useGetStateFromStore(
    "manage",
    "addProject"
  );
  const [show, setShow] = useState(true);
  useEffect(() => {
    function checkFilters() {
      if (!dailyFilter) {
        setShow(true);
        return;
      }

      const stateIdx = ActiveFilterTypes?.map((filter) => filter.type).indexOf(
        "state"
      );
      if (ActiveFilterTypes[stateIdx]?.value?.length === 2) {
        if (
          ActiveFilterTypes[stateIdx]?.value?.includes(TASK_STATE_BLOCKED) &&
          ActiveFilterTypes[stateIdx]?.value?.includes(TASK_STATE_DOING)
        )
          setShow(false);
        return;
      }
      setShow(true);
      return;
    }
    checkFilters();


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dailyFilter, ActiveFilterTypes]);

  return show;
}

export default useShowProjectFiltersWhenDailyIsActive;
