import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserListMutation } from "../../store/api/users.api";
import { setUsersList } from "../../store/reducers/manage.reducer";

const useFetchUserList =()=>{
    const dispatch = useDispatch()
  const [getUserList,{isLoading}] = useGetUserListMutation();

    useEffect(() => {
        async function userList() {
            try {
              const res = await getUserList().unwrap();
              dispatch(setUsersList(res.users));
            } catch (error) {
              console.log(error);
            }
          }
          userList();
    }, [getUserList,dispatch])

    return isLoading

}


export default useFetchUserList