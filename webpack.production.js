const { merge } = require("webpack-merge");
const config = require("./webpack.config.js");
const path = require("path");

module.exports = merge(config, {
    mode: "production",
    output: {
        filename: '[name].js',
    },
});