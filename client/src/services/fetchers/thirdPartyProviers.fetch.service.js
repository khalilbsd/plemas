import { useEffect } from "react";
import { useGetAllProvidersMutation } from "../../store/api/thirdPartyProviders.api";
import { useDispatch } from "react-redux";
import { setTPPList } from "../../store/reducers/thirdPartyProviders.reducer";

const useFetchThirdPartyProviders = () => {
  const [getAllProviders, { isLoading }] = useGetAllProvidersMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    async function gettingProviders() {
      try {
        const data = await getAllProviders().unwrap();
        console.log(data);
        dispatch(setTPPList(data?.providers));
      } catch (error) {
        console.log(error);
      }
    }
    gettingProviders();
  }, [dispatch, getAllProviders]);
  return isLoading;
};

export default useFetchThirdPartyProviders;
