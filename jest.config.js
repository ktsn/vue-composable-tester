module.exports = {
  preset: 'ts-jest',
  testRegex: '/test/.+\\.spec\\.(js|ts)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json',
    },
  },
}
