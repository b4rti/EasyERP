
var _ = require('lodash');
var fullConfig = {};
var eslintConf = require('./index.js');
module.exports = (function () {

    eslintConf.extends.forEach(function (items) {
        _.merge(fullConfig, require(items));
    });

    _.merge(fullConfig, eslintConf.env);
    _.merge(fullConfig, eslintConf.globals);

    return fullConfig;
})();

