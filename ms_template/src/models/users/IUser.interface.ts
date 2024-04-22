import { Types } from "mongoose"




export type TUser ={
email:string,
password:string,
role:string,
isSuperUser:boolean,
token:string,
active:boolean,
isBanned:boolean,
firstLogin:boolean,
profile:Types.ObjectId,
thirdPartyProvider:string,
}


export interface IUser extends TUser, Document {}
