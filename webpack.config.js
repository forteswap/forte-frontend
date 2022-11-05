const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackConfig = {
    filename: 'index.html',
    favicon: path.resolve(__dirname, './public/assets/favicon-forte.png'),
    template: path.resolve(__dirname, './src/index.html'),
    minify: {
        collapseWhitespace: true,
        removeComments: true
    }
};

module.exports = {
    entry: './src/index.tsx',
    optimization: {
        runtimeChunk: true,
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    }, {
                        loader: 'resolve-url-loader',
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.js?$/,
                include: path.resolve(__dirname, 'src'),
                loader: "babel-loader",
            },
            {
                test: /\.(png|jpg|gif|webp|svg)$/i,
                include: path.resolve(__dirname, 'src'),
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 8192
                    }
                }
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: false
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin(htmlWebpackConfig),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        pathinfo: false,
    },
};