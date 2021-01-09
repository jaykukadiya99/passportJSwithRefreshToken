const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/userModel');

passport.use('signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) => {
    try {
        const user = await UserModel.create({ email, password });        
        return done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
         
            return done(null, false, { message: 'User not found' });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use('aToken',new JWTstrategy({
    secretOrKey: 'top_secret',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async(token, done) => {
    try {
        console.log("in aToken auth");
        console.log(token);
        var expirationDate = new Date(token.exp * 1000)

        if(expirationDate < new Date()) {
            return done(null, false);
        }
        return done(null, token);
    } catch (error) {
        done(error);
    }
}));

passport.use('refresh',new JWTstrategy({
    secretOrKey: 'r_Key',
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter('aToken')
}, async(token, done) => {
    try {
        console.log('in refresh auth');
        console.log(token)
        var expirationDate = new Date(token.exp * 1000)

        if(expirationDate < new Date()) {
            return done(null, false);
        }
        else
            console.log(token.user)
            return done(null, token);
    } catch (error) {
        done(error);
    }
}));