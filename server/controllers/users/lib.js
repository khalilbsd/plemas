import bcrypt from "bcrypt";
import jwt  from 'jsonwebtoken'

export const encryptPassword = async (password) => {
  const hashed = await bcrypt.hash(
    password,
    parseInt(process.env.SALT_ROUNDS_BCRYPT)
  );
  return hashed;
};

export const serializeUser = (user) => {
  return {
    email: user.email,
    role: user.role,
    isSuperUser: user.isSuperUser,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

export const serializeProfile = (userInfo, userId) => {
  return {
    name: userInfo.name,
    lastName: userInfo.lastName,
    poste: userInfo.poste,
    phone: userInfo.phone,
    image: userInfo.image,
    userId: userId
  };
};

export const generateToken = async (userID)=>{
  return  jwt.sign({userID},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_IN
})

}