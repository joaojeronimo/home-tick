const merge = require('webpack-merge')
const config = require('./webpack.config')

module.exports = env =>
  merge(config(env), {
    mode: 'production',
    devtool: undefined,
  })
