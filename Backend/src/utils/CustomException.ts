export const withErrorHandling = <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in repository method:`, error);
      return null; 
    }
  };
};