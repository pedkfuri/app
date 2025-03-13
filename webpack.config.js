const path = require('path');
//const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tcc.bundle.js',
    libraryTarget: 'commonjs2'
  },
  //externals: [nodeExternals()],
  mode: 'production'
};
