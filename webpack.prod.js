import { merge } from 'webpack-merge'
import { commonConfig } from './webpack.common.js'

const prodConfig = merge(commonConfig, {
    mode: 'production',
    output: {
        filename: '[name].[contenthash].js',
    },
    optimization: {
        usedExports: true,
    },
})

export default { ...prodConfig }
