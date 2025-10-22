import { IUser, User } from "../../entities/User";
import { withErrorHandling } from "../../shared/utils/CustomException";

export interface IAuthRepository {
  /**
   * Finds a user by their email address.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to the user object or null if not found.
   */
  findByEmail(email: string): Promise<IUser | null>;
  /**
   * Creates and saves a new user with an email and password.
   * @param email - The new user's email.
   * @param password - The new user's plain-text password (to be hashed by the model).
   * @returns A promise that resolves to the newly created user object.
   */
  save(email: string, password: string): Promise<IUser | null>;
  /**
   * Finds a user by email and verifies their password.
   * @param email - The user's email.
   * @param password - The plain-text password to compare.
   * @returns A promise that resolves to the user object if credentials are valid, otherwise null.
   */
  findUser(email: string, password: string): Promise<IUser | null>;
  /**
   * Finds a user by email, or creates a new one if they don't exist (for OAuth flows).
   * @param email - The user's email from the OAuth provider.
   * @param name - The user's name from the OAuth provider.
   * @returns A promise that resolves to the found or newly created user object.
   */
  findOrCreate(email: string, name: string): Promise<IUser | null>;
  /**
   * Checks if a user account (identified by email) has a password set.
   * Useful for distinguishing between regularly registered users and OAuth-only users.
   * @param email - The user's email.
   * @returns A promise that resolves to true if a password exists, otherwise false.
   */
  checkPassword(email: string): Promise<boolean | null>;
  /**
   * Updates the `last_login` timestamp for a given user.
   * @param userId - The ID of the user to update.
   * @param lastLogin - The new last login date.
   * @returns A promise that resolves when the update is complete.
   */
  updateLastLogin(userId: string, lastLogin: Date): Promise<void | null>;
}

/**
 * The concrete implementation of the IAuthRepository interface.
 * Each method is wrapped with a higher-order function `withErrorHandling` to ensure
 * consistent error management across the repository.
 */
export const AuthRepository: IAuthRepository = {
  /**
   * Finds a user by email, excluding the password field from the result.
   */
  findByEmail: withErrorHandling(async (email: string) => {
    const user = await User.findOne({ email }).select("-password");
    return user;
  }),
  /**
   * Creates a new user document in the database.
   */
  save: withErrorHandling(async (email: string, password: string) => {
    const newUser = await User.create({ email, password });
    return newUser;
  }),
  /**
   * Finds a user by email and then uses the model's `comparePassword` method to check credentials.
   */
  findUser: withErrorHandling(async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return null;
    return user;
  }),
  /**
   * Implements the "find or create" logic for social logins.
   */
  findOrCreate: withErrorHandling(async (email, name) => {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }
    return user;
  }),
  /**
   * Checks for the existence of the password field on a user document.
   */
  checkPassword: withErrorHandling(async (email) => {
    const user = await User.findOne({ email });
    if (!user || !user.password) return false;
    return true;
  }),
  /**
   * Updates the `last_login` field for a user by their ID.
   */
  updateLastLogin: withErrorHandling(
    async (userId: string, lastLogin: Date) => {
      await User.findByIdAndUpdate(userId, { last_login: lastLogin });
    }
  ),
};
