import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../Model/userModel.js";


const backendUrl = "https://o-auth-login-backend.onrender.com";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${backendUrl}/api/auth/google/callback`,
      // scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value || "",
            googleId: profile.id,
          });
        }
        done(null, user); 
      } catch (error) {
        done(error, null); 
      }
    }
  )
);
passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${backendUrl}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName","email"],
        // enableProof: true
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0]?.value || "";
          let user = await User.findOne({ facebookId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              facebookId: profile.id,
              email: email,
            })
            
          }
          done(null, user); 
        } catch (error) {
          done(error, null); 
        }
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${backendUrl}/api/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

          let user = await User.findOne({ githubId: profile.id });
          if (!user) {
            user = await User.create({
              name: profile.displayName || "GitHub User",
              email: email || "",
              githubId: profile.id,
            });
            
          }
          done(null, user); 
        } catch (error) {
          done(error, null); 
        }
      }
    )
  );


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    return done(null, user); 
  } catch (error) {
    return done(error, null); 
  }
});
 