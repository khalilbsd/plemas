import ThirdPartyProvider from "../../models/third_party/ThirdPartyProviders.model.js";
import { getProviderByName } from "./utils.js";




export const providersList = async () => {
  const providers = await ThirdPartyProvider.findAll();
  return providers;
};

export const addProvider = async (provider) => {
  //check if the provider exists already
  const isProviderExists  = await getProviderByName(provider.name)
  if (isProviderExists) return null;
  const createdProvider = await provider.save();
  return createdProvider;
};



export const removeProvider = async(name)=>{
    const provider = await getProviderByName(name)
    if (!provider) return null
    await provider.destroy()

    return true

}


export const updateProvider = async(name,providerData)=>{
        const provider = await getProviderByName(name)
        provider.up
        var change = false

        let keys = Object.keys(providerData)
        for (const idx in keys){
            console.log("idxxxx",keys[idx]);
          if (provider[keys[idx]] !== providerData[keys[idx]]){
            change = true
            break
          }
        }
        console.log(change);
        if (!change) return null
        // const updatedProvider = await ThirdPartyProvider.update(providerData,{where:{name}})
        const updatedProvider = await provider.update(providerData)

        return updatedProvider

      }