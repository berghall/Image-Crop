const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    devServer: {
        contentBase: __dirname + '/dist',
        compress: true,
        port: 9000,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    mode: 'development',
	context: __dirname + '/src',
	entry: './index.js',
	output: {
		path: __dirname + '/dist'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Rajaustyökalu M19',
            template: './index.html',
            inlineSource: '.(js|css)$',
        }),
        new HtmlWebpackInlineSourcePlugin()
    ]
}