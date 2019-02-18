const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: [
        './src/main.ts'
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|gif|png|svg|json|woff|ttf|html|wav|mp3)$/,
                use: {
                    loader: 'file-loader',
                    options: {}
                }
            },
            {
                test: /\.less$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'less-loader'
                ],
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../Server/public')
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: 'src/tiles',
            to: 'tiles'
        }, {
            from: 'src/levels',
            to: 'levels'
        }, {
            from: 'src/baseWindows',
            to: 'baseWindows'
        }]),
        new HtmlWebpackPlugin({
            title: 'BeABurglar',
            filename: 'index.html',
            hash: true
        })
    ],
    target: "web",
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    }
};

if (isProduction) {
    module.exports.plugins.push(
        new MiniCssExtractPlugin()
    );
}