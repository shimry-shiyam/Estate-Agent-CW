module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        // Handle CSS imports (so tests don't crash on styles)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // Handle Image imports (so tests don't crash on pictures)
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
    transform: {
        // Process .js and .jsx files using babel-jest
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
};