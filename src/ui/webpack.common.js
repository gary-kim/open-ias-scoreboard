const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: {
        control: path.join(__dirname, 'src','control.js'),
        about: path.join(__dirname, 'src', 'about.js'),
        scoreboard: path.join(__dirname, 'src', 'scoreboard.js'),
        surequit: path.join(__dirname, 'src', 'surequit.js')
    },
    output: {
        path: path.resolve(__dirname, '../../js'),
        publicPath: '/js'
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [new VueLoaderPlugin()],
    resolve: {
        extensions: ['.js', '.vue']
    }
};