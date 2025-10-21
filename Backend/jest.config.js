module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: [
    '**/__tests__/**/*.(spec|test).ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // --- THIS SECTION IS UPDATED ---
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      // Config from 'globals' is now here
      tsconfig: {
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    }],
  },
  // --- END OF UPDATE ---

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  
  // --- THIS SECTION IS NOW EMPTY ---
  // You can also remove the 'globals' key completely.
  globals: {}, 
};