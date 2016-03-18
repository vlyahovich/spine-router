module.exports = {
    entry: './src/router.js',
    output: {
        path: __dirname + '/dist',
        filename: 'router.js',
        libraryTarget: 'umd'
    },
    externals: ['jquery', 'backbone', 'lodash'],
    module: {
        loaders: [
            {test: /\.js/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    }
};
