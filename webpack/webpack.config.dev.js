'use strict';

const common = require('./webpack.config.common');

module.exports = Object.assign({}, {
    mode: 'production',
    devtool: false,
}, common);
