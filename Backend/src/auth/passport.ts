import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from "passport-facebook";
import { IAuthService } from "./auth.service";
import { container } from "./auth.di";
import { Request } from "express";


const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL!;

const facebookClientId = process.env.FACEBOOK_CLIENT_ID!;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET!;
const facebookCallbackUrl = process.env.FACEBOOK_CALLBACK_URL!;

export const initializePassport = () => {
  const service = container.resolve<IAuthService>("IAuthService");
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Google strategy
  passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl,
      passReqToCallback: true
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value!;
        const name = profile.displayName;
        const result = await service.oauthLogin(email, name);
        if (result.success) {
          return done(null, result.user);
        }
        return done(new Error(result.error));
      } catch (err) {
        return done(err as any);
      }
    }
  )
);


  // Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookClientId,
        clientSecret: facebookClientSecret,
        callbackURL: facebookCallbackUrl,
        profileFields: ["id", "emails", "name"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value!;
          const name = profile.name?.familyName + " " + profile.name?.givenName;
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
  return passport;
};

