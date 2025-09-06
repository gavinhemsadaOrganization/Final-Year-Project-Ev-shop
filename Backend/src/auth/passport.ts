import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { authService, IAuthService } from "./auth.service";
import { container } from "./auth.di";
import { AuthRepository } from "./auth.repository";

const service = authService(AuthRepository);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});
console.log("key",process.env.GOOGLE_CLIENT_ID!)
// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        const name = profile.displayName;
        const result = await service.oauthLogin(email, name);
        if (result.success) {
          return done(null, result.user);
        }
        return done(new Error(result.error));
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ["id", "emails", "name", "displayName"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        const name = profile.displayName;
        const result = await service.oauthLogin(email, name);
        if (result.success) {
          return done(null, result.user);
        }
        return done(new Error(result.error));
      } catch (err) {
        return done(err);
      }
    }
  )
);

export { passport };
