import { merge } from 'webpack-merge'
import { commonConfig } from './webpack.common.js'

const devConfig = merge(commonConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
    },

    devServer: {
        watchFiles: ['./src/template.html'],
    },
})

export default { ...devConfig }
