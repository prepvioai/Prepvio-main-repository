// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import crypto from "crypto";
// import { User } from "../Models/User.js";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.NODE_ENV === "production"
//         ? "https://prepvio-main-backend.onrender.com/api/auth/google/callback"
//         : "/api/auth/google/callback",
//       passReqToCallback: true,
//     },
//     async (req, _, __, profile, done) => {
//       try {
//         const email = profile.emails[0].value;
//         const mode = req.query.state;

//         let user = await User.findOne({ email });

//         if (!user) {
//           // 🚫 If mode is 'login', do not create new user
//           if (mode === "login") {
//             return done(null, false, { message: "Account doesn't exist. Please sign up first." });
//           }

//           user = await User.create({
//             name: profile.displayName,
//             email,
//             isVerified: true,
//             authProvider: "google",
//             googleId: profile.id,
//             password: crypto.randomBytes(32).toString("hex"), // dummy
//           });
//           user.isNewUser = true; // ✅ Mark as new user for welcome notification
//         }

//         // 🚫 Prevent password login for Google users
//         if (user.authProvider !== "google") {
//           return done(null, false);
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, null);
//       }
//     }
//   )
// );

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "crypto";
import { User } from "../Models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === "production"
        ? "https://prepvio-main-backend.onrender.com/api/auth/google/callback"
        : "/api/auth/google/callback",
      passReqToCallback: true,
      scope: ["profile", "email"], // ✅ ADD THIS LINE
    },
    async (req, _, __, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const mode = req.query.state;

        let user = await User.findOne({ email });

        if (!user) {
          if (mode === "login") {
            return done(null, false, { message: "Account doesn't exist. Please sign up first." });
          }

          user = await User.create({
            name: profile.displayName,
            email,
            isVerified: true,
            authProvider: "google",
            googleId: profile.id,
            password: crypto.randomBytes(32).toString("hex"),
          });
          user.isNewUser = true;
        }

        if (user.authProvider !== "google") {
          return done(null, false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
