const marge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = marge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader'],
            },
        ],
    },
});
