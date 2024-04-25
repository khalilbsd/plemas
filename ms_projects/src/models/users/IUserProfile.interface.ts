export type TUserProfile = {
    name: string
    lastName: string
    poste: string
    phone: string
    image: string
    address: string
    hireDate: string

};

export interface IUserProfile extends TUserProfile, Document {}

