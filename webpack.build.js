var config = require('./webpack.config.js')

config.entry = {
  'vue-blikk': './src/index.js',
}

config.output = {
  filename: './dist/[name].js',
  library: 'VueBlikk',
  libraryTarget: 'umd'
}


module.exports = config
