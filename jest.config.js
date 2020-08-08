module.exports = {
  setupFiles: ['<rootDir>/env.config.js'],
  coverageDirectory: '<rootDir>/storage/coverage',
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/assets/mocks/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  },
  testEnvironment: 'node',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.jsx?$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/']
};
