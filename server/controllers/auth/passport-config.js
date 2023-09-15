// import passport from 'passport';
import dotenv from "dotenv";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { authenticateUser } from "../../middleware/auth.js";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

console.log("passport options", options);

passport.use(new JwtStrategy(options, authenticateUser));

export default passport;
