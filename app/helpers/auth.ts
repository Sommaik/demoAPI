
import * as passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import * as myConfig from 'config';

let config:any = myConfig.get('Config');
var Strategy = passportJWT.Strategy;
var params = {
    secretOrKey: config.auth.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

class Auth {
    constructor() {
        let strategy = new Strategy(params, function (payload, done) {
            var user = payload;
            if (user) {
                return done(null, user);
            } else {
                return done(new Error("User not found"), null);
            }
        });
        passport.use(strategy);
    }

    initialize(): any {
        return passport.initialize();
    }

    authenticate(): any {
        return passport.authenticate("jwt", config.auth.jwtSession);
    }
};
var jwt = new Auth();
export = jwt;