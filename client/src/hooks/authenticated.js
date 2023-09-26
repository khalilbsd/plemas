import { useEffect, useState } from "react";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

function useGetAuthenticatedUser() {
  const [user, setUser] = useState(initialState);

  useEffect(()=>{
    async function getUSer() {
    const storedUser =  localStorage.getItem("user");
    if (storedUser) {
      setUser({ isAuthenticated: true, user: JSON.parse(storedUser), loading: false });
    } else {
      setUser({ isAuthenticated: false, user: null, loading: false });
    }
  }
     getUSer()
  }, []);

  return user; // Return the user object, not just user.isAuthenticated
}

export default useGetAuthenticatedUser;




