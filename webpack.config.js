const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const plugins = require('./plugins');
const ErrorOverlayWebpackPlugin = require("error-overlay-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'app': [
            'react-hot-loader/patch',
            './src/index.tsx'
        ]
    },
    target: 'web',
    devServer: {
        lazy: false,
        liveReload: true,
        //contentBase: path.resolve(__dirname, "./public"),
        contentBasePublicPath:  path.resolve(__dirname, "./public"),
        hot: true,
        watchContentBase: true,
        watchOptions: {
            aggregateTimeout: 200,
            poll: 1000
        },
        publicPath: '/'
    },
    output: {
        path: path.resolve(__dirname, './public'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.tsx?/,
                use: ["eslint-loader", "ts-loader"],
                exclude: /node_modules/,
                //options: {configFile: 'tsconfig.webpack.json'}
            }
        ],
    },
    devtool: 'source-map',
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './index.html',
        }),
        plugins.ESLintPlugin,

        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProgressPlugin(),
        new webpack.HotModuleReplacementPlugin({template: './index.html'}),
        new ErrorOverlayWebpackPlugin(),

    ]
};