import { useEffect, useState } from "react";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

function useGetAuthenticatedUser() {
  const [user, setUser] = useState(initialState);

  useEffect(() => {
    async function getUser() {
      const storedUser = await localStorage.getItem("user");
      if (storedUser) {
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
      }
    }
    getUser();
  }, []);

  return user;
}

export default useGetAuthenticatedUser;
