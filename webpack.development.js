const path = require("path");
const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");

module.exports = merge(config, {
    mode: "development",
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        static: {
            directory: path.resolve(__dirname, './build')
        }
    },
    output: {
        filename: '[name].js',
        assetModuleFilename: (pathData) => {
            const filepath = path
                .dirname(pathData.filename)
                .split("/")
                .slice(1)
                .join("/");
            return `${filepath}/[name].[hash][ext][query]`;
        },
    },
});