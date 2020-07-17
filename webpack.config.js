const path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/Editable.js',
  output: {
    path: path.join(__dirname, './build'),
    filename: 'index.js',
    library: 'react-text-content-editable', 
    libraryTarget: 'umd',
    publicPath: '/build/',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: { 
    extensions: ['.js'],
    alias: { 
      'react': path.resolve(__dirname, './node_modules/react') ,
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    } 
  },
  externals: {
    // Don't bundle react or react-dom
    react: {
      commonjs: "react",
      commonjs2: "react",
      amd: "React",
      root: "React"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom",
      amd: "ReactDOM",
      root: "ReactDOM"
    }
  }
};
