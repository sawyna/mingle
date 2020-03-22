const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        popup: path.join(__dirname, 'src', 'popup', 'index.js'),
        background: path.join(__dirname, 'src', 'background', 'index.js'),
        content_scripts: path.join(__dirname, 'src', 'content_scripts', 'index.js'),
        mingle_scripts: path.join(__dirname, 'src', 'mingle_scripts', 'index.js'),
    },
    output: {
        path: path.join(__dirname, 'src', 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Popup',
            filename: 'popup.html',
            template: path.join(__dirname, 'src', 'popup', 'index.html')
        })
    ],
};