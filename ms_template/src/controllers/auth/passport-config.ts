// import passport from 'passport';
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { config } from "../../environment.config";
import { authenticateUser } from "../../middleware/auth";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret
};

passport.use(new JwtStrategy(options, authenticateUser));

export default passport;
