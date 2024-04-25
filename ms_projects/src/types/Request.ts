// custom.d.ts

import { IUser } from "models/users/IUser.interface";


declare global {
    namespace Express {
      interface User extends IUser {}
    }
  }