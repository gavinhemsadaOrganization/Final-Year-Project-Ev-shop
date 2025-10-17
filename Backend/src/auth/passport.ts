import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { IAuthService } from "./auth.service";
import { container } from "./auth.di";
import { Request } from "express";

// Retrieve Google OAuth credentials from environment variables.
const googleClientId = process.env.GOOGLE_CLIENT_ID!;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL!;

// Retrieve Facebook OAuth credentials from environment variables.
const facebookClientId = process.env.FACEBOOK_CLIENT_ID!;
const facebookClientSecret = process.env.FACEBOOK_CLIENT_SECRET!;
const facebookCallbackUrl = process.env.FACEBOOK_CALLBACK_URL!;

/**
 * Initializes and configures Passport.js with authentication strategies.
 * This function sets up serialization/deserialization and configures
 * strategies for Google and Facebook OAuth.
 *
 * @returns The configured Passport.js instance.
 */
export const initializePassport = () => {
  // Resolve the authentication service from the dependency injection container.
  const service = container.resolve<IAuthService>("IAuthService");

  /**
   * Serializes the user object to be stored in the session.
   * In this case, the entire user object is stored.
   */
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  /**
   * Deserializes the user object from the session.
   */
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Configure the Google OAuth2 strategy.
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
        passReqToCallback: true,
      },
      /**
       * The verification function for the Google strategy.
       * This function is called after Google successfully authenticates the user.
       * @param req - The Express request object.
       * @param accessToken - The access token from Google.
       * @param refreshToken - The refresh token from Google (if available).
       * @param profile - The user's profile information from Google.
       * @param done - The callback to pass control back to Passport.
       */
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => {
        try {
          // Extract user email and name from the Google profile.
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

  // Configure the Facebook OAuth2 strategy.
  passport.use(
    new FacebookStrategy(
      {
        clientID: facebookClientId,
        clientSecret: facebookClientSecret,
        callbackURL: facebookCallbackUrl,
        profileFields: ["id", "emails", "name"],
      },
      /**
       * The verification function for the Facebook strategy.
       * This function is called after Facebook successfully authenticates the user.
       * @param accessToken - The access token from Facebook.
       * @param refreshToken - The refresh token from Facebook (if available).
       * @param profile - The user's profile information from Facebook.
       * @param done - The callback to pass control back to Passport.
       */
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0].value!;
          // Combine family and given name to form the full name.
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
