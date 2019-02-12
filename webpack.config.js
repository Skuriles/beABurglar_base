const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
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
            }
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
        }]),
    ],
    target: "web",
    node: {
        fs: "empty",
        net: "empty",
        tls: "empty"
    }
};