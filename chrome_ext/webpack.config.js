const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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
            {
                resolve: {
                    extensions: ['.js', '.jsx'],
                },
                test: /\.jsx?$/, 
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                  loader: 'file-loader',
                },
              },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Popup',
            filename: 'popup.html',
            template: path.join(__dirname, 'src', 'popup', 'index.html')
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'manifest.json'),
                to: path.join(__dirname, 'src', 'dist'),
            },
            {
                from: path.join(__dirname, 'images'),
                to: path.join(__dirname, 'src', 'dist', 'images'),
            }
        ]),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        pure_funcs: [
                            'console.log',
                        ],
                    },
                },
            }),
        ],
    },
};