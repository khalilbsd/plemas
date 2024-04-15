import ThirdPartyProvider from "../../models/third_party/ThirdPartyProviders.model.js"



export const getProviderByName =async(name)=>{
    if (!name) return null
    const provider =await  ThirdPartyProvider.findOne({where:{name}})
    return provider
}