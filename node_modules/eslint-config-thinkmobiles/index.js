module.exports = {

    extends: [
        './rules/best-practices',
        './rules/errors',
        './rules/legacy',
        './rules/node',
        './rules/style',
        './rules/variables'
    ].map(require.resolve),

    env: {
        browser: true,
        node   : true,
        amd    : true,
        mocha  : true,
        jasmine: true
    },

    ecmaFeatures: {},
    globals     : {},
    rules       : {}
};
