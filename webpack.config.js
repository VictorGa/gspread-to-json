var webpack = require('webpack');
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    resolve: {
        extensions: ['', '.js']
    },
    entry: [
	    //'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
	    //'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
	    'babel/polyfill',
	    './develop/main.js'
    ],
    output: {
        path: './build/inc/script/',
        publicPath: '/build/inc/script/',
        filename: '[name]-bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: [
	            //'react-hot',
	            //'uglify',
	            require.resolve('babel-loader')
            ] }
        ]
    },
	plugins: [
		//new webpack.HotModuleReplacementPlugin()
	],
    stats: {
        colors: true
    },
    devtool: 'source-map',
    watch: false,
    keepalive: false
};

