'use strict';

const path = require('path');

module.exports = {
    entry: {
        main: path.resolve('./src/main.js')
    },
    output: {
        filename: 'pl_api.bundle.js',
        path: path.resolve('./build'),
        libraryTarget: 'var',
        library: 'PL_API'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
};
