import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { logout } from "../store/reducers/auth";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const cookies = new Cookies();

function useGetAuthenticatedUser() {
  const [user, setUser] = useState(initialState);
  const [refetchFlag, setRefetchFlag] = useState(false);
  const dispatch = useDispatch()
  useEffect(() => {
    async function getUser() {
      const storedUser = await localStorage.getItem("user");
      const token  = await cookies.get('session_token')
      // console.log(token);
      if (storedUser && token)  {

        setUser((prevUser) => ({
          ...prevUser,
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          loading: false,
        }));
      } else {
        setUser((prevUser) => ({
          ...prevUser,
          isAuthenticated: false,
          user: null,
          loading: false,
        }));
        dispatch(logout())
      }
    }

    getUser();
  }, [refetchFlag]); // Listen for changes in refetchFlag

  // Define the refetch function
  const refetch = () => {
    // Toggle the refetchFlag to trigger a re-fetch
    setRefetchFlag((prevFlag) => !prevFlag);
  };

  return { ...user, refetch }; // Include the refetch function in the returned object
}

export default useGetAuthenticatedUser;
