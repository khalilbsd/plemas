// import passport from 'passport';
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptionsWithoutRequest, StrategyOptionsWithRequest } from "passport-jwt";
import { config } from "../../environment.config";
import { authenticateUser } from "../../middleware/auth";


console.log(config.jwt_secret)

const options:StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt_secret ?  config.jwt_secret :''
};

passport.use(new JwtStrategy(options, authenticateUser));

export default passport;
