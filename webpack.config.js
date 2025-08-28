const path = require('path');

module.exports = {
    entry: path.join(__dirname, './src/app.ts'),
    output: {
        filename: 'app.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|gif|mp3|wav)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
};