 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');
 const path = require('path');
 module.exports = {
   entry: path.join(__dirname, "./src/app.ts"),
   output: {
     filename: "app.js",
     path: __dirname,
   },
   devServer: {
     disableHostCheck: true,
     host: "127.0.0.1",
     port: 9527,
   },
   module: {
     rules: [
       {
         test: /\.tsx?$/,
         loader: "ts-loader",
         exclude: /node_modules/,
       },
       {
         test: /\.(png|jpg|gif|mp3|wav)$/,
         use: [
           {
             loader: "file-loader",
             options: {},
           },
         ],
       },
     ],
   },
   resolve: {
     extensions: [".tsx", ".ts", ".js"],
   },
 };