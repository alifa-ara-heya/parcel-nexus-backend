import passport from "passport";
import { User } from "../modules/users/user.model";
import bcryptjs from 'bcryptjs'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as localStrategy } from "passport-local";
import { Role } from "../modules/users/user.interface";
import { envVars } from "./env";

passport.use(
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email: string, password: string, done) => {
        try {
            // To prevent timing attacks, it's better to fetch the user and password together
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                // Use a generic message for both non-existent user and wrong password
                return done(null, false, { message: "Invalid email or password." });
            }

            // Scenario: User signed up with Google and does not have a password set.
            const isGoogleAuthenticated = user.auths.some(providerObjects => providerObjects.provider === 'google');
            if (isGoogleAuthenticated && !user.password) {
                return done(null, false, { message: "You signed up using Google. Please log in with Google or set a password in your account settings to use credentials." });
            }

            // This case should ideally not happen if your registration logic is sound, but it's a good safeguard.
            if (!user.password) {
                return done(null, false, { message: "Invalid email or password." });
            }

            const isPasswordMatched = await bcryptjs.compare(password, user.password);

            if (!isPasswordMatched) {
                return done(null, false, { message: "Invalid email or password." });
            }

            return done(null, user);

        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)


passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value

                if (!email) {
                    return done(null, false, { message: "No email found!" })
                }

                let user = await User.findOne({ email });

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: 'google',
                                providerId: profile.id
                            }
                        ]
                    })
                }

                return done(null, user)

            } catch (error) {
                console.log('Google Strategy Error', error);
                return done(error)
            }
        }
    ))

// import this passport config to app.ts