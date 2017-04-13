var webpack = require('webpack');
module.exports = {
    entry: "./src/js/index",
    output: {
       path: __dirname + "/dist",
       filename: "bundle.js"
    }
}
