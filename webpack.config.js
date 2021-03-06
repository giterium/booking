const path = require('path');
const webpack = require('webpack');
const plugins = require('./plugins');
const ErrorOverlayWebpackPlugin = require("error-overlay-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'development',
    stats: 'errors-only',
    devServer: {
        clientLogLevel: 'quiet',
        contentBase: path.join(__dirname, 'public'),
        port: 8080,
        host: `localhost`,
    },
    target: 'web',
    entry: {

        app: [
            'webpack-hot-middleware/client',
            './src/index.tsx'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: `[name].js`,
    },
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
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
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        'modules': false,//commonjs,amd,umd,systemjs,auto
                                        'useBuiltIns': 'usage',
                                        'targets': '> 0.25%, not dead',
                                        'corejs': 3
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.tsx?/,
                use: ["eslint-loader", "ts-loader"],
                exclude: /node_modules/,
                //options: {configFile: 'tsconfig.webpack.json'}
            }
        ]
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        plugins.ESLintPlugin,
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new ErrorOverlayWebpackPlugin(),
    ],

};
