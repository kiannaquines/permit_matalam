import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

function initializePassport(passport, db) {
    const authenticateUser = (username, password, done) => {

        User.findOne({ username: username }).then((existingUser) => {
            if (existingUser) {
                if (existingUser.userStatus === 'Inactive') {
                    return done(null, false, { message: 'not_activated' });
                }

                bcrypt.compare(password, existingUser.password, (err, isMatch) => {
                    if (isMatch) {
                        return done(null, existingUser, { message: 'logged_in' });
                    } else {
                        return done(null, false, { message: 'password_not_matched' });
                    }
                });
            } else {
                return done(null, false, { message: 'username_not_exists' });
            }
        })
        .catch((error) => {
            return done(true, false, { message: 'system_error' });
        });
    }

    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((username, done) => {
        User.findOne({ username: username })
            .then((user) => {
                done(null, user);
            })
            .catch((err) => {
                done(err, null);
            });
    });
}

export default initializePassport;
