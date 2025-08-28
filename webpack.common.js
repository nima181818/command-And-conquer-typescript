 const path = require('path');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
   entry: {
     app: './src/app.ts',
   },
   module:{
    rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
            test: /\.(png|jpg|gif|mp3|wav)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                      output: {
                        filename: '[name].js',
                        path: path.resolve(__dirname, 'dist'),
                      }
                    }
                }]
        },
        {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          },
      ],
   },
   resolve: {
    extensions: [ '.tsx', '.ts', '.js','.css' ],
  },
   plugins: [
     // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
     new CleanWebpackPlugin(),
     new HtmlWebpackPlugin({
       title: 'Production',
     }),
   ],
   output: {
     filename: '[name].js',
     path: path.resolve(__dirname, 'dist'),
   },
 };