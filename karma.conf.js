var webpack = require('webpack');

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            'node_modules/babel-core/browser-polyfill.js',
            'bootstrap.spec.js'
        ],
        frameworks: ['mocha', 'chai'],
        preprocessors: {
            'bootstrap.spec.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
                ],
                noParse: [
                    /\/sinon\//
                ]
            },
            plugins: [
                new webpack.NormalModuleReplacementPlugin(/\/sinon\//, __dirname + '/node_modules/sinon/pkg/sinon.js')
            ],
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
