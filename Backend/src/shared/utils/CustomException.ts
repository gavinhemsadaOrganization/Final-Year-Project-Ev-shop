/**
 * A higher-order function that acts as a decorator for repository methods.
 * It wraps an asynchronous function in a try-catch block to provide centralized error handling.
 * If the wrapped function executes successfully, its result is returned.
 * If the wrapped function throws an error, the error is logged to the console,
 * and the function returns `null`, preventing the application from crashing and ensuring
 * a consistent return type on failure.
 *
 * This pattern is used across all repositories to ensure that database-level errors
 * are caught and handled gracefully without repetitive `try...catch` blocks in every method.
 *
 * @template T - A tuple representing the types of the arguments of the function `fn`.
 * @template R - The type of the value that the promise returned by `fn` resolves to.
 * @param fn - The asynchronous repository method to be wrapped.
 * @returns A new asynchronous function that includes error handling and will return `R | null`.
 */
export const withErrorHandling = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
  // Return a new async function that will replace the original repository method.
  return async (...args: T): Promise<R | null> => {
    try {
      // Attempt to execute the original function with all its arguments.
      return await fn(...args);
    } catch (error) {
      // If any error occurs during the execution of `fn`, catch it here.
      console.error(`Error in repository method:`, error);
      // Return null to indicate to the service layer that the operation failed.
      return null; 
    }
  };
};